import React, { Component } from 'react';
import { getWeb3 } from '../adapters/getWeb3';
import { Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { account: this.props.account, loginDisabled: false };
    this.handleMetamaskLogin = this.handleMetamaskLogin.bind(this);
  }

  componentDidMount = () => {
    if (JSON.parse(localStorage.getItem('hasPermission'))) {
      this.setState({ loginDisabled: true });
    }
  };

  getSubAddress(address) {
    let s1 = address.substring(0, 5);
    let s2 = address.substring(address.length - 5, address.length);
    return s1 + '...' + s2;
  }

  async handleMetamaskLogin() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    localStorage.setItem('hasPermission', JSON.stringify(true));
    this.setState({ account: accounts[0] });
  }

  render() {
    return (
      <Navbar className="bg-accent2 justify-content-around align-items-center">
        <div>
          <FontAwesomeIcon icon={faExchangeAlt} />
          <Navbar.Brand href="#home">Exchange</Navbar.Brand>
        </div>
        <div>
          <Button disabled={this.state.loginDisabled} className="btn-accent" onClick={this.handleMetamaskLogin}>
            <strong>{!this.state.account ? 'Connect' : this.getSubAddress(this.state.account)}</strong>
          </Button>
        </div>
      </Navbar>
    );
  }
}
