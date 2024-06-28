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

import WorkFlowSelection from "./pages/MyTasks/Components/WorkFlowSelection/WorkFlowSelection";
import MyTasks from "./pages/MyTasks/MyTasks";
import Login from "./pages/auth/Components/Login/Login";
import AssignTasks from "./pages/AssignTask/AssignTasks";
import TasksReport from "./pages/TasksReport/TasksReport";
import WorkFlowStarted from "./pages/MyTasks/Components/WorkFlowStarted/WorkFlowStarted";
import CreateTasks from "./pages/MyTasks/Components/CreateTasks/CreateTasks";
import Profile from "./pages/Profile/Profile";
import TriggerDetails from "./pages/MyTasks/Components/TriggerDetails/TriggerDetails";
import ForgotPassword from "./pages/auth/Components/ForgotPassword/ForgotPassword";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      {/* Conditionally render Header and Footer */}
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/forgot-password" component={ForgotPassword} exact />

        {/* Route with Header and Footer */}
        <Route>
          <Header />
          <IonRouterOutlet>
            {/* Routes without Footer */}
            <Route path="/profile" component={Profile} exact />

            {/* Redirect root to login */}
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>

            {/* Routes with Footer */}
            <Footer>
              <Route path="/tasks" component={MyTasks} exact />
              <Route
                path="/tasks/workflow-selection"
                component={WorkFlowSelection}
                exact
              />
              <Route
                path="/tasks/workflow-started"
                component={WorkFlowStarted}
                exact
              />
              <Route path="/tasks/create-tasks" component={CreateTasks} exact />
              <Route path="/tasks-reports" component={TasksReport} exact />
              <Route path="/assigned-tasks" component={AssignTasks} exact />
              <Route
                path="/tasks/trigger-details"
                component={TriggerDetails}
                exact
              />
            </Footer>
          </IonRouterOutlet>
        </Route>
      </Switch>
    </IonReactRouter>
  </IonApp>
);

export default App;
