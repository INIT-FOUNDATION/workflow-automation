import React from "react";
import {
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "./CreateTasks.css";
import { IonIcon, IonInput, useIonRouter } from "@ionic/react";

const CreateTasks: React.FC = () => {
  const router = useIonRouter();

  const handleNextClick = () => {
    console.log("Create new task clicked");
    router.push("/trigger-details");
  };
  return (
    <div className="flex flex-col p-2 mt-20">
      <div className="cursor-pointer rounded-md flex items-center pt-8">
        <IconButton>
          <ArrowBack />
        </IconButton>
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
            maxlength={10}
            //  className=" text-black"
            required
            mode="md"
            type="tel"
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
            <div className="flex items-center mt-2 p-4">
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
            <div className="flex items-center mt-2 p-4">
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
        <div className="flex-grow">
          <div className="flex justify-center pb-16">
            <Button
              onClick={() => handleNextClick()}
              variant="contained"
              color="error"
              className="w-full"
              type="submit"
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTasks;
