import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonActionSheet,
  useIonRouter,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./MyTasks.css";
import FliterScreen from "../../shared/FliterScreen/FliterScreen";
import { getTasksList, getTasksListById } from "../MyTasks/MyTasks.service";

const MyTasks: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [formId, setFormId] = useState<string | null>(null);
  const router = useIonRouter();

  const handleWorkFlow = () => {
    router.push("/tasks/workflow-selection");
  };

  const handleTasks = () => {
    router.push("/tasks/create-tasks");
  };

  const filterClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTasksList = async () => {
    try {
      const response = await getTasksList();
      if (response && response.data && response.data.data) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Tasks list:", error);
      setError("Failed to fetch Tasks list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskListsById = async (formId: string) => {
    try {
      const response = await getTasksListById(parseInt(formId));
      if (response && response.data && response.data.data) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks by form ID:", error);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (task: any) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  useEffect(() => {
    handleTasksList();
  }, []);

  return (
    <IonContent>
      <div className="flex items-center justify-center pt-[6rem] px-4">
        <div className="flex items-center px-2 bg-neutral-100 border-gray-400 rounded-md w-full">
          <IonIcon icon={searchOutline} className="w-5 h-5 mr-2 text-gray-500" />
          <IonInput type="text" placeholder="Search" className="text-gray-500 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between mx-4 mt-6 text-lg font-medium text-black">
        <span>My Tasks ({tasks.length})</span>
        <div className="flex items-center">
          <select className="px-3 py-1 text-black bg-white text-sm rounded-full border border-gray-400 mr-4">
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <img src="/Assets/images/MyTasks/filter_alt.svg" alt="filter" className="w-6 h-6" onClick={filterClick} />
          {isOpen && <FliterScreen isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <p>Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center mt-4">
          <p>{error}</p>
        </div>
      ) : (
        <IonGrid className="ion-no-padding overflow-y-auto">
          {tasks.map((task, index) => (
            <IonRow key={index}>
              <IonCol size="12" size-md="6">
                <IonCard
                  className="custom-card border border-gray-300 rounded-md p-4 mb-2 shadow-md"
                  onClick={() => handleTaskListsById(task.form_id)} 
                >
                  <IonCardContent className="p-0">
                    <div className="flex items-center">
                      <span className="form-title">{task.task_name}</span>
                    </div>
                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex items-center">
                        <img src="Assets/images/MyTasks/calendar_icon.svg" alt="" className="calendar-img w-5 h-5 mr-2" />
                        <span className="ml-1 calendar-date">{task.deadline_on}</span>
                      </div>
                      <button
                        className={`ml-2 px-3 py-1 text-sm rounded-full ${
                          task.task_status === 2 ? 'bg-green-500' : 'bg-[#EA2531]'
                        } text-white`}
                      >
                        {task.task_status === 2 ? 'Completed' : 'pending'}
                      </button>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      )}

      <div>
        <div className="flex justify-center items-center mb-3 mt-3">
          <button
            id="add-task-button"
            className="rounded w-full add-task create-task-button font-semibold flex justify-center items-center text-lg"
            onClick={() => setShowActionSheet(true)}
          >
            Add Task
            <img src="Assets/images/MyTasks/add.svg" className="ml-1" />
          </button>
        </div>
        <IonActionSheet
          className="my-custom-class"
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Choose existing workflow",
              handler: () => {
                setShowActionSheet(false);
                handleWorkFlow();
              },
            },
            {
              text: "Create new task",
              handler: () => {
                setShowActionSheet(false);
                handleTasks();
              },
            },
          ]}
        />
      </div>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Task Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {selectedTask && (
            <>
              <h2>{selectedTask.task_name}</h2>
              <p><strong>Deadline:</strong> {selectedTask.deadline_on}</p>
              <p><strong>Status:</strong> {selectedTask.task_status === 2 ? 'Completed' : 'Pending'}</p>
            </>
          )}
        </IonContent>
      </IonModal>
    </IonContent>
  );
};

export default MyTasks;
