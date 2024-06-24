import { Redirect, Route } from "react-router-dom";
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

import WorkFlowSelection from "./pages/WorkFlowSelection/WorkFlowSelection";
import MyTasks from "./pages/MyTasks/MyTasks";
import Login from "./pages/Login/Login";
import AssignTasks from "./pages/AssignTask/AssignTasks";
import TasksReport from "./pages/TasksReport/TasksReport";
import WorkFlowStarted from "./pages/WorkFlowSelection/Component/WorkFlowStarted/WorkFlowStarted";
import CreateTasks from "./pages/CreateTasks/CreateTasks";
import Profile from "./pages/Profile/Profile";
import TriggerDetails from "./pages/CreateTasks/TriggerDetails/TriggerDetails";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Header />
      <IonRouterOutlet>
        {/* Footer Avoiding Routes */}
        <Route path="/login" component={Login} exact />
        <Route path="/profile" component={Profile} exact />
     

        {/* Redirect root to login */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>

        {/* Routes with Footer */}
        <Footer>
          <Route path="/workflow-selection" component={WorkFlowSelection} exact />
          <Route path="/workflow-started" component={WorkFlowStarted} exact />
          <Route path="/create-tasks" component={CreateTasks} exact />
          <Route path="/tasks" component={MyTasks} />
          <Route path="/tasks-reports" component={TasksReport} exact/>
          <Route path="/assigned-tasks" component={AssignTasks} exact/>
          <Route path="/trigger-details" component={TriggerDetails} exact/>
        </Footer>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;