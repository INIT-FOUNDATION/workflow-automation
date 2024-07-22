import {
  IonCard,
  IonCardContent,
  IonDatetime,
  IonIcon,
  IonInput,
  useIonRouter,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import {
  getDepartmentList,
  getUserListbyDepId,
  getTaskListByWorkflowId,
  createAssignment,
} from "../../MyTasks.service";
import { useLocation } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import "./WorkFlowStarted.css";
import { useForm } from "react-hook-form";
import moment from "moment";

const WorkFlowStarted: React.FC = () => {
  const [assignee, setAssignee] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [assigneeList, setAssigneeList] = useState<any[]>([]);
  const [taskList, setTaskList] = useState<any[]>([]);
  const location = useLocation<any>();
  const router = useIonRouter();
  const workflow = location.state;

  const { handleSubmit } = useForm({
    defaultValues: {
      workflow_id: workflow.workflow_id,
      task_assignments: [],
    },
  });

  const handleAssigneeChange = (event: SelectChangeEvent<string>) => {
    setAssignee(event.target.value);
  };

  const handleDepartmentChange = async (event: SelectChangeEvent<string>) => {
    const selectedDeptId = event.target.value;
    setDepartment(selectedDeptId);
    try {
      const response = await getUserListbyDepId(parseInt(selectedDeptId));
      if (response && response.data && response.data.data) {
        setAssigneeList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching department assignees:", error);
    }
  };

  const handleGetTaskListByWorkflowId = async () => {
    try {
      const response = await getTaskListByWorkflowId(workflow.workflow_id);
      if (response && response.data && response.data.data) {
        setTaskList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching task list:", error);
    }
  };

  const handleBack = () => {
    router.push("/tasks/workflow-selection");
  };

  const handleAssignmentCreate = async (data: any) => {
    const task_assignments = taskList.map((task) => ({
      task_id: task.task_id,
      assigned_to: parseInt(assignee),
      deadline_on: moment().format("YYYY-MM-DD"),
    }));

    const payload = {
      workflow_id: data.workflow_id,
      task_assignments: task_assignments,
    };

    try {
      const response = await createAssignment(payload);
      router.push("/tasks");
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  useEffect(() => {
    handleGetTaskListByWorkflowId();
    const getDepartmentListData = async () => {
      try {
        const response = await getDepartmentList();
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setDepartmentList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching department list:", error);
      }
    };

    getDepartmentListData();
  }, [workflow.workflow_id]);

  return (
    <div>
      <div className="cursor-pointer rounded-md flex items-center pt-28">
        <IonIcon icon={arrowBack} onClick={handleBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">
          {workflow.workflow_name}
        </span>
      </div>
      <form onSubmit={handleSubmit(handleAssignmentCreate)}>
        {taskList.length > 0 &&
          taskList.map((task) => (
            <IonCard
              key={task.task_id}
              className="custom-cards border rounded-lg mb-2 bg-neutral-100 shadow-md"
            >
              <IonCardContent>
                <div className="flex items-center">
                  <img
                    src="Assets/images/MyTasks/task_done.svg"
                    alt=""
                    className="task-done-img w-5 h-5 mr-2"
                  />
                  <span className="form-title">{task.task_name}</span>
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
                    <IonInput
                      label="Select Deadline"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Enter here"
                      maxlength={10}
                      required
                      mode="md"
                      type="date"
                      className="w-full text-black"
                    ></IonInput>
                  </FormControl>

                  <div className="flex items-center mt-2 pb-2">
                    <img
                      src="Assets/images/AssignTasks/profile_icon.svg"
                      alt=""
                      className="calender-img w-4 h-4 mr-2"
                    />
                    <span className="text-black deadline-label">
                      Department
                    </span>
                  </div>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      label="Select Department"
                      value={department}
                      onChange={handleDepartmentChange}
                      className="w-full text-black"
                    >
                      {departmentList.map((department) => (
                        <MenuItem
                          key={department.department_id}
                          value={department.department_id}
                        >
                          {department.department_name}
                        </MenuItem>
                      ))}
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
                      {assigneeList.map((assignee) => (
                        <MenuItem
                          key={assignee.user_id}
                          value={assignee.user_id}
                        >
                          {assignee.display_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </form>
              </IonCardContent>
            </IonCard>
          ))}
        <div className="flex justify-center pb-10">
          <button type="submit" className="w-full create-task-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkFlowStarted;
