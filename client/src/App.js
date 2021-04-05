import React, { Component } from 'react';
import NavigationBar from './components/NavigationBar';
import Exchange from './components/Exchange';
import { getWeb3OnLoad } from './adapters/getWeb3';
import ReactLoading from 'react-loading';
import ExchangeContract from './artifacts/Exchange.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: null,
      loading: true,
      hasPermission: JSON.parse(localStorage.getItem('hasPermission')),
      isUnlocked: false,
      contract: null,
      exchangeAddress: null,
    };
  }

  componentDidMount = async () => {
    try {
      if (this.state.hasPermission) {
        // Controllo se metamask è bloccato
        if (await window.ethereum._metamask.isUnlocked()) {
          const web3 = await getWeb3OnLoad();
          const accounts = await web3.eth.getAccounts();
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = ExchangeContract.networks[networkId];
          const instance = new web3.eth.Contract(ExchangeContract.abi, deployedNetwork && deployedNetwork.address);
          // const exchangeAddress = instance.networks[networkId].address;
          // Setto delay di 1,5 secondi per mostrare loading
          setTimeout(async () => {
            this.setState({ web3, account: accounts[0], loading: false, isUnlocked: true, contract: instance });
          }, 1500);
        } else {
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
      }
    } catch (e) {
      this.setState({ loading: false });
      console.log('Error', e);
    }
  };

  //TODO
  // componentDidUpdate = () => {
  //   window.ethereum.on('accountsChanged', (accounts) => {
  //     console.log(accounts);
  //   });

  //   window.ethereum.on('chainChanged', (networkId) => {
  //     // Time to reload your interface with the new networkId
  //     console.log(networkId);
  //   });
  // };

  render() {
    if (this.state.loading) {
      return (
        <div className="App">
          <header className="App-header">
            <div className="text-center mt-3">
              <ReactLoading type={'bars'} color={'#FD6FFF'} height={100} width={100} />
            </div>
          </header>
        </div>
      );
    }
    return (
      <>
        <NavigationBar account={this.state.account} hasPermission={this.state.hasPermission} isUnlocked={this.state.isUnlocked} />
        <Exchange account={this.state.account} contract={this.state.contract} />
      </>
    );
  }
}
