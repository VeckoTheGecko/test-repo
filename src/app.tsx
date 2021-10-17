import React, { useState } from 'react';
import '@/global.scss';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';
import modules from './modules/modules';
import ErrorBoundary from '@/shared/error-boundary';
// import { ApiService } from '@/services/api.service';
import logo from './assets/icon/favicon.png';

function App(): JSX.Element {
    const [currentTab, setCurrentTab] = useState('queue');

    return (
        <ErrorBoundary>
            <Router forceRefresh={false}>
                <div className="app">
                    <div className="tab-bar">
                        <img src={logo}/>
                        <div className="tabs">
                            {modules.map(module => {
                                return ( // with a name, and routes
                                    <span key={module.name} className={currentTab === module.name ? 'active' : ''}>
                                        <Link to={module.routeProps.path} onClick={() => {
                                            setCurrentTab(module.name)
                                        }}>{module.name}</Link>
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/queue"/>
                        </Route>
                        {modules.map((module) => {
                            return (
                                <Route exact {...module.routeProps} key={module.name}/>
                            )
                        })}
                    </Switch>
                </div>
            </Router>
        </ErrorBoundary>
    )
}


export default App;
