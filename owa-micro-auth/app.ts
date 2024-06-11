import express, {
  Express,
  Request,
  Response,
  NextFunction,
  Application,
} from "express";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import routes from "./startup/routes";
import { AUTH } from "./constants/AUTH";

import { SECURITY, logger } from "lss-micro-common";

declare global {
  namespace Express {
    interface Request {
      plainToken?: PlainToken;
    }
  }
}
interface PlainToken {
  emailId: string;
  user_name: string;
  user_id: string;
  role_id: string;
}

dotenv.config();

const app: Express = express();

const resolveCrossDomain = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip'
  );
  res.header("Access-Control-Expose-Headers", "Version");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Strict-Transport-Security", "max-age=15552000");
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};

// Set appVersion number to Header
const setAppVersiontoHeader = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  next();
};

app.use(fileUpload());
app.set("view engine", "ejs");
app.use(helmet());
app.use(resolveCrossDomain, setAppVersiontoHeader);

app.use(function applyXFrame(req: Request, res: Response, next: NextFunction) {
  res.set("X-Frame-Options", "DENY");
  next();
});

SECURITY(app, AUTH);
routes(app);

process.on("uncaughtException", function (err) {});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  logger.info(`[SERVER STARTED] Listening to port [${port}]`);
});

if (process.env.LSS_KAFKA_TOTAL_PARTITIONS)
  logger.info("app :: Kafka Dynamic Partioning Enabled");

export = server;
