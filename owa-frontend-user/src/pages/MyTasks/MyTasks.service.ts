import { get, post } from "../../utility/ApiCall";

const getWorkflowList = async () => {
  const getWorkflowListData = await get("api/v1/workflow/list");
  return getWorkflowListData;
};
const getTaskListByWorkflowId = async (workflowID: any) => {
  const gettingWorkflowListById = await get(
    `/api/v1/workflow/taskList/${workflowID}`
  );
  return gettingWorkflowListById;
};

const getDepartmentList = async () => {
  const getDepartmentListData = await get(`/api/v1/admin/departments/list`);
  return getDepartmentListData;
};

const getUserListbyDepId = async (departmentId: number) => {
  const usersList = await get(
    `/api/v1/admin/users/list/department/${departmentId}`
  );
  return usersList;
};

const createAssignment = async (data: any) => {
  const response = await post("api/v1/workflow/assignment/create", data);
  return response;
};

const createTasksForm = async (data: any) => {
  const response = await post("api/v1/workflow/assignment/taskFormSubmission", data);
  return response;
};


const getTasksList = async () => {
  const tasksList = await get(`/api/v1/workflow/assignment/myTasks`);
  return tasksList;
};

const getAssignedTasksList = async () => {
  const AssignedTasksLists = await get(`/api/v1/workflow/assignment/assignedTasks`);
  return AssignedTasksLists;
};

const getTasksFormById = async (formId: number) => {
  const taskListById = await get(`/api/v1/forms/details/${formId}`);
  return taskListById;
};

const submitTaskForm = async (data: any) => {
  const response = await post("/api/v1/workflow/assignment/taskFormSubmission", data);
  return response;
};

const getTaskFormDataByTaskAssignmentId = async (workflowTaskAssignmentId: number) => {
  const response = await get(`/api/v1/workflow/assignment/getSubmittedTaskForm/${workflowTaskAssignmentId}`);
  return response;
};

export {
  getWorkflowList,
  getTaskListByWorkflowId,
  getDepartmentList,
  getUserListbyDepId,
  createAssignment,
  getTasksList,
  getAssignedTasksList,
  getTasksFormById,
  createTasksForm,
  submitTaskForm,
  getTaskFormDataByTaskAssignmentId
};
