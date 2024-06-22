import { Box, Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";

const ApiTriggerDetails: React.FC = () => {

  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMethod(event.target.value);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <div className="font-poppins text-base font-normal leading-5 mb-2">
      <div>Set API Trigger</div>
      <Box display="flex" alignItems="center" borderRadius={4} borderColor="grey.300" className="mt-4 w-1/3">
        <div>
          <TextField
            select
            label="Method"
            value={method}
            onChange={handleMethodChange}
            variant="outlined"
            style={{ marginRight: '10px' }}
          >
            {['GET', 'POST', 'PUT', 'DELETE'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex-grow">
          <TextField
            label="URL"
            value={url}
            onChange={handleUrlChange}
            variant="outlined"
            fullWidth
            style={{ marginRight: '10px' }}
          />
        </div>
        <Button variant="contained" color="primary">
          Send
        </Button>
      </Box>
      <div className="mt-4 w-1/3">
        <div className="flex">
          <div className="w-1/2 text-center py-2 border border-gray-300 cursor-pointer">
            Tab 1
          </div>
          <div className="w-1/2 text-center py-2 border border-gray-300 cursor-pointer">
            Tab 2
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTriggerDetails;
