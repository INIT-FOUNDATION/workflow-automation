import { get } from "../../utility/ApiCall";

const getWorkflowList = async () => {
  const getWorkflowListData = await get("api/v1/workflow/list");
  return getWorkflowListData;
};

export { getWorkflowList };
