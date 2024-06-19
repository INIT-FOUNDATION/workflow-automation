import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import "./App.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Ionic Dark Mode */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import WorkFlowSelection from "./pages/WorkFlowSelection/WorkFlowSelection";
import MyTasks from "./pages/MyTasks/MyTasks";
import Login from "./pages/Login/Login";
import Footer from "./pages/Footer/Footer";
import Header from "./pages/Header/Header";
import AssignTasks from "./pages/AssignTask/AssignTasks";
import TasksReport from "./pages/TasksReport/TasksReport";
import WorkFlowStarted from "./pages/WorkFlowSelection/Component/WorkFlowStarted/WorkFlowStarted";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Header />
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/tasks" component={MyTasks} exact />
        <Route path="/workflow-selection" component={WorkFlowSelection} exact />
        <Route path="/workflow-started" component={WorkFlowStarted} exact />
        <Route path="/tasks-reports" component={TasksReport} exact />
        <Route path="/assigned-tasks" component={AssignTasks} exact />
      </IonRouterOutlet>
      <Footer />
    </IonReactRouter>
  </IonApp>
);

export default App;
