import React, { useState, useEffect } from "react";
import { IonIcon, useIonRouter } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { getWorkflowList } from "../../MyTasks.service";
import "./WorkFlowSelection.css";

interface Workflow {
  workflow_id: number;
  workflow_name: string;
  workflow_description: string;
  status: number;
  created_by: number;
  updated_by: number;
}

const WorkFlowSelection: React.FC = () => {
  const [workflow, setWorkflow] = useState<any>("");
  const [workflowList, setWorkflowList] = useState<Workflow[]>([]);
  const [error, setError] = useState<string>("");
  const router = useIonRouter();
  const history = useHistory();

  useEffect(() => {
    const fetchWorkflowList = async () => {
      try {
        const response = await getWorkflowList();
        if (response && response.data && response.data.data.workflowList) {
          setWorkflowList(response.data.data.workflowList);
        }
      } catch (error) {
        console.error("Error fetching workflow list:", error);
        setError("Failed to fetch workflow list. Please try again later.");
      }
    };

    fetchWorkflowList();
  }, []);

  const handleWorkflowChange = (event: SelectChangeEvent<string>) => {
    const selectedWorkflowName = event.target.value;
    const selectedWorkflow = workflowList.find(
      (wf) => wf.workflow_name === selectedWorkflowName
    );
    setWorkflow(selectedWorkflow);
  };

  const handleNextClick = async () => {
    if (workflow) {
      history.push("/tasks/workflow-started", workflow);
    } else {
      setError("Please select a workflow before proceeding.");
    }
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
      <div className="mb-4 pt-2">
        <FormControl fullWidth>
          <InputLabel>Select Workflow</InputLabel>
          <Select
            label="Select Workflow"
            value={workflow.workflow_name}
            onChange={handleWorkflowChange}
            className="w-full text-black"
          >
            {workflowList.length > 0 ? (
              workflowList.map((wf) => (
                <MenuItem key={wf.workflow_id} value={wf.workflow_name}>
                  {wf.workflow_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No workflows available</MenuItem>
            )}
          </Select>
        </FormControl>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-center pb-16">
        <button onClick={handleNextClick} className="w-full create-task-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default WorkFlowSelection;
