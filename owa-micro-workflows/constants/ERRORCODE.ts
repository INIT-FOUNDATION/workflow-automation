export const ERRORCODE = {
  ERROR0001: "Something Went Wrong!",
 
};

export const WORKFLOWS = {
  WORKF0001: "WORKF0001",
  WORKF0002: {
    errorCode: "WORKF0001",
    errorMessage: "Workflow name must be between 3 and 50 characters.",
  },
  WORKF0003: {
    errorCode: "WORKF0002",
    errorMessage: " Workflow description is required.",
  },
  WORKF0004: {
    errorCode: "WORKF0004",
    errorMessage: " Workflow Id required.",
  },
  WORKF0005: {
    errorCode: "WORKF0005",
    errorMessage: " Invalid Request",
  }
};

