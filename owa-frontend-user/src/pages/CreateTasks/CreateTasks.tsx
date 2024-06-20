// import React from "react";
// import { IonButton, IonIcon } from "@ionic/react";
// import { arrowBack } from "ionicons/icons";

// const CreateTasks: React.FC = () => {
//   return (
//     <div className="flex flex-col h-screen p-2">
//       <div className="cursor-pointer rounded-md flex items-center pt-8">
//         <IonIcon icon={arrowBack} className="pl-2" />
//         <span className="text-lg font-medium text-black pl-2">Create New Task</span>
//       </div>
//       <div className="mt-6">
//         <div className="mt-4">
//           <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
//             Task Name
//           </label>
//           <input
//               type="text"
//               placeholder="Enter your phone number"
//               className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-grey"
//             />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
//             Priority
//           </label>
//           <select
//             id="priority"
//             name="priority"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           >
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             rows={3}
//             placeholder="Enter task description"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             required
//           ></textarea>
//         </div>
//       </div>
//       <div className="flex-grow"></div>
//       <div className="flex justify-center pb-16">
//         <IonButton
//           // onClick={() => handleNextClick()}
//           color="danger"
//           className="bg-red-500 rounded w-full"
//         >
//           Next
//         </IonButton>
//       </div>
//     </div>
//   );
// };

// export default CreateTasks;



import React from "react";
import { TextField, Button, IconButton, Select, MenuItem, FormControl, InputLabel, TextareaAutosize } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "./CreateTasks.css";
import { IonIcon } from "@ionic/react";

const CreateTasks: React.FC = () => {
  return (
    <div className="flex flex-col  p-2 mt-20">
      <div className="cursor-pointer rounded-md flex items-center pt-8">
        <IconButton>
          <ArrowBack />
        </IconButton>
        <span className="text-lg font-medium text-black pl-2 ">Create New Task</span>
      </div>
      <div className="mt-2">
        <div className="mb-4">
          <TextField
            label="Task Name"
            variant="outlined"
            placeholder="Enter task name"
            className="w-full"
            InputProps={{ className: "text-black" }}
            required
          />
        </div>
        <div className="mb-4">
          <FormControl variant="outlined" className="w-full">
            <InputLabel>Select Priority</InputLabel>
            <Select
              label="Select Priority"
              className="text-black"
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mb-4">
          <TextareaAutosize
            
            placeholder="Enter task description"
            className="w-full border rounded-md p-2 text-black"
            style={{ minHeight: "100px" }} 
            required
          />
        </div>
        <div>
        <div className="mt-0">
        <span className="text-lg font-medium text-black p-2 ">Task Detail</span>
        </div>
        <div
          className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2"
          style={{ width: "98%" }}
        >
            <div className="flex items-center mt-2 p-4">
           <IonIcon src="Assets/images/CreateTasks/create_task_calender.svg"
              
              className="calender-img"></IonIcon>
             
            
            <span className="ml-1 text-base font-medium text-black">June 17, 2024</span>
          </div>
         
        </div>
        <div
          className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2"
          style={{ width: "98%" }}
        >
             <div className="flex items-center mt-2 p-4">
            <IonIcon src="Assets/images/CreateTasks/create_task_profile.svg"
              
              className="calender-img"></IonIcon>
             
            
            <span className="ml-1 text-base font-medium text-black">Assigne</span>
          </div>
         
        </div>
        </div>

      </div>
      <div className="flex-grow">
      <div className="flex justify-center pb-16">
        <Button
          // onClick={() => handleNextClick()}
          variant="contained"
          color="error"
          className="w-full"
        >
          Next
        </Button>
      </div>
      </div>
     
    </div>
  );
};

export default CreateTasks;


