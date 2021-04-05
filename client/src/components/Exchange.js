import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import ethCoin from '../assets/eth-coin.png';

import './Exchange.css';

export default class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = { account: this.props.account, contract: this.props.contract, amount: null, amountWithdraw: null };
    this.handleChangeDeposit = this.handleChangeDeposit.bind(this);
    this.handleChangeWithdraw = this.handleChangeWithdraw.bind(this);
    this.handleSubmitDeposit = this.handleSubmitDeposit.bind(this);
    this.handleSubmitWithdraw = this.handleSubmitWithdraw.bind(this);
  }

  handleChangeDeposit(event) {
    this.setState({ amount: event.target.value });
  }

  handleChangeWithdraw(event) {
    this.setState({ amountWithdraw: event.target.value });
  }

  handleSubmitDeposit(event) {
    event.preventDefault();
    if (this.state.contract !== 'undefined') {
      try {
        let amount = this.state.amount * 10 ** 18;
        this.state.contract.methods.deposit().send({ value: amount.toString(), from: this.state.account });
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleSubmitWithdraw(event) {
    event.preventDefault();
    if (this.state.contract !== 'undefined') {
      try {
        this.state.contract.methods.withDraw().send({ from: this.state.account });
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="h-100 row align-items-center">
          <Card className="mx-auto mb-5">
            <Card.Body>
              <div className="container-card">
                <div className="box">
                  {/* <Card.Title>Deposita</Card.Title> */}
                  <div className="container-exchange">
                    <div className="container-btn-all">
                      <div className="container-title">
                        <div className="title">
                          <div className="title-text">Deposita</div>
                        </div>
                      </div>
                      <div className="container-btn">
                        <form id="submitAmount" onSubmit={this.handleSubmitDeposit}>
                          <input className="input-exchange" type="text" inputMode="decimal" placeholder="0.0" onChange={this.handleChangeDeposit} />
                        </form>
                        <button className="button-exchange">
                          <span className="span-btn">
                            <img src={ethCoin} className="coin-img" alt="Etherum coin"></img>
                            <span className="text-coin">ETH</span>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="container-btn-all mt-4">
                      <div className="container-title">
                        <div className="title">
                          <div className="title-text">Preleva</div>
                        </div>
                      </div>
                      <div className="container-btn">
                        <form id="submitAmountWithdraw" onSubmit={this.handleSubmitWithdraw}>
                          <input className="input-exchange" type="text" inputMode="decimal" placeholder="0.0" onChange={this.handleChangeWithdraw} />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-button">
                  <button form={this.state.amountWithdraw ? 'submitAmountWithdraw' : 'submitAmount'} className="box-button-submit">
                    {this.state.account ? 'Deposita & Preleva' : 'Connect'}
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
