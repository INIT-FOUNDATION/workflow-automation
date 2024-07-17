import { CACHE_TTL } from "../constants/CONST";
import { redis, logger, pg } from "owa-micro-common";
import { IWorkflow, IWorkflowTask, IWorkflowNotificationTask, IWorkflowDecisionTask, IWorkflowDecisionCondition,
    IWorkflowTransition, IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
 } from "../types/custom";
 import { WORKFLOW } from "../constants/QUERY";
import moment from "moment";


export const workflowRepository = {

    createWorkflow: async(workflow: IWorkflow) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflow`);
            const _query = {
                text: WORKFLOW.createWorkflow,
                values: [ workflow.workflow_name, workflow.workflow_description, workflow.created_by, workflow.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflow :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflow :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateWorkflow: async(workflow: IWorkflow) => {
        try {
            logger.info(`workflowRepository :: Inside updateWorkflow`);
            const _query = {
                text: WORKFLOW.updateWorkflow,
                values: [ workflow.workflow_id, workflow.workflow_name, workflow.workflow_description, workflow.status, workflow.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: updateWorkflow :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: updateWorkflow :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    createWorkflowTask: async(task: IWorkflowTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTask`);
            const _query = {
                text: WORKFLOW.createWorkflowtask,
                values: [task.workflow_id, task.node_id, task.task_name, task.task_description, task.form_id, task.x_axis, task.y_axis, task.created_by, task.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTask :: result :: ${JSON.stringify(result)}`);
            return result[0].task_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTask :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateWorkflowTask: async(task: IWorkflowTask) => {
        try {
            logger.info(`workflowRepository :: Inside updateWorkflowTask`);
            const _query = {
                text: WORKFLOW.updateWorkflowTask,
                values: [task.task_id, task.workflow_id, task.node_id, task.task_name, task.task_description, task.form_id,
                     task.status, task.x_axis, task.y_axis, task.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: updateWorkflowTask :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: updateWorkflowTask :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowNotificationTasks: async(notificationTask: IWorkflowNotificationTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowNotificationTasks`);
            const _query = {
                text: WORKFLOW.ceateWorkflowNotificationTasks,
                values: [notificationTask.workflow_id, notificationTask.node_id, notificationTask.notification_task_name, 
                    notificationTask.notification_task_description, notificationTask.notification_type, 
                    notificationTask.email_subject, notificationTask.email_body, notificationTask.sms_body, 
                    notificationTask.template_id, notificationTask.placeholders, notificationTask.recipient_emails, 
                    notificationTask.recipient_mobilenumber, notificationTask.x_axis, notificationTask.y_axis, 
                    notificationTask.created_by, notificationTask.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowNotificationTasks :: result :: ${JSON.stringify(result)}`);
            return result[0].notification_task_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowNotificationTasks :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateWorkflowNotificationTasks: async(notificationTask: IWorkflowNotificationTask) => {
        try {
            logger.info(`workflowRepository :: Inside updateWorkflowNotificationTasks`);
            const _query = {
                text: WORKFLOW.updateWorkflowNotificationTasks,
                values: [notificationTask.notification_task_id, notificationTask.workflow_id,
                     notificationTask.notification_task_name, notificationTask.notification_task_description, 
                     notificationTask.notification_type, notificationTask.node_id, notificationTask.email_subject, 
                     notificationTask.email_body, notificationTask.sms_body, notificationTask.template_id, 
                     notificationTask.placeholders, notificationTask.recipient_emails, 
                     notificationTask.recipient_mobilenumber, notificationTask.status, 
                     notificationTask.x_axis, notificationTask.y_axis, notificationTask.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: updateWorkflowNotificationTasks :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: updateWorkflowNotificationTasks :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowDecisionTasks: async(decisionTask: IWorkflowDecisionTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowDecisionTasks`);
            const _query = {
                text: WORKFLOW.createWorkflowDecisionTasks,
                values: [decisionTask.workflow_id, decisionTask.node_id, decisionTask.decision_task_name,
                     decisionTask.decision_task_description, decisionTask.x_axis, decisionTask.y_axis,
                      decisionTask.created_by, decisionTask.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowDecisionTasks :: result :: ${JSON.stringify(result)}`);
            return result[0].decision_task_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowDecisionTasks :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateWorkflowDecisionTasks: async(decisionTask: IWorkflowDecisionTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside updateWorkflowDecisionTasks`);
            const _query = {
                text: WORKFLOW.updateWorkflowDecisionTasks,
                values: [decisionTask.decision_task_id, decisionTask.workflow_id, decisionTask.node_id,
                     decisionTask.decision_task_name, decisionTask.decision_task_description, decisionTask.status,
                     decisionTask.x_axis, decisionTask.y_axis, decisionTask.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: updateWorkflowDecisionTasks :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: updateWorkflowDecisionTasks :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowDecisionConditions: async(decisionCondition: IWorkflowDecisionCondition) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowDecisionConditions`);
            const _query = {
                text: WORKFLOW.createWorkflowDecisionConditions,
                values: [decisionCondition.decision_task_id, decisionCondition.operand_one, decisionCondition.operator,
                     decisionCondition.operand_two, decisionCondition.created_by, decisionCondition.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowDecisionConditions :: result :: ${JSON.stringify(result)}`);
            return result[0].condition_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowDecisionConditions :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateWorkflowDecisionConditions: async(decisionCondition: IWorkflowDecisionCondition)=> {
        try {
            logger.info(`workflowRepository :: Inside updateWorkflowDecisionConditions`);
            const _query = {
                text: WORKFLOW.updateWorkflowDecisionConditions,
                values: [decisionCondition.condition_id, decisionCondition.decision_task_id, 
                    decisionCondition.operand_one, decisionCondition.operator, decisionCondition.operand_two, 
                    decisionCondition.status, decisionCondition.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: updateWorkflowDecisionConditions :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: updateWorkflowDecisionConditions :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },


    createWorkflowTransition: async(transition: IWorkflowTransition) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTransition`);
            const _query = {
                text: WORKFLOW.createWorkflowTransition,
                values: [transition.workflow_id, transition.from_task_id, transition.to_task_id, transition.condition_type, transition.created_by, transition.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTransition :: result :: ${JSON.stringify(result)}`);
            return result[0].transition_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTransition :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    deleteWorkflowTransition: async(workflowId: Number) => {
        try {
            logger.info(`workflowRepository :: Inside deleteWorkflowTransition`);
            const _query = {
                text: WORKFLOW.deleteWorkflowTransition,
                values: [workflowId]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: deleteWorkflowTransition :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: deleteWorkflowTransition :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowsAssignment: async(assignment: IWorkflowAssignment) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowsAssignment`);
            const _query = {
                text: WORKFLOW.createWorkflowsAssignment,
                values: [assignment.workflow_id, assignment.workflow_triggered_on, assignment.workflow_triggered_by, assignment.created_by, assignment.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowsAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_assignment_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowsAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTaskAssignment: async(taskAssignment: IWorkflowTaskAssignment) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTaskAssignment`);
            const _query = {
                text: WORKFLOW.createWorkflowTaskAssignment,
                values: [taskAssignment.workflow_assignment_id, taskAssignment.task_id, taskAssignment.assigned_to, taskAssignment.assigned_on, taskAssignment.assigned_by, taskAssignment.created_by, taskAssignment.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTaskAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_task_assignment_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTaskAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowsTaskFormSubmission: async(formSubmission: IWorkflowTaskFormSubmission) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowsTaskFormSubmission`);
            const _query = {
                text: WORKFLOW.createwWrkflowsTaskFormSubmission,
                values: [formSubmission.workflow_task_assignment_id, formSubmission.form_id, formSubmission.form_data, formSubmission.form_submitted_by, formSubmission.form_submitted_on, formSubmission.created_by, formSubmission.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowsTaskFormSubmission :: result :: ${JSON.stringify(result)}`);
            return result[0].workflows_task_form_submission_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowsTaskFormSubmission :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTransaction: async(transaction: IWorkflowTransaction) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTransaction`);
            const _query = {
                text: WORKFLOW.createWorkflowTransaction,
                values: [transaction.transition_id, transaction.created_by, transaction.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTransaction :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_transaction_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTransaction :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    
    createNode: async(node: INode) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createNode`);
            const _query = {
                text: WORKFLOW.createNode,
                values: [node.node_name, node.node_description, node.node_icon, node.node_type, node.no_of_input_nodes, node.no_of_output_nodes, node.created_by, node.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createNode :: result :: ${JSON.stringify(result)}`);
            return result[0].node_id;
        } catch (error) {
            logger.error(`workflowRepository :: createNode :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    workflowsUpdatedWithinFiveMints: async() : Promise<boolean> => {
        try {
            logger.info("workflowRepository :: Inside workflowsUpdatedWithinFiveMints");

            const _queryToCheckLatestUpdated = {
                text: WORKFLOW.latestUpdatedCheck
            };

            logger.debug(`workflowRepository :: latestUpdated :: query :: ${JSON.stringify(_queryToCheckLatestUpdated)}`)
            const latestUpdatedInForm = await pg.executeQueryPromise(_queryToCheckLatestUpdated);
            const isWorkflowsUpdatedWithin5mins = (latestUpdatedInForm[0].count > 0);
            logger.info(`workflowRepository :: latestUpdated :: result :: ${JSON.stringify(latestUpdatedInForm)} :: isWorkflowsUpdatedWithin5mins :: ${isWorkflowsUpdatedWithin5mins}`);

            return isWorkflowsUpdatedWithin5mins;
        } catch (error) {
            logger.error(`workflowRepository :: workflowsUpdatedWithinFiveMints :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    listWorkflows: async(pageSize: number, currentPage: number, searchQuery: string, status: number = null) : Promise<{workflowList: IWorkflow[], total_count: number}> => {
        try {
            const _queryForListOfWorkflows = {
                text: WORKFLOW.listWorkflows
            };

            const _queryForTotalCountWorkflows = {
                text: WORKFLOW.workflowsTotalCount
            };

            if (searchQuery) {
                _queryForListOfWorkflows.text += ` AND workflow_name ILIKE '%${searchQuery}%'`;
                _queryForTotalCountWorkflows.text += ` AND workflow_name ILIKE '%${searchQuery}%'`;
            }

            if (status) {
                _queryForListOfWorkflows.text += ` AND status = ${status}`;
            }

            _queryForListOfWorkflows.text += ` ORDER BY date_updated DESC, date_created DESC`;
            
            if (pageSize) {
                _queryForListOfWorkflows.text += ` LIMIT ${pageSize}`;
            }
        
            if (currentPage) {
                _queryForListOfWorkflows.text += ` OFFSET ${currentPage}`;
            }


            const workflowsListResponse = {
                workflowList: [],
                total_count: 0
            }


            logger.debug(`workflowRepository :: listWorkflowsCount :: query :: ${JSON.stringify(_queryForTotalCountWorkflows)}`);

            const totalCountRes = await pg.executeQueryPromise(_queryForTotalCountWorkflows);
            logger.debug(`usersService :: listUsersCount :: db result :: ${JSON.stringify(totalCountRes)}`)

            if (totalCountRes.length > 0) {
                workflowsListResponse.total_count = totalCountRes[0].count;
            };
            logger.debug(`workflowRepository :: listWorkflows :: query :: ${JSON.stringify(_queryForListOfWorkflows)}`);

            const workflowResult: IWorkflow[] = await pg.executeQueryPromise(_queryForListOfWorkflows);
            logger.debug(`workflowRepository :: listWorkflows :: db result :: ${JSON.stringify(workflowResult)}`);
            
            if (workflowResult && workflowResult.length > 0) {
                workflowsListResponse.workflowList = workflowResult;
            }
            return workflowsListResponse;
        } catch (error) {
            logger.error(`workflowRepository :: listWorkflows :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    listNodes: async() : Promise<{nodeList: INode[]}> => {
        try {
            const _queryForListOfNodes = {
                text: WORKFLOW.listNodes
            };

            const nodesListResponse = {
                nodeList: []
            }

            const nodeResult: IWorkflow[] = await pg.executeQueryPromise(_queryForListOfNodes);
            logger.debug(`workflowRepository :: listnodes :: db result :: ${JSON.stringify(nodeResult)}`);
            
            if (nodeResult && nodeResult.length > 0) {
                nodesListResponse.nodeList = nodeResult;
            }
            return nodesListResponse;
        } catch (error) {
            logger.error(`workflowRepository :: listWorkflows :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getWorkflow: async(workflowId: Number) : Promise<IWorkflow> => {
        try {
            const _queryForGetWorkflow = {
                text: WORKFLOW.getWorkflow,
                values: [workflowId]
            };

            const workflowResult: IWorkflow[] = await pg.executeQueryPromise(_queryForGetWorkflow);
            logger.debug(`workflowRepository :: getWorkflow :: db result :: ${JSON.stringify(workflowResult)}`);
            
            return workflowResult[0];
        } catch (error) {
            logger.error(`workflowRepository :: getWorkflow :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getWorkflowTasks: async(workflowId: Number) : Promise<IWorkflowTask[]> => {
        try {
            const _queryForGetWorkflowTasks = {
                text: WORKFLOW.getWorkflowTasks,
                values: [workflowId]
            };

            const workflowTasksResult: IWorkflowTask[] = await pg.executeQueryPromise(_queryForGetWorkflowTasks);
            logger.debug(`workflowRepository :: getWorkflowTasks :: db result :: ${JSON.stringify(workflowTasksResult)}`);
            
            return workflowTasksResult;
        } catch (error) {
            logger.error(`workflowRepository :: getWorkflowTasks :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getWorkflowNotificationTasks: async(workflowId: Number) : Promise<IWorkflowNotificationTask[]> => {
        try {
            const _queryForGetWorkflowNotificationTasks = {
                text: WORKFLOW.getWorkflowNotificationTasks,
                values: [workflowId]
            };

            const workflowNotificationTaskResult: IWorkflowNotificationTask[] = await pg.executeQueryPromise(_queryForGetWorkflowNotificationTasks);
            logger.debug(`workflowRepository :: getWorkflowNotificationTasks :: db result :: ${JSON.stringify(workflowNotificationTaskResult)}`);
            
            return workflowNotificationTaskResult;
        } catch (error) {
            logger.error(`workflowRepository :: getWorkflowNotificationTasks :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getWorkflowDecisionTasks: async(workflowId: Number) : Promise<IWorkflowDecisionTask[]> => {
        try {
            const _queryForGetWorkflowDecisionTasks = {
                text: WORKFLOW.getWorkflowDecisionTasks,
                values: [workflowId]
            };

            const workflowDecisionTasksResult: IWorkflowDecisionTask[] = await pg.executeQueryPromise(_queryForGetWorkflowDecisionTasks);
            logger.debug(`workflowRepository :: getWorkflowDecisionTasks :: db result :: ${JSON.stringify(workflowDecisionTasksResult)}`);
            
            return workflowDecisionTasksResult;
        } catch (error) {
            logger.error(`workflowRepository :: getWorkflowDecisionTasks :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getWorkflowTransitions: async(workflowId: Number) : Promise<IWorkflowTransition[]> => {
        try {
            const _queryForGetWorkflowTasks = {
                text: WORKFLOW.getWorkflowTransitions,
                values: [workflowId]
            };

            const workflowTransitionsResult: IWorkflowTransition[] = await pg.executeQueryPromise(_queryForGetWorkflowTasks);
            logger.debug(`workflowRepository :: getWorkflowTransitions :: db result :: ${JSON.stringify(workflowTransitionsResult)}`);
            
            return workflowTransitionsResult;
        } catch (error) {
            logger.error(`workflowRepository :: getWorkflowTransitions :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getWorkflowDecisionCondition: async(decisionTaskId: Number) : Promise<IWorkflowDecisionCondition[]> => {
        try {
            const _queryForGetWorkflowDecisionCondition = {
                text: WORKFLOW.getWorkflowDecisionCondition,
                values: [decisionTaskId]
            };

            const workflowTasksResult: IWorkflowDecisionCondition[] = await pg.executeQueryPromise(_queryForGetWorkflowDecisionCondition);
            logger.debug(`workflowRepository :: getWorkflowDecisionCondition :: db result :: ${JSON.stringify(workflowTasksResult)}`);
            
            return workflowTasksResult;
        } catch (error) {
            logger.error(`workflowRepository :: getWorkflowDecisionCondition :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    changeStatus: async(workflowId: Number, status: Number,  updatedBy: Number)=> {
        try {
            logger.info(`workflowRepository :: Inside changeStatus`);
            const _query = {
                text: WORKFLOW.changeStatus,
                values: [ workflowId, status, updatedBy]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: changeStatus :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: changeStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    executeTransactionQuery: async(query: string) : Promise<void> => {
        try{
            logger.info(`workflowRepository :: executeTransactionQuery :: query :: ${query}`);
            await pg.transactionQuery(query);
        } catch(error) {
            logger.error(`workflowRepository :: executeTransactionQuery :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
};
