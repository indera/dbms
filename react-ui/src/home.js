import React from 'react';
import './App.css';
import Linecharts from './Linechart'
import LinechartQuery1 from "./LinechartQuery1";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


function App() {
	return (
		<div className="App">
			<Router>
				{/*<div class="col-sm-2">*/}
				<Link to={'/Linecharts'} className="nav-link btn btn-info">Line Chart</Link>
				{/*</div>*/}
				<div className="container">
					<Switch>
						<Route path='/Linecharts' component={Linecharts} />
					</Switch>
				</div>
				<div className="container">
					<Switch>
						<Route path='/LinechartQuery1' component={LinechartQuery1} />
					</Switch>
				</div>
			</Router>
		</div>
	);
}

export default App;
