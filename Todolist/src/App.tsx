import React, { Component } from 'react';
import Form from './comps/form';
import "bootstrap/dist/css/bootstrap.min.css";
import Todolist from './comps/todolist';
import { observer } from "mobx-react";

@observer
class App extends Component {

  render() {

    return (
      <div className="App" >
        <Form />
        <Todolist />
      </div>
    );
  }
}

export default App;
