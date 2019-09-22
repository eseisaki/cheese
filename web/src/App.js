/*  PARENT COMPONENT: no
 *  DESCRIPTION: The root component wirch calls every other component.
 *
 *
 */

import React, { Component } from "react";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";

//comment
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
            <ProtectedRoute path="/homepage" component={Homepage} />
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
