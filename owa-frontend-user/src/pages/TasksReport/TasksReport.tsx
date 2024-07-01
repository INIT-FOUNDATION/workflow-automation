import React from "react";
import "./TasksReport.css";

const TasksReport: React.FC = () => {
  const percentage = 5;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <>
      <div className="mt-[6rem] m-3">
        <h2 className="text-lg font-normal mb-4">Task Report</h2>
        <div className="flex justify-between items-center">
          <div
            className="flex justify-between items-center mb-4 border border-gray-400 p-3 rounded-xl flex-col"
            style={{ width: "165px" }}
          >
            <div>
              <h3 className="font-normal text-base m-0">Total Tasks</h3>
            </div>
            <span className="text-[40px] font-normal text-black">10</span>
          </div>

          <div
            className="flex justify-between items-center mb-4 border border-gray-400 p-3 rounded-xl flex-col"
            style={{ width: "165px" }}
          >
            <div>
              <h3 className="text-base font-normal m-0">Tasks Completed</h3>
            </div>
            <span className="text-[40px] font-normal text-black">5</span>
          </div>
        </div>

        <div
          className="flex justify-between items-center mb-4 border border-gray-400 p-3 rounded-xl flex-col"
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
              >
                {percentage}%
              </text>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default TasksReport;
