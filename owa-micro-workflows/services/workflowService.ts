import { logger, redis } from "owa-micro-common";
import {
    IWorkflow, IWorkflowTask, IWorkflowNotificationTask, IWorkflowDecisionTask, IWorkflowDecisionCondition,
    IWorkflowTransition, IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
} from "../types/custom";
import { workflowRepository } from "../repository/wotkflowRepository";
import { CACHE_TTL } from "../constants/CONST";
import moment from "moment";
import * as arrayUtil from "../utility/arrayUtility";

// const nodeIds = [1, 2]; // Start Node & End Node

export const workflowService = {

    save: async (workflowData: IWorkflow, workflowTasks: IWorkflowTask[],
        workflowNotificationTasks: IWorkflowNotificationTask[], workflowDecisionTasks: IWorkflowDecisionTask[],
        workflowTransitions: IWorkflowTransition[]): Promise<number> => {

        try {
            const taskIdsMapping = {};
            await workflowRepository.executeTransactionQuery("BEGIN");

            const workflowId = await workflowRepository.createWorkflow(workflowData);

            for (const workflowTask of workflowTasks) {
                workflowTask.workflow_id = workflowId;
                // if (nodeIds.includes(workflowTask.node_id)) {
                //     workflowTask.task_id = Math.random() * 10000000;
                // }
                const taskId = await workflowRepository.createWorkflowTask(workflowTask);
                taskIdsMapping[workflowTask.task_id] = taskId;
            }

            for (const workflowNotificationTask of workflowNotificationTasks) {
                workflowNotificationTask.workflow_id = workflowId;

                const taskId = await workflowRepository.createWorkflowNotificationTasks(workflowNotificationTask);
                taskIdsMapping[workflowNotificationTask.notification_task_id] = taskId;
            }

            for (const workflowDecisionTask of workflowDecisionTasks) {
                const conditions = workflowDecisionTask.conditions;
                workflowDecisionTask.workflow_id = workflowId;

                const taskId = await workflowRepository.createWorkflowDecisionTasks(workflowDecisionTask);
                taskIdsMapping[workflowDecisionTask.decision_task_id] = taskId;
                for (const condition of conditions) {
                    condition.decision_task_id = taskId;
                    await workflowRepository.createWorkflowDecisionConditions(condition);
                }
            }

            for (const workflowTransition of workflowTransitions) {
                workflowTransition.workflow_id = workflowId;
                workflowTransition.from_task_id = taskIdsMapping[workflowTransition.from_task_id];
                workflowTransition.to_task_id = taskIdsMapping[workflowTransition.to_task_id];
                await workflowRepository.createWorkflowTransition(workflowTransition);
            }

            await workflowRepository.executeTransactionQuery("COMMIT");
            return workflowId;

        } catch (error) {
            await workflowRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`workflowService :: save :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    update: async (workflowData: IWorkflow, workflowTasks: IWorkflowTask[],
        workflowNotificationTasks: IWorkflowNotificationTask[], workflowDecisionTasks: IWorkflowDecisionTask[],
        workflowTransitions: IWorkflowTransition[]): Promise<number> => {

        try {
            const taskIdsMapping = {};
            const workflowId = workflowData.workflow_id;
            await workflowRepository.executeTransactionQuery("BEGIN");

            await workflowRepository.updateWorkflow(workflowData);

            for (const workflowTask of workflowTasks) {
                workflowTask.workflow_id = workflowId;

                if (workflowTask.is_new) {
                    // if (nodeIds.includes(workflowTask.node_id)) {
                    //     workflowTask.task_id = Math.random() * 10000000;
                    // }
                    const taskId = await workflowRepository.createWorkflowTask(workflowTask);
                    taskIdsMapping[workflowTask.task_id] = taskId;
                } else {
                    await workflowRepository.updateWorkflowTask(workflowTask);
                }
            }

            for (const workflowNotificationTask of workflowNotificationTasks) {
                workflowNotificationTask.workflow_id = workflowId;

                if (workflowNotificationTask.is_new) {
                    const taskId = await workflowRepository.createWorkflowNotificationTasks(workflowNotificationTask);
                    taskIdsMapping[workflowNotificationTask.notification_task_id] = taskId;
                } else {
                    await workflowRepository.updateWorkflowNotificationTasks(workflowNotificationTask);
                }
            }

            for (const workflowDecisionTask of workflowDecisionTasks) {
                const conditions = workflowDecisionTask.conditions;
                workflowDecisionTask.workflow_id = workflowId;

                if (workflowDecisionTask.is_new) {
                    const taskId = await workflowRepository.createWorkflowDecisionTasks(workflowDecisionTask);
                    taskIdsMapping[workflowDecisionTask.decision_task_id] = taskId;

                    for (const condition of conditions) {
                        condition.decision_task_id = taskId;
                        await workflowRepository.createWorkflowDecisionConditions(condition);
                    }
                } else {
                    await workflowRepository.updateWorkflowDecisionTasks(workflowDecisionTask);

                    for (const condition of conditions) {
                        if (condition.is_new) {
                            await workflowRepository.createWorkflowDecisionConditions(condition);
                        } else {
                            await workflowRepository.updateWorkflowDecisionConditions(condition);
                        }
                    }
                }
            }

            await workflowRepository.deleteWorkflowTransition(workflowId);
            for (const workflowTransition of workflowTransitions) {
                workflowTransition.workflow_id = workflowId;

                workflowTransition.from_task_id = taskIdsMapping[workflowTransition.from_task_id] ?
                    taskIdsMapping[workflowTransition.from_task_id] : workflowTransition.from_task_id;

                workflowTransition.to_task_id = taskIdsMapping[workflowTransition.to_task_id] ?
                    taskIdsMapping[workflowTransition.to_task_id] : workflowTransition.to_task_id;

                await workflowRepository.createWorkflowTransition(workflowTransition);
            }

            await workflowRepository.executeTransactionQuery("COMMIT");
            return workflowId;

        } catch (error) {
            await workflowRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`workflowService :: save :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    listWorkflows: async (pageSize: number, currentPage: number, searchQuery: string): Promise<{ workflowList: IWorkflow[], total_count: number }> => {
        try {
            let workflowListRedisKey = "WORKFLOWS"
            let workflowListCountRedisKey = "WORKFLOWS_COUNT"
            const workflowListResponse = {
                workflowList: [],
                total_count: 0
            }

            if (searchQuery) {
                workflowListRedisKey += `|SEARCH:${searchQuery}`;
                workflowListCountRedisKey += `|SEARCH:${searchQuery}`;
            }

            if (pageSize) {
                workflowListRedisKey += `|LIMIT:${pageSize}`;
            }

            if (currentPage) {
                workflowListRedisKey += `|OFFSET:${currentPage}`;
            }

            const isWorkflowsUpdatedWithin5mins = await workflowRepository.workflowsUpdatedWithinFiveMints();
            if (!isWorkflowsUpdatedWithin5mins) {
                const workflowListCached = await redis.GetKeyRedis(workflowListRedisKey);
                let isCachePresent = false;
                if (workflowListCached) {
                    logger.debug(`workflowRepository :: listWorkflows :: cached list :: ${workflowListCached}`)
                    workflowListResponse.workflowList = JSON.parse(workflowListCached);
                    isCachePresent = true;
                }


                const workflowListCountCached = await redis.GetKeyRedis(workflowListCountRedisKey);
                if (workflowListCountCached) {
                    logger.debug(`workflowRepository :: listWorkflows :: cached count :: ${workflowListCountCached}`)
                    workflowListResponse.total_count = JSON.parse(workflowListCountCached);
                    isCachePresent = true;
                }

                if (isCachePresent) return workflowListResponse;
            }


            const listWorkflowsData = await workflowRepository.listWorkflows(pageSize, currentPage, searchQuery);
            redis.SetRedis(workflowListCountRedisKey, listWorkflowsData.total_count, CACHE_TTL.LONG);
            redis.SetRedis(workflowListRedisKey, listWorkflowsData.workflowList, CACHE_TTL.LONG);

            return listWorkflowsData;
        } catch (error) {
            logger.error(`workflowService :: listWorkflows :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    listNodes: async (): Promise<{ nodeList: INode[] }> => {
        try {
            let nodeListRedisKey = "NODES"
            const nodeListResponse = {
                nodeList: []
            }

            const nodeListCached = await redis.GetKeyRedis(nodeListRedisKey);
            let isCachePresent = false;
            if (nodeListCached) {
                logger.debug(`workflowRepository :: listNodes :: cached list :: ${nodeListCached}`)
                nodeListResponse.nodeList = JSON.parse(nodeListCached);
                isCachePresent = true;
            }

            if (isCachePresent) return nodeListResponse;


            const listnodesData = await workflowRepository.listNodes();
            redis.SetRedis(nodeListRedisKey, listnodesData.nodeList, CACHE_TTL.LONG);

            return listnodesData;
        } catch (error) {
            logger.error(`workflowService :: listWorkflows :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getByworkflowId: async (workflowId: Number): Promise<Object> => {

        let data = {};

        const workflow = await workflowRepository.getWorkflow(workflowId);
        const workflowTasks = await workflowService.getworkflowTasks(workflowId);
        const workflowNotificationTasks = await workflowService.getWorkflowNotificationTasks(workflowId);
        const workflowDecisionTasks = await workflowService.getWorkflowDecisionTasks(workflowId);
        const workflowTransitions = await workflowService.getWorkflowTransitions(workflowId);

        data["workflow"] = workflow;
        data["tasks"] = [...workflowTasks, ...workflowNotificationTasks, ...workflowDecisionTasks];
        data["transitions"] = workflowTransitions;

        return data;
    },

    getWorkflow: async (workflowId: Number): Promise<IWorkflow> => {
        const workflow = await workflowRepository.getWorkflow(workflowId);
        return workflow;
    },

    getworkflowTasks: async (workflowId: Number): Promise<IWorkflowTask[]> => {
        const workflowTaskList = await workflowRepository.getWorkflowTasks(workflowId);
        return workflowTaskList;
    },

    getWorkflowNotificationTasks: async (workflowId: Number): Promise<IWorkflowNotificationTask[]> => {
        const workflowNotificationTaskList = await workflowRepository.getWorkflowNotificationTasks(workflowId);
        return workflowNotificationTaskList;
    },

    getWorkflowDecisionTasks: async (workflowId: Number): Promise<IWorkflowDecisionTask[]> => {
        const workflowDecisionTaskList = await workflowRepository.getWorkflowDecisionTasks(workflowId);
        for (const workflowDecisionTask of workflowDecisionTaskList) {
            workflowDecisionTask.conditions = await workflowService.getWorkflowDecisionCondition(workflowDecisionTask.decision_task_id);
        }
        return workflowDecisionTaskList;
    },

    getWorkflowTransitions: async (workflowId: Number): Promise<IWorkflowTransition[]> => {
        const workflowTransitionList = await workflowRepository.getWorkflowTransitions(workflowId);
        return workflowTransitionList;
    },

    getWorkflowDecisionCondition: async (decisionTaskId: Number): Promise<IWorkflowDecisionCondition[]> => {
        const workflowDecisionCondition = await workflowRepository.getWorkflowDecisionCondition(decisionTaskId);
        return workflowDecisionCondition;
    }
};
