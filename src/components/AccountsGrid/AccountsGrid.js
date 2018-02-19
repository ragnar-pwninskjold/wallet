import * as React from "react";
import { Grid, Row, Col, Jumbotron, Button } from "react-bootstrap";

class AccountsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrint = this.handlePrint.bind(this);
  }
  handleSelection(account_id) {
    console.log("from handleSelection: ", account_id);
  }
  handlePrint() {
    let acts = this.props.accounts.map(account => {
      return (
        <Row key={account.account_id}>
          <Jumbotron>
            <h1>{account.name}</h1>
            <p>{account.official_name}</p>
            <p>Type: {account.subtype}</p>
            <p>
              <Button
                bsStyle="primary"
                bsSize="large"
                onClick={() => this.handleSelection(account.account_id)}
              >
                Use account
              </Button>
            </p>
          </Jumbotron>
        </Row>
      );
    });
    return acts;
  }
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return <Grid>{this.handlePrint()}</Grid>;
  }
}

export default AccountsGrid;
