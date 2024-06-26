import { Box, Button, Grid, MenuItem, Tabs, Tab, TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';

const ApiTriggerDetails: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [headerInputs, setHeaderInputs] = useState([{ key: '', value: '' }]);

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMethod(event.target.value);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Method: ${method}, URL: ${url}`);
    console.log(`Headers: `, headerInputs);
    // Add your search logic here
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleHeaderChange = (index: number, field: string, value: string) => {
    const newHeaderInputs = [...headerInputs];
    // newHeaderInputs[index][field] = value;
    setHeaderInputs(newHeaderInputs);
  };

  const addHeaderInput = () => {
    setHeaderInputs([...headerInputs, { key: '', value: '' }]);
  };

  return (
    <div className="font-poppins text-base font-normal leading-5 mb-2">
      <div>Set API Trigger</div>
      <Box display="flex" flexDirection="row" alignItems="center" padding="1rem">
        <Grid container spacing={2}>
          <Grid item xs={3} sx={{ paddingLeft: '0 !important' }}>
            <TextField
              select
              label="Method"
              value={method}
              onChange={handleMethodChange}
              variant="outlined"
              fullWidth
            >
              {['GET', 'POST', 'PUT', 'DELETE'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sx={{ paddingLeft: '0 !important' }}>
            <TextField
              label="URL"
              value={url}
              onChange={handleUrlChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3} sx={{ paddingLeft: '0 !important' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" padding="1rem" className="mr-44">
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="header-body-tabs">
          <Tab label="Header" sx={{ color: activeTab === 0 ? 'green' : 'inherit' }} />
          <Tab label="Body" sx={{ color: activeTab === 1 ? 'green' : 'inherit' }} />
        </Tabs>

        {activeTab === 0 && (
          <Box mt={2} width="100%">
            {headerInputs.map((input, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Key"
                    variant="outlined"
                    value={input.key}
                    onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Value"
                    variant="outlined"
                    value={input.value}
                    onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={addHeaderInput} color="primary">
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
        )}

        {activeTab === 1 && (
          <TextField
            label="Body Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        )}
      </Box>
    </div>
  );
};

export default ApiTriggerDetails;
