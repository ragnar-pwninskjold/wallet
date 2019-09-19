import * as React from "react";
import axios from "axios";
import PlaidLink from "react-plaid-link";
import AccountsGrid from "./components/AccountsGrid/AccountsGrid";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.pullAccounts = this.pullAccounts.bind(this);

    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.updateSelectedAccountCallback = this.updateSelectedAccountCallback.bind(
      this
    );
    this.state = {
      accounts: null,
      linked: false,
      selectedAccount: null
    };
  }
  componentDidMount() {
    //console.log(this);
  }
  handleOnExit() {
    console.log("exited");
  }
  handleOnSuccess(token, metadata) {
    axios
      .post("http://localhost:8000/get_access_token", {
        public_token: token
      })
      .then(() => {
        this.pullAccounts();
      })
      .catch(err => console.error(err));
  }
  pullAccounts() {
    axios
      .get("http://localhost:8000/accounts")
      .then(res => this.setState({ accounts: res.data.accounts, linked: true }))
      .catch(err => console.error(err));
  }

  updateSelectedAccountCallback(account_id) {
    this.setState({ selectedAccount: account_id });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src="http://simpleicon.com/wp-content/uploads/coin-money-1.svg"
            className="App-logo"
            alt="logo"
          />
          <h1 className="App-title">So you wanna learn to save?</h1>
        </header>
        <p className="App-intro">
          To get started, select <code>Connect to your bank account</code> below
        </p>
        {this.state.linked ? (
          <AccountsGrid
            accounts={this.state.accounts}
            selectedAccount={this.updateSelectedAccountCallback}
          />
        ) : (
          <PlaidLink
            clientName="WallET"
            env="sandbox"
            product={["auth, transactions"]}
            publicKey="30e4e1987778346fbae93ed8b21171"
            onExit={this.handleOnExit}
            onSuccess={this.handleOnSuccess}
            className="plaid-link"
          >
            Connect your bank account
          </PlaidLink>
        )}
      </div>
    );
  }
}

export default App;
