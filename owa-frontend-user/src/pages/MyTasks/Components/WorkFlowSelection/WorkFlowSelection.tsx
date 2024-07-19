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
import { getWorkflowList, getWorkflowListById } from "../../MyTasks.service";
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
  const [workflow, setWorkflow] = useState<string>("");
  const [workflowId, setWorkflowId] = useState<number | null>(null);
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
    setWorkflow(selectedWorkflowName);
    setWorkflowId(selectedWorkflow ? selectedWorkflow.workflow_id : null);
  };

  const handleNextClick = async () => {
    if (workflowId) {
      try {
        const response = await getWorkflowListById(workflowId);
        if (response) {
          history.push("/tasks/workflow-started", { workflowName: workflow,taskName: response.data.data[0].task_name });
        }
      } catch (error) {
        console.error("Error fetching workflow details:", error);
        setError("Failed to fetch workflow details. Please try again later.");
      }
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
      <form className="mb-4 pt-2">
        <FormControl fullWidth>
          <InputLabel>Select Workflow</InputLabel>
          <Select
            label="Select Workflow"
            value={workflow}
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
      </form>
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
