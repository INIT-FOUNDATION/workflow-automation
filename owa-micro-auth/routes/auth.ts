import express, { Request, Response } from "express";
import {  validateLoginDetails } from "../model/auth";
import { STATUS, redis, generateToken, logger, SECRET_KEY, passwordPolicy } from "owa-micro-common";
import { ERRORCODE } from "../constants/ERRORCODE";
import { AUTH } from "../constants/AUTH";
import { decryptPayload, SERVICES } from "../constants/CONST";
import { 
  selectUser, 
  checkUser,
  setForgotPasswordOTPInRedis, 
  shareForgotOTPUserDetails,
  getRoleModuleList,
  getInvalidLoginAttempts,
  getMaxInvalidLoginAttempts,
  incrementInvalidLoginAttempts,
  setUserInactive,
  updateUserLoggedInOut,
  resetPassword
 } from "../services/authService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export const authRouter = express.Router();

authRouter.get("/health", async (req: Request, res: Response) => {
  try {
    return res.status(STATUS.OK).send("Auth Service is Healthy");
  } catch (error) {
    logger.error("auth :: health :: ", error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ errorCode: error, error });
  }
});



authRouter.get('/validateToken', async (req: Request, res: Response) => {
  const token = req.header("authorization");
  try {
      jwt.verify(token, SECRET_KEY.SECRET_KEY);
      res.status(STATUS.OK).send({message: "Success"});
  } catch (ex) {
      res.status(STATUS.UNAUTHORIZED).send({message: "Unauthenticated access!"});
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
      const {error} = await validateLoginDetails(req.body);
      logger.error("ERROR", error);

      if (error) {
          if (error.details)
              return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
          else return res.status(STATUS.BAD_REQUEST).send(error.message);
      }

      const userResponse = await selectUser(req.body.user_name);
      if (!userResponse[0]) {
          return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.USRAUT0001}"}`);
      }

      const userId = userResponse[0].user_id;

      const userRoleModuleData = await getRoleModuleList(userResponse[0].role_id)
      const userData = userResponse[0];
      const type = 1;

      req.body.password = decryptPayload(req.body.password);
      if (req.body.password == SERVICES.default_pass) {
           return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0007", "error":"${ERRORCODE.USRAUT0007}", "userId": "${userId}"}`);
      }

      const validPassword = await bcrypt.compare(req.body.password, userData.password);
      const policy = await passwordPolicy.validate_password(userId, req.body.password, type);

      if (validPassword && policy.status == true) {
          const token = await generateToken.generate(userData.user_name, userData, userRoleModuleData, req)
          res.status(STATUS.OK).send(token.encoded);
          return;
      }

      const [invalidAttemptsData] = await getInvalidLoginAttempts(req.body.user_name);
      const invalidAttempts = invalidAttemptsData.invalid_attempts;
      const [maxInvalidAttemptsData] = await getMaxInvalidLoginAttempts();
      const maxInvalidAttempts = maxInvalidAttemptsData.max_invalid_attempts;

      if (maxInvalidAttempts > invalidAttempts) {
          await incrementInvalidLoginAttempts(req.body.user_name);
      } else {
          await setUserInactive(req.body.user_name);
          return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0005", "error":"${ERRORCODE.USRAUT0005}"}`);
      }

      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.USRAUT0001}"}`);

  } catch (e) {
      logger.error(e)
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.USRAUT0001}"}`);
  }
});

authRouter.post('/postLoginUserUpdate', async (req: Request, res: Response) => {
  try {
      await updateUserLoggedInOut(1, req.body.user_name);
      res.status(STATUS.OK).send('User login details successfully updated!');
  } catch (error) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
  }
});

authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
      await updateUserLoggedInOut(0, req.plainToken.user_name);
      redis.deleteKey(req.plainToken.user_name);
      redis.deleteKey(`USER_PERMISSIONS_${req.plainToken.user_name}`);
      redis.deleteKey(`LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`);
      redis.deleteKey(`User|Username:${req.plainToken.user_name}`);
      redis.deleteKey(`COMBINED_ACCESS_LIST|USER:${req.plainToken.user_id}`);
      res.status(STATUS.OK).send(`Username | ${req.plainToken.user_name} | Successfully Logged Out!!`);
  } catch (error) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
  }
});

//getForgetPasswordOtp
authRouter.post('/getForgetPasswordOtp', async (req: Request, res: Response) => {
  try {
      let mobile_number = req.body.mobile_number;
      if (!mobile_number || mobile_number.toString().length !== 10) {
          return res.status(STATUS.BAD_REQUEST).json({ errorCode: "CONFIG0023", error: ERRORCODE.CONFIG0023 });
      }

      const phoneNumberExists = await selectUser(mobile_number);
      if (!phoneNumberExists[0]) {
          return res.status(STATUS.OK).send({
              "txnId": uuidv4()
          });
      }

      let key = `Admin_Forgot_Password|User:${mobile_number}`;
      let redisResult = await redis.GetRedis(key);

      if (redisResult[0]) {
          var userData = JSON.parse(redisResult);
          return res.status(STATUS.BAD_REQUEST).send({
              "errorCode": "USRAUT0011",
              "error": "OTP Already Sent!",
              "txnId": userData.txnId
          });
      } else {
          let new_txn_id = uuidv4();
          let otp = Math.floor(100000 + Math.random() * 900000);

          let userdata = {}
          userdata.user_name = mobile_number;
          userdata.txnId = new_txn_id;
          userdata.otp = otp;
          userdata.mobile_no = mobile_number;
          userdata.school_id = phoneNumberExists[0].school_id;
          userdata.trust_id = phoneNumberExists[0].trust_id;

          setForgotPasswordOTPInRedis(userdata);
          await shareForgotOTPUserDetails(userdata);
          res.status(STATUS.OK).send({
              "txnId": new_txn_id
          });
      }
  } catch (err) {
      console.error(`Error in getForgetPasswordOtp API: ${err}`);
      res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
  }
});

// verifyForgetPasswordOtp
authRouter.post('/verifyForgetPasswordOtp', async (req: Request, res: Response) => {

  let otp = decryptPayload(req.body.otp);
  let txnId = req.body.txnId;

  if (!otp || !txnId) {
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.USRAUT0012}"}`);
  }

  try {
      let key = `Admin_Forgot_Password|txnId:${txnId}`;
      let redisResult = await redis.GetRedis(key);

      if (redisResult) {
          let UserData = JSON.parse(redisResult);
          if (UserData.otp != parseInt(otp) || UserData.txnId !== txnId.toString()) {
              return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.USRAUT0014}" }`);
          } else {
              let user_name = UserData.user_name;
              const checkUserData = await checkUser(user_name);
              if (checkUserData[0]) {
                  let new_txnId = uuidv4();
                  let mobile_key = `Admin_Forgot_Password|User:${user_name}`;
                  let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${new_txnId}`;
                  await redis.deleteKey(mobile_key);
                  await redis.deleteKey(key);
                  redis.SetRedis(forgotPasswordChangeKey, { user_name }, 180);
                  return res.status(STATUS.OK).send({ message: 'OTP Verified Successfully', txnId: new_txnId });
              } else {
                  return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.USRAUT0014}" }`);
              }
          }
      } else {
          return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.USRAUT0014}" }`);
      }
  } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"USRAUT0019", "error":"${ERRORCODE.USRAUT0019}"}`);
  }
});

// RESET FORGET PASSWORD 
authRouter.post('/resetForgetPassword', async (req: Request, res: Response) => {
  try {
      let newPassword = decryptPayload(req.body.newPassword);
      let confirmNewPassword = decryptPayload(req.body.confirmNewPassword);
      const { txnId } = req.body;

      if (!txnId) {
          return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00027", "error":"${ERRORCODE.USRPRF00027}"}`);
      }

      if (newPassword !== confirmNewPassword) {
          return res.status(STATUS.BAD_REQUEST).send({  "error": "Passwords do not match" });
      }

      if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(newPassword)) {
          return res.status(STATUS.BAD_REQUEST).send({ "error": "Password must be at least 8 characters long and contain at least one letter and one digit" });
      }

      const redisResult = await redis.GetRedis(`FORGOT_PASSWORD_CHANGE_${txnId}`);

      if (!redisResult) {
          return res.status(STATUS.BAD_REQUEST).send({  "error": "Invalid forgot password request" });
      }

      let userData;
      try {
          userData = JSON.parse(redisResult);
      } catch (error) {
          return res.status(STATUS.BAD_REQUEST).send({ "error": "Invalid Forgot Password Request" });
      }

      if (!userData || !userData.user_name) {
          return res.status(STATUS.BAD_REQUEST).send({ "error": "Mobile number not found" });
      }

      const mobileNumber = userData.user_name;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const passwordUpdated = await resetPassword(hashedPassword, mobileNumber);

      if (passwordUpdated) {
          
          await redis.deleteKey(`FORGOT_PASSWORD_CHANGE_${txnId}`);
          await redis.deleteKey(`Admin_Forgot_Password|User:${mobileNumber}`);
          await redis.deleteKey(`User|Username:${mobileNumber}`);
          await redis.deleteKey(mobileNumber);
          res.status(STATUS.OK).json({ message: 'Password updated successfully' });
      } else {
          res.status(STATUS.BAD_REQUEST).json({ "error": 'Password Reset Timeout'});
      }

  } catch (error) {
      console.error('Error updating password:', error);
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ "error": 'Internal server error' });
  }
});
