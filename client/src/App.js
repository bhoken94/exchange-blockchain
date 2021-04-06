import React, { Component } from 'react';
import NavigationBar from './components/NavigationBar';
import Exchange from './components/Exchange';
import { getWeb3OnLoad } from './adapters/getWeb3';
import ReactLoading from 'react-loading';
import ExchangeContract from './artifacts/Exchange.json';
import TokenContract from './artifacts/Token.json';

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
      exchange: null,
      token: null,
      balanceOf: null,
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
          const exchangeNetwork = ExchangeContract.networks[networkId];
          const tokenNetwork = TokenContract.networks[networkId];
          const exchange = new web3.eth.Contract(ExchangeContract.abi, exchangeNetwork && exchangeNetwork.address);
          const token = new web3.eth.Contract(TokenContract.abi, tokenNetwork && tokenNetwork.address);
          //Calcolo balance token
          const balanceOf = await token.methods.balanceOf(accounts[0]).call();
          // Setto delay di 1,5 secondi per mostrare loading
          setTimeout(async () => {
            this.setState({ web3, account: accounts[0], loading: false, isUnlocked: true, exchange, token, balanceOf: web3.utils.fromWei(balanceOf) });
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

  getBalanceOf = async () => {
    const balanceOf = await this.state.token.methods.balanceOf(this.state.account).call();
    console.log(balanceOf);
    this.setState({ balanceOf: this.state.web3.utils.fromWei(balanceOf) });
  };

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
        <NavigationBar account={this.state.account} hasPermission={this.state.hasPermission} isUnlocked={this.state.isUnlocked} balanceOf={this.state.balanceOf} />
        {/*Passo il metodo per avere il balance al component per poterlo richiamare nel component figlio*/}
        <Exchange account={this.state.account} exchange={this.state.exchange} getBalanceOf={this.getBalanceOf} />
      </>
    );
  }
}
