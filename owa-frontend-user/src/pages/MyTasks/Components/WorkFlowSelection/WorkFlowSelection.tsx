import React, { useState } from "react";
import {
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import "./WorkFlowSelection.css";

const WorkFlowSelection: React.FC = () => {
  const [workflow, setWorkflow] = useState("");
  const router = useIonRouter();

  const handleWorkflowChange = (event: SelectChangeEvent) => {
    setWorkflow(event.target.value as string);
  };
  const handleNextClick = () => {
    router.push("/tasks/workflow-started");
  };

  const handleBack = () => {
    router.push("/tasks");
  };
  return (
    <div className="flex flex-col h-screen p-2 pt-28">
      <div className="cursor-pointer rounded-md flex items-center">
        <IonIcon icon={arrowBack} onClick={handleBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">Choose workflow</span>
      </div>
      <form className="mb-4 pt-2">
        <FormControl fullWidth>
          <InputLabel>Select Workflow</InputLabel>
          <Select
            label="Select Workflow"
            value={workflow}
            onChange={handleWorkflowChange}
            className="w-full text-black"
          >
            <MenuItem value="2024-06-21">2024-06-21</MenuItem>
            <MenuItem value="2024-06-22">2024-06-22</MenuItem>
            <MenuItem value="2024-06-23">2024-06-23</MenuItem>
          </Select>
        </FormControl>
      </form>
      <div className="flex-grow"></div>
      <div className="flex justify-center pb-16">
        <IonButton
          onClick={() => handleNextClick()}
          color="danger"
          className="w-full"
        >
          Next
        </IonButton>
      </div>
    </div>
  );
};

export default WorkFlowSelection;
