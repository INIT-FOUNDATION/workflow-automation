import { Request, Response } from "express";
import { logger, STATUS, envUtils } from "owa-micro-common";
import { GRID_DEFAULT_OPTIONS } from "../constants/CONST";
import { workflowService } from "../services/workflowService";
import { WORKFLOWS } from "../constants/ERRORCODE";
import {
    Workflow, WorkflowTask, WorkflowNotificationTask,
    WorkflowDecisionTask, WorkflowDecisionCondition, WorkflowTransition, WorkflowAssignment, WorkflowTaskAssignment,
    WorkflowTaskFormSubmission, WorkflowTransaction, Node
} from "../models/workflowModel";
import {
    IWorkflow, IWorkflowTask, IWorkflowNotificationTask, IWorkflowDecisionTask, IWorkflowDecisionCondition,
    IWorkflowTransition, IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
} from "../types/custom";
import moment from "moment";

export const workflowController = {
    health: (req: Request, res: Response): Response => {
        /*  
                #swagger.tags = ['Health']
                #swagger.summary = 'Health Check API'
                #swagger.description = 'Endpoint to health check Workflow Service'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "Workflow Service is Healthy",
        });
    },

    create: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Workflow']
                #swagger.summary = 'Create workflow'
                #swagger.description = 'Endpoint to create workflow'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        "workflow": {
                            "workflow_name": "new Workflow",
                            "workflow_description": "new Workflow"
                        },
                        "tasks": [
                            {
                                "task_id": 1,
                                "node_id": 1,
                                "node_type": "T",
                                "is_new": true,
                                "task_name": "sdsdasdasd",
                                "task_description": "sadadasdad",
                                "form_id": 2
                            },
                            {
                                "decision_task_id": 2,
                                "node_id": 2,
                                "is_new": true,
                                "node_type": "D",
                                "decision_task_name": "sdsdasdasd",
                                "decision_task_description": "sadadasdad",
                                "conditions": [
                                    {
                                        "operand_one": "mobileNumber",
                                        "operator": "=",
                                        "operand_two": "87878271223"
                                    }
                                ]
                            },
                            {
                                "task_id": 3,
                                "node_id": 3,
                                "node_type": "N",
                                "is_new": true,
                                "notification_task_name": "notification task",
                                "notification_task_description": "notification task",
                                "notification_type": "SMS|WHATSAPP|EMAIL",
                                "email_subject": "subject",
                                "email_body": "email_body",
                                "sms_body": "sms_body",
                                "template_id": "template_id",
                                "placeholders": [{"one", "two", "three"}],
                                "recipient_emails": "abc@gmail.com",
                                "recipient_mobilenumber": "9979459453"
                            }
                        ],
                        "transitions": [
                            {
                                "from_task_id": 1,
                                "to_task_id": 2
                            },
                            {
                                "from_task_id": 2,
                                "to_task_id": 3,
                                "condition_type": "MATCHED"
                            }
                        ]
                    }
                }  
        */
        logger.info(`workflowController :: Inside createWorflow`);
        const workflow = req.body.workflow;
        const tasks = req.body.tasks;
        const transitions = req.body.transitions;
        const workflowTasks: IWorkflowTask[] = [];
        const workflowNotificationTasks: IWorkflowNotificationTask[] = [];
        const workflowDecisionTasks: IWorkflowDecisionTask[] = [];
        const workflowTransitions: IWorkflowTransition[] = [];

        const workflowData: IWorkflow = new Workflow(workflow, req.plainToken);
        const { error } = Workflow.validateWorkflow(workflowData);
        if (error) {
            logger.error(`workflowController :: create :: Workflow validation failed :: error :: ${JSON.stringify(error)}`);
            if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
            else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
        }

        for (const task of tasks) {
            if (task.node_type == "T") {
                const workflowTaskData: IWorkflowTask = new WorkflowTask(task, req.plainToken);
                const { error } = WorkflowTask.validateWorkflowTask(workflowTaskData);
                if (error) {
                    logger.error(`workflowController :: create :: Workflow Task validation failed :: error :: ${JSON.stringify(error)}`);
                    if (error.details != null)
                        return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                    else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
                }
                workflowTasks.push(workflowTaskData);

            } else if (task.node_type == "N") {
                const workflowNotificationTaskData: IWorkflowNotificationTask = new WorkflowNotificationTask(task, req.plainToken);
                const { error } = WorkflowNotificationTask.validateNotificationTask(workflowNotificationTaskData);
                if (error) {
                    logger.error(`workflowController :: create :: Workflow Notification Task validation failed :: error :: ${JSON.stringify(error)}`);
                    if (error.details != null)
                        return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                    else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
                }
                workflowNotificationTasks.push(workflowNotificationTaskData);

            } else if (task.node_type == "D") {
                const workflowDecisionTaskData: IWorkflowDecisionTask = new WorkflowDecisionTask(task, req.plainToken);
                const { error } = WorkflowDecisionTask.validateDecisionTask(workflowDecisionTaskData);
                if (error) {
                    logger.error(`workflowController :: create :: Workflow Decision Task validation failed :: error :: ${JSON.stringify(error)}`);
                    if (error.details != null)
                        return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                    else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
                }

                const conditions = task.conditions;
                workflowDecisionTaskData.conditions = [];
                for (const condition of conditions) {
                    const WorkflowDecisionConditionData: IWorkflowDecisionCondition = new WorkflowDecisionCondition(condition, req.plainToken);
                    const { error } = WorkflowDecisionCondition.validateDecisionCondition(WorkflowDecisionConditionData);
                    if (error) {
                        logger.error(`workflowController :: create :: Workflow Decision Condition validation failed :: error :: ${JSON.stringify(error)}`);
                        if (error.details != null)
                            return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                        else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
                    }
                    workflowDecisionTaskData.conditions.push(WorkflowDecisionConditionData);
                }
                workflowDecisionTasks.push(workflowDecisionTaskData);
            }
        }

        for (const transition of transitions) {
            const workflowTransitionData: IWorkflowTransition = new WorkflowTransition(transition, req.plainToken);
            const { error } = WorkflowTransition.validateTransition(workflowTransitionData);
            if (error) {
                logger.error(`workflowController :: create :: Workflow transition validation failed :: error :: ${JSON.stringify(error)}`);
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
            }
            workflowTransitions.push(workflowTransitionData);
        }

        const workflowId = await workflowService.save(workflowData, workflowTasks, workflowNotificationTasks, workflowDecisionTasks, workflowTransitions);

        return res.status(STATUS.OK).send({
            data: workflowId,
            message: "Workflow created Successfully",
        });
    },

    listWorkflows: async(req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Workflow']
                #swagger.summary = 'List of workflow'
                #swagger.description = 'Endpoint to list workflow'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
        */
        logger.info(`workflowController :: Inside listWorkflows`);
        const pageSize = req.body.page_size || GRID_DEFAULT_OPTIONS.PAGE_SIZE;
        let currentPage = req.body.current_page || GRID_DEFAULT_OPTIONS.CURRENT_PAGE;
        const searchQuery = req.body.search_query || "";

        if (currentPage > 1) {
            currentPage = (currentPage - 1) * pageSize;
        } else {
            currentPage = 0;
        }

        logger.info(`workflowController :: listWorkflows :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchQuery :: ${searchQuery}`);

        const workflowsGridData = await workflowService.listWorkflows(pageSize, currentPage, searchQuery);

        logger.info(`workflowController :: listWorkflows :: response :: ${JSON.stringify(workflowsGridData)}`);
        return res.status(STATUS.OK).send({
            data: workflowsGridData,
            message: "Listed Workflows Successfully",
        });
    },

    getByworkflowId: async(req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Workflow']
                #swagger.summary = 'Get By Workflow Id'
                #swagger.description = 'Endpoint to health check Workflow Service'
        */
       const workflowId = req.params.workflowId ? parseInt(req.params.workflowId) : null;

        if (!workflowId) {
            return res.status(STATUS.BAD_REQUEST).send(WORKFLOWS.WORKF0004);
        }
        
       const workflow = await workflowService.getByworkflowId(workflowId);
        return res.status(STATUS.OK).send({
            data: workflow,
            message: "Workflow Fetched SuccessFully",
        });
    },
    
    nodesList: async(req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Workflow']
                #swagger.summary = 'List of nodes'
                #swagger.description = 'Endpoint to list nodes'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
        */
        logger.info(`workflowController :: Inside nodesList`);
        const nodesGridData = await workflowService.listNodes();

        logger.info(`workflowController :: listNodes :: response :: ${JSON.stringify(nodesGridData)}`);
        return res.status(STATUS.OK).send({
            data: nodesGridData,
            message: "Listed nodes Successfully",
        });
    }
}