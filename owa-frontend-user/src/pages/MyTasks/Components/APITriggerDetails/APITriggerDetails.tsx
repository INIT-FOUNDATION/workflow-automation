import {
  Box,
  Button,
  Grid,
  MenuItem,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./APITriggerDetails.css";
import { IoIosRemove } from "react-icons/io";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
} from "@ionic/react";
import "./APITriggerDetails.css";

const ApiTriggerDetails: React.FC = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [headerInputs, setHeaderInputs] = useState([{ key: "", value: "" }]);
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("plain");

  const [listOfInputs, setListOfInputs] = useState<
    { key: string; value: string }[]
  >([]);

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
    if (inputKey && inputValue) {
      setListOfInputs([...listOfInputs, { key: inputKey, value: inputValue }]);
      setInputKey("");
      setInputValue("");
    }
  };

  const removeHeader = (index: number) => {
    const newInputs = [...listOfInputs];
    newInputs.splice(index, 1);
    setListOfInputs(newInputs);
  };

  return (
    <div className="">
      <div className="font-poppins text-base leading-5 mb-2 font-medium mt-3">
        Set API Trigger
      </div>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        padding="1rem"
      >
        <Grid container spacing={2} className="flex items-center">
          <Grid
            item
            xs={4}
            sx={{
              paddingLeft: "0 !important",
            }}
          >
            <TextField
              select
              // label="Method"
              value={method}
              onChange={handleMethodChange}
              fullWidth
              className="get-grid"
            >
              {["GET", "POST", "PUT", "DELETE"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              paddingLeft: "0 !important",
            }}
          >
            <TextField
              // label="URL"
              value={url}
              onChange={handleUrlChange}
              fullWidth
              className="url-grid"
              placeholder="Enter URL"
            />
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              paddingLeft: "2 !important",
              marginRight: "2 !important",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              className="h-12"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="header-body-tabs"
      >
        <Tab
          label={`Headers (${listOfInputs?.length})`}
          sx={{
            color: activeTab === 0 ? "green" : "inherit",
            textTransform: "capitalize",
            fontSize: "17px",
            fontWeight: "600",
          }}
        />
        <Tab
          label="Body"
          sx={{
            color: activeTab === 1 ? "green" : "inherit",
            textTransform: "capitalize",
            fontSize: "17px",
            fontWeight: "600",
          }}
        />
      </Tabs>

      {activeTab === 0 && (
        <Box mt={2} width="100%" className="shadow rounded">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                placeholder="Key"
                variant="outlined"
                value={inputKey}
                fullWidth
                onChange={(e) => setInputKey(e.target.value)}
                // style={{ background: "gray" }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                placeholder="Value"
                variant="outlined"
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                // style={{ border: "1px solid black", borderRadius: "5px" }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={addHeaderInput} color="primary">
                <AddIcon />
              </IconButton>
            </Grid>

            {listOfInputs &&
              listOfInputs.length > 0 &&
              listOfInputs.map((entry, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={5}>
                    <Typography>{entry.key}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography>{entry.value}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeHeader(index)}>
                      <IoIosRemove color="red" />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <>
          <div className="flex space-x-2 items-center justify-center">
            <IonRadioGroup
              value={selectedBodyType}
              onIonChange={(e) => setSelectedBodyType(e.detail.value)}
            >
              <div className="flex space-x-14 ">
                <IonItem lines="none" className=" custom-ion-item">
                  <IonRadio slot="start" value="plain" />
                  <IonLabel className="">Plain</IonLabel>
                </IonItem>
                <IonItem lines="none" className="">
                  <IonRadio slot="start" value="xml" />
                  <IonLabel className="whitespace-nowrap">XML</IonLabel>
                </IonItem>
                <IonItem lines="none" className=" ">
                  <IonRadio slot="start" value="json" />
                  <IonLabel>JSON</IonLabel>
                </IonItem>
              </div>
            </IonRadioGroup>
          </div>
          <IonTextarea
            id="description"
            // labelPlacement="floating"
            placeholder="Enter description here"
            fill="outline"
            className=" w-full rounded-md p-2 px-0 text-black h-44 resize-y"
            style={{ minHeight: "56px" }}
            required
          ></IonTextarea>
        </>
      )}
      <div className="flex-grow mt-8">
        <div className="flex justify-center ">
          <button className="rounded w-full create-task-button" type="submit">
            CREATE TASK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTriggerDetails;
