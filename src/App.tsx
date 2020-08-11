import React, { Component } from "react";
import {
    Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import { observer, Provider } from "mobx-react";
import history from "./history";
import CommonHeader from './components/headercontainer/Header.component';
import ModalComponent from './components/projectDetails/projDetails';
import MapComponent from "./components/mapdetails/Map.component";

import CoordinateDetail from './components/coordinatesDetails/CoordinateDetail';
import SiteComponent from "./components/mapdetails/Site.component"

import { ProjectDetailState } from './common/model/ProjectDetailsState';
//import { ProjectStore } from './common/Store/newProjectStore';
import { createStores } from './common/Store/CreateStore';
import './custom.css'




const rootStore = createStores(
    new ProjectDetailState()
);

@observer

class App extends Component {
    public render() {
        return (

            <Provider {...rootStore}>
                <div>

                    <Router history={history}>

                        <Route exact component={CommonHeader} />

                        <div id="content">
                            <Switch>
                                <Route path="/" exact component={ModalComponent} />

                                <Route path="/map" component={MapComponent} />
                                <Route path="/sidebar" component={SiteComponent} />

                            </Switch>

                        </div>
                    </Router>
                </div>
            </Provider>
        );
    }
}
export default App;