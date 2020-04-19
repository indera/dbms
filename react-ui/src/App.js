import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { Form, FormGroup, Input }
  from 'reactstrap';



function App() {
  return (
    <div className="App">
      <Router>
        <Form className="Login">
          <br></br>
          <h1>
            <span className="font-weight-bold ">Bank of Czech Republic</span>
          </h1><br></br><br></br>
          <h2 className="text-center margin-bottom: 15px">Welcome</h2>
          <FormGroup><br></br>
            <label className="text-left  max-width: 300px">Email ID</label>
            <Input type="Email" placeholder="Email" />
          </FormGroup>
          <FormGroup>
            <label className="text-left">Password</label>
            <Input type="Password" placeholder="Password" />
          </FormGroup>
          <a href="#" class="btn-lg btn-dark btn-block text-center" role="button" aria-pressed="true">Login</a>
          <p className="forgot-Username text-left forgot-password text-right">
            Forgot <a href="#">password?</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Forgot <a href="#">Username?</a>
          </p>
          <div className="text-center">
            <a href="/sign-up">Sign up</a>
          </div>
        </Form>
      </Router>
    </div>
  );
}

export default App;
