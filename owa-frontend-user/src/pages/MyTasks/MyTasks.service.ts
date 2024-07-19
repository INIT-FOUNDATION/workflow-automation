import { get } from "../../utility/ApiCall";

const getWorkflowList = async () => {
  const getWorkflowListData = await get("api/v1/workflow/list");
  return getWorkflowListData;
};
const getWorkflowListById = async (workflowID:any) => {
  const gettingWorkflowListById = await get(
    `/api/v1/workflow/taskList/${workflowID}`
  );
  return gettingWorkflowListById;
};


const getDepartmentList = async() =>{
  const getDepartmentListData = await get(`/api/v1/admin/departments/list`);
  return  getDepartmentListData;
}

const getDepartmentListByDeptId = async(departmentId:any) =>{
  const getDepartmentListById = await get(`/api/v1/admin/users/list/department/${departmentId}`);
  return  getDepartmentListById;
}


export { getWorkflowList, getWorkflowListById, getDepartmentList, getDepartmentListByDeptId };
