import * as React from "react";
//import axios from 'axios';
import PlaidLink from "react-plaid-link";
import "./App.css";

const logo = require("./logo.svg");

class App extends React.Component {
  // componentDidMount() {
  //   axios.post('http://localhost:8000/item/public_token/create')
  //   .then((res) => console.log(res))
  //   .catch(err => console.error(err));
  //   // axios.post('http://localhost:8000/get_access_token')
  //   // .then((res) => console.log(res))
  //   // .catch((err) => console.error(err));
  // }
  handleOnExit() {
    console.log("exited");
  }
  handleOnSuccess(token, metadata) {
    console.log(token);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <PlaidLink
          clientName="Wallit"
          env="sandbox"
          product={["auth, transactions"]}
          publicKey="30e4e1987778346fbae93ed8b21171"
          onExit={this.handleOnExit}
          onSuccess={this.handleOnSuccess}
        >
          Connect your bank account
        </PlaidLink>
      </div>
    );
  }
}

export default App;
