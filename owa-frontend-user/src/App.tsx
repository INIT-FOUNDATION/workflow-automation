import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Header from "./shared/Header/Header";
import Footer from "./shared/Footer/Footer";
import "./App.css";

/* Optional: Import Ionic Core and theme styles */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Optional: Import Ionic Dark Mode */
import "@ionic/react/css/palettes/dark.css";

/* Optional: Import theme variables */
import "./theme/variables.css";

import { Suspense, lazy, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import ForgotPassword from "./pages/Auth/Components/ForgotPassword/ForgotPassword";
import LoginOtp from "./pages/Auth/LoginOtp/LoginOtp";
import TaskForm from "./pages/MyTasks/Components/TaskForm/TaskForm";

const WorkFlowSelection = lazy(
  () => import("./pages/MyTasks/Components/WorkFlowSelection/WorkFlowSelection")
);
const MyTasks = lazy(() => import("./pages/MyTasks/MyTasks"));
const Login = lazy(() => import("./pages/Auth/Components/Login/Login"));
const AssignTasks = lazy(() => import("./pages/AssignTask/AssignTasks"));
const TasksReport = lazy(() => import("./pages/TasksReport/TasksReport"));
const WorkFlowStarted = lazy(
  () => import("./pages/MyTasks/Components/WorkFlowStarted/WorkFlowStarted")
);
const CreateTasks = lazy(
  () => import("./pages/MyTasks/Components/CreateTasks/CreateTasks")
);
const Profile = lazy(() => import("./pages/Profile/Profile"));
const TriggerDetails = lazy(
  () => import("./pages/MyTasks/Components/TriggerDetails/TriggerDetails")
);

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <IonApp>
      <IonReactRouter>
        {isAuthenticated ? (
          <>
            <Header showSnackbar={showSnackbar} />
            <Switch>
              <Route
                path="/profile"
                render={() => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <Profile />
                  </Suspense>
                )}
                exact
              />
              <Footer>
                <Switch>
                  <Route
                    path="/tasks"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <MyTasks />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/tasks/workflow-selection"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <WorkFlowSelection />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/tasks/workflow-started"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <WorkFlowStarted />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/tasks/create-tasks"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <CreateTasks />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/tasks/task-form"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <TaskForm />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/tasks-reports"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <TasksReport />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/assigned-tasks"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <AssignTasks />
                      </Suspense>
                    )}
                    exact
                  />
                  <Route
                    path="/tasks/trigger-details"
                    render={() => (
                      <Suspense fallback={<div>Loading...</div>}>
                        <TriggerDetails />
                      </Suspense>
                    )}
                    exact
                  />
                  <Redirect to="/tasks" />
                </Switch>
              </Footer>
            </Switch>
          </>
        ) : (
          <Switch>
            <Route
              path="/login"
              render={() => (
                <Suspense fallback={<div>Loading...</div>}>
                  <Login showSnackbar={showSnackbar} />
                </Suspense>
              )}
              exact
            />
            <Route
              path="/forgot-password"
              render={() => (
                <Suspense fallback={<div>Loading...</div>}>
                  <ForgotPassword showSnackbar={showSnackbar} />
                </Suspense>
              )}
              exact
            />
            <Route
              path="/login-Otp"
              render={() => (
                <Suspense fallback={<div>Loading...</div>}>
                  <LoginOtp showSnackbar={showSnackbar} />
                </Suspense>
              )}
              exact
            />
            <Redirect to="/login" />
          </Switch>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
