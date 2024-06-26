import { IonCard, IonCardContent, IonIcon, useIonRouter } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import "./WorkFlowStarted.css";
const WorkFlowStarted: React.FC = () => {
  const [deadline, setDeadline] = useState("");
  const [assignee, setAssignee] = useState("");
  const router = useIonRouter();

  const handleDeadlineChange = (event: SelectChangeEvent) => {
    setDeadline(event.target.value as string);
  };

  const handleAssigneeChange = (event: SelectChangeEvent) => {
    setAssignee(event.target.value as string);
  };

  const handleBack = () => {
    router.push("/tasks/workflow-selection");
  };
  return (
    <div>
      <div className="cursor-pointer rounded-md flex items-center pt-32">
        <IonIcon icon={arrowBack} onClick={handleBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">
          B2B lead conversion
        </span>
      </div>
      <IonCard className="custom-cards border rounded-lg mb-2 bg-neutral-100 shadow-md">
        <IonCardContent>
          <div className="flex items-center">
            <img
              src="Assets/images/MyTasks/task_done.svg"
              alt=""
              className="task-done-img w-5 h-5 mr-2"
            />
            <span className="form-title">Contact Lead</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/AssignTasks/calendar_month.svg"
              alt=""
              className="calender-img w-4 h-4 mr-2"
            />
            <span className="text-black deadline-label">Deadline</span>
          </div>
          <form className="mb-4 pt-2">
            <FormControl fullWidth>
              <InputLabel>Select Deadline</InputLabel>
              <Select
                label="Select Deadline"
                value={deadline}
                onChange={handleDeadlineChange}
                className="w-full text-black"
              >
                <MenuItem value="2024-06-21">2024-06-21</MenuItem>
                <MenuItem value="2024-06-22">2024-06-22</MenuItem>
                <MenuItem value="2024-06-23">2024-06-23</MenuItem>
              </Select>
            </FormControl>
            <div className="flex items-center mt-2 pb-2">
              <img
                src="Assets/images/AssignTasks/profile_icon.svg"
                alt=""
                className="calender-img w-4 h-4 mr-2"
              />
              <span className="text-black deadline-label">Assignee</span>
            </div>
            <FormControl fullWidth>
              <InputLabel>Select Assignee</InputLabel>
              <Select
                label="Select Assignee"
                value={assignee}
                onChange={handleAssigneeChange}
                className="w-full text-black"
              >
                <MenuItem value="2024-06-21">Neha</MenuItem>
                <MenuItem value="2024-06-22">Sumit</MenuItem>
              </Select>
            </FormControl>
          </form>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default WorkFlowStarted;
