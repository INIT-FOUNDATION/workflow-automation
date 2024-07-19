import { IonCard, IonCardContent, IonIcon, useIonRouter } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { getDepartmentList, getUserListbyDepId } from "../../MyTasks.service";
import { useHistory, useLocation } from "react-router-dom";
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
  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [assigneeList, setAssigneeList] = useState([]);
  const history = useHistory();
  const location = useLocation<{ workflowName: string ;taskName: string}>();
  const router = useIonRouter();

  const handleDeadlineChange = (event: SelectChangeEvent) => {
    setDeadline(event.target.value as string);
  };

  const handleAssigneeChange = (event: SelectChangeEvent) => {
    setAssignee(event.target.value as string);
  };

  const handleDepartmentChange = async (event: SelectChangeEvent) => {
    const selectedDeptId = event.target.value as string;
    setDepartment(selectedDeptId);
    try {
      const response = await getUserListbyDepId(selectedDeptId);
      console.log("Department Assignees Response:", response);
      if (response && response.data && response.data.data) {
       
      }
      setAssigneeList(response.data.data)
    } catch (error) {
      console.error("Error fetching department assignees:", error);
    }
  };

  const handleBack = () => {
    router.push("/tasks/workflow-selection");
  };

  useEffect(() => {
    const getDepartmentListData = async () => {
      try {
        const response = await getDepartmentList();
        console.log("API Response:", response);
        if (response && response.data && response.data.data && response.data.data.length > 0) {
          setDepartmentList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching department list:", error);
      }
    };

    getDepartmentListData();
  }, []);

  const workflowName = location.state?.workflowName || "B2B lead conversion";
  const taskName = location.state?.taskName || "Contact Lead";


  return (
    <div>
      <div className="cursor-pointer rounded-md flex items-center pt-28">
        <IonIcon icon={arrowBack} onClick={handleBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">
          {workflowName}
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
            <span className="form-title">{taskName}</span>
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
              <span className="text-black deadline-label">Department</span>
            </div>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                label="Select Department"
                value={department}
                onChange={handleDepartmentChange}
                className="w-full text-black"
              >
                {departmentList.map((department: any) => (
                  <MenuItem key={department.department_id} value={department.department_id}>
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
                {assigneeList.map((assignee: any) => (
                  <MenuItem key={assignee.id} value={assignee.name}>
                    {assignee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default WorkFlowStarted;
