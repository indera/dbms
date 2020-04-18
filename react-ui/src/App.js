import React from 'react';
import './App.css';
import {useState} from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import modules from './modules';

function App() {
    const [currentTab, setCurrentTab] = useState('dashboard');

    return (
        <>
            <Router>
                <div className="App">
                    <header className="App-header">
                        {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                        <ul className="App-nav">
                            {modules.map(module => ( // with a name, and routes
                                <li key={module.name} className={currentTab === module.name ? 'active' : ''}>
                                    <Link to={module.routeProps.path}
                                          onClick={() => setCurrentTab(module.name)}>{module.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </header>
                    <div className="App-content">
                        {modules.map(module => (
                            <Route {...module.routeProps} key={module.name}/>
                        ))}
                    </div>
                </div>
            </Router>
        </>
    );


    // return (
    //   <div className="App">
    //     <Router>
    //     {/*<div class="col-sm-2">*/}
    //             <Link to={'/Linecharts'} className="nav-link btn btn-info">Line Chart</Link>
    //     {/*</div>*/}
    //     <div className="container">
    //         <Switch>
    //           <Route path='/Linecharts' component={Linecharts} />
    //         </Switch>
    //       </div>
    //         <div className="container">
    //             <Switch>
    //                 <Route path='/LinechartQuery1' component={LinechartQuery1} />
    //             </Switch>
    //         </div>
    //       </Router>
    //   </div>
    // );
}

export default App;
