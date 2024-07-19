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


export { getWorkflowList,getWorkflowListById };
