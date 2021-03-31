import React, { Component } from 'react';
import NavigationBar from './components/NavigationBar';
import Exchange from './components/Exchange';
import { getWeb3OnLoad } from './adapters/getWeb3';
import ReactLoading from 'react-loading';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { web3: null, account: null, loading: true, hasPermission: JSON.parse(localStorage.getItem('hasPermission')), networkId: null };
  }

  componentDidMount = async () => {
    try {
      if (this.state.hasPermission) {
        const web3 = await getWeb3OnLoad();
        const accounts = await web3.eth.getAccounts();
        console.log(web3.eth);
        // Setto delay di 1,5 secondi per mostrare loading
        setTimeout(async () => {
          this.setState({ web3, account: accounts[0], loading: false });
        }, 1500);
      } else {
        setTimeout(async () => {
          this.setState({ loading: false });
        }, 1500);
      }
    } catch (e) {
      console.log(e);
    }
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
        <NavigationBar account={this.state.account} hasPermission={this.state.hasPermission} />
        <Exchange />
      </>
    );
  }
}
