import React, { Component } from 'react';
import { getWeb3 } from '../adapters/getWeb3';
import { Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import './NavigationBar.css';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { account: this.props.account, loginDisabled: false, hasPermission: this.props.hasPermission };
    this.handleMetamaskLogin = this.handleMetamaskLogin.bind(this);
  }

  componentDidMount = () => {
    if (this.state.hasPermission) {
      this.setState({ loginDisabled: true });
    }
  };

  getSubAddress(address) {
    let s1 = address.substring(0, 6);
    let s2 = address.substring(address.length - 4, address.length);
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
      <Navbar className="justify-content-around align-items-center">
        <div>
          <FontAwesomeIcon icon={faExchangeAlt} />
          <Navbar.Brand href="#home" className="ml-3">
            Scambia
          </Navbar.Brand>
        </div>
        <div className="d-flex align-items-center">
          <Button disabled={this.state.loginDisabled} className="btn-accent" onClick={this.handleMetamaskLogin}>
            <strong>{!this.state.account ? 'Connect' : this.getSubAddress(this.state.account)}</strong>
          </Button>
          <button className="button-theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </Navbar>
    );
  }
}
