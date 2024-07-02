import React from "react";
import "./TasksReport.css";
import { IonContent } from "@ionic/react";

const TasksReport: React.FC = () => {
  const percentage = 5;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <IonContent>
      <div className="mt-[6rem] m-3">
        <div className="flex items-center justify-between my-6 text-lg font-medium text-black">
          <span>Task Report</span>
          <select className="px-3 py-1 text-black bg-white text-sm rounded-full border border-gray-400">
            <option>Week</option>
            <option>Month</option>
            <option>Quarter</option>
            <option>Year</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="flex items-center mb-6">
          <div
            className="flex justify-between items-center bg-[#FAF8F9] mr-6 border border-gray-400 p-3 rounded-xl flex-col"
            style={{ width: "48%" }}
          >
            <div>
              <h3 className="font-normal text-base m-0">Total Tasks</h3>
            </div>
            <span className="text-3xl font-semibold text-black mt-1">10</span>
          </div>

          <div
            className="flex justify-between items-center bg-[#FAF8F9]  border border-gray-400 p-3 rounded-xl flex-col"
            style={{ width: "48%" }}
          >
            <div>
              <h3 className="text-base font-normal m-0">Tasks Completed</h3>
            </div>
            <span className="text-3xl font-semibold text-black mt-1">5</span>
          </div>
        </div>
        <div
          className="flex justify-between items-center bg-[#FAF8F9] mb-4 border border-gray-400 p-3 rounded-xl flex-col"
          style={{ width: "98%" }}
        >
          <div>
            <h3 className="text-base font-normal m-0">Tasks Efficiency</h3>
          </div>
          <div className="mobile-view-progress">
            <svg width="200" height="200" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="#E2FBD7"
                stroke="#E2FBD7"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#34B53A"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight="bold"
                fill="#34B53A"
                fontSize="24"
              >
                {percentage}%
              </text>
            </svg>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default TasksReport;
