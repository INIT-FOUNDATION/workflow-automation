import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonRow,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./AssignTasks.css";
import FliterScreen from "../../shared/FliterScreen/FliterScreen";
import { getAssignedTasksList } from "../MyTasks/MyTasks.service";

const AssignTasks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTasksList = async () => {
    try {
      const response = await getAssignedTasksList();
      if (response && response.data && response.data.data) {
        setAssignedTasks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Tasks list:", error);
      setError("Failed to fetch Tasks list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTasksList();
  }, []);

  return (
    <IonContent>
      <div className="flex items-center justify-center pt-[6rem] px-4">
        <div className="flex items-center px-2 bg-neutral-100 border-gray-400 rounded-md w-full">
          <IonIcon
            icon={searchOutline}
            className="w-5 h-5 mr-2 text-gray-500"
          />
          <IonInput
            type="text"
            placeholder="Search"
            className="text-gray-500 w-full"
          />
        </div>
      </div>
      <div className="flex items-center justify-between ml-4 mt-6 text-lg font-medium text-black">
        <span>Assigned Tasks</span>
        <img
          src="/Assets/images/MyTasks/filter_alt.svg"
          alt="filter"
          className="w-6 h-6 mr-6"
          onClick={filterClick}
        />
        {isOpen && <FliterScreen isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <IonGrid className="ion-no-padding">
          <IonRow>
            {assignedTasks.map((task, index) => (
              <IonCol size="12" size-md="6" key={index}>
                <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2 pt-3 shadow-md">
                  <IonCardContent className="p-0">
                    <div className="flex items-center">
                      <span className="form-title">{task.task_name}</span>
                    </div>
                    <div className="flex items-center mt-3 justify-between">
                      <div className="flex items-start flex-col">
                        <div className="flex items-center mb-1">
                          <IonIcon
                            src="Assets/images/MyTasks/calendar_icon.svg"
                            className="calendar-img w-5 h-5 mr-2"
                          ></IonIcon>
                          <span className="ml-1 calendar-date">
                            {task.deadline_on}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center">
                          <IonIcon
                            src="Assets/images/AssignTasks/profile_icon.svg"
                            className="calendar-img w-5 h-5 mr-2"
                          ></IonIcon>
                          <span className="ml-2 font-medium text-black">
                            {task.assigned_to}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`ml-2 px-3 py-1 text-white text-sm rounded-full ${
                          task.task_status === 2
                            ? "bg-green-500"
                            : "bg-[#EA2531]"
                        }`}
                      >
                        {task.task_status === 2
                          ? "Completed"
                          : task.task_status}
                      </button>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      )}
    </IonContent>
  );
};

export default AssignTasks;
