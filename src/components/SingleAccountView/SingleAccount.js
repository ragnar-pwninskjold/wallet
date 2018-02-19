import * as React from "react";
import axios from "axios";

class SingleAccount extends React.Component {
  constructor(props) {
    super(props);
    this.pullTransactions = this.pullTransactions.bind(this);
    this.state = {
      transactions: null
    };
  }
  componentWillMount() {
    this.pullTransactions();
  }

  pullTransactions() {
    axios
      .post("http://localhost:8000/transactions")
      .then(res => this.setState({ transactions: res.data.transactions }))
      .catch(err => console.error(err));
  }
  renderTransactions() {
    console.log(this.state.transactions);
    if (this.state.transactions !== null) {
      let transactions = this.state.transactions.map(transaction => {
        return <li>{transaction.amount}</li>;
      });
      return transactions;
    }
  }
  render() {
    return (
      <div>
        <div>{this.props.account}</div>
        {this.props.transactions !== null ? (
          <ul>{this.renderTransactions()}</ul>
        ) : null}
      </div>
    );
  }
}

export default SingleAccount;
