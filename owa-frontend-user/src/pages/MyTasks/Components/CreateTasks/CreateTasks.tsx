import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import "./CreateTasks.css";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  useIonRouter,
} from "@ionic/react";
import { useLocation } from "react-router";
import { arrowBack } from "ionicons/icons";

const CreateTasks: React.FC = () => {
  const location = useLocation();
  console.log(location.pathname, "path");
  const router = useIonRouter();

  const handleNextClick = () => {
    router.push("/tasks/trigger-details");
  };
  const handleBackClick = () => {
    router.push("/tasks");
  };
  return (
    <IonContent>
      <div className="flex flex-col p-2 pt-28">
        <div className="cursor-pointer rounded-md flex items-center ">
          <IonIcon
            icon={arrowBack}
            onClick={handleBackClick}
            className="pl-2"
          />
          <span className="text-lg font-medium text-black pl-2">
            Create New Task
          </span>
        </div>

        <form className="mt-2 w-full">
          <div className="mb-4">
            <IonInput
              label="Task Name *"
              labelPlacement="floating"
              fill="outline"
              // placeholder="Enter here"
              //  className=" text-black"
              mode="md"
            ></IonInput>
            {/* <TextField
            label="Task Name"
            variant="outlined"
            // placeholder="Enter task name"
            className="w-full"
            InputProps={{ className: "text-black" }}
            required
          /> */}
          </div>
          <div className="mb-4">
            <FormControl variant="outlined" className="w-full">
              <InputLabel>Select Priority</InputLabel>
              <Select label="Select Priority" className="text-black">
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mb-4">
            <TextareaAutosize
              placeholder="Enter task description"
              className="w-full border rounded-md p-2 text-black"
              style={{ minHeight: "100px" }}
              required
            />
          </div>
          <div>
            <div className="mt-0">
              <span className="text-lg font-medium text-black p-2">
                Task Detail
              </span>
            </div>
            <div
              className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2"
              style={{ width: "98%" }}
            >
              <div className="flex items-center mt-2 p-2">
                <IonIcon
                  src="Assets/images/CreateTasks/create_task_calender.svg"
                  className="calender-img"
                />
                <span className="ml-1 text-base font-medium text-black">
                  June 17, 2024
                </span>
              </div>
            </div>
            <div
              className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2"
              style={{ width: "98%" }}
            >
              <div className="flex items-center mt-2 p-2">
                <IonIcon
                  src="Assets/images/CreateTasks/create_task_profile.svg"
                  className="calender-img"
                />
                <span className="ml-1 text-base font-medium text-black">
                  Assignee
                </span>
              </div>
            </div>
          </div>

          <div className="custom-btn flex justify-center pt-28 inset-x-2">
            <IonButton
              color="danger"
              className="rounded w-full "
              onClick={() => handleNextClick()}
              type="submit"
            >
              Next
            </IonButton>
          </div>
        </form>
      </div>
    </IonContent>
  );
};

export default CreateTasks;
