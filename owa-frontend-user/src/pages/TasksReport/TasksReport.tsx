import React from "react";
import "./TasksReport.css";

const TasksReport: React.FC = () => {
  return (
    <>
      <div className="mt-[8rem] m-6">
        <h2 className="text-lg font-normal mb-4">Task Report</h2>

        {/* First Task Report div */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2" style={{ width: '98%' }}>
          <div>
            <h3 className="font-normal text-base">Total Tasks</h3>
          </div>
          <span className="text-[40px] font-normal text-black">10</span>
        </div>

        {/* Second Task Report div */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2" style={{ width: '98%' }}>
          <div>
            <h3 className="text-base font-normal">Tasks Completed</h3>
          </div>
          <span className="text-[40px] font-normal text-black">5</span>
        </div>

        {/* Third Task Report div */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2" style={{ width: '98%' }}>
          <div>
            <h3 className="text-base font-normal">Tasks Efficiency</h3>
          </div>
          <span className="text-[40px] font-normal text-black">3</span>
        </div>
      </div>
    </>
  );
};

export default TasksReport;
