// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract Exchange {

  Token private token;

  mapping(address => uint) public etherBalanceOf;
  mapping(address =>uint) public depositStart;
  mapping(address => bool) public isDeposited;

  event Deposit(address indexed user, uint amount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

  constructor(Token _token) public {
    token = _token;
  }

  function deposit() payable public {
    // Controllo ch il deposito non sia attivo
    require(isDeposited[msg.sender] == false, "Error, deposit already active");
    // Controlle che la cifra sia superiore ad un certo valore
    require(msg.value>=1e16, "Error, deposit must be >= 0.01 ether");

    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender]+msg.value;
    depositStart[msg.sender] = depositStart[msg.sender]+block.timestamp;

    isDeposited[msg.sender] = true;
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withDraw() public {
    //Controllo se il deposito è attivo
    require(isDeposited[msg.sender]==true, 'Error, no previous deposit');
    
    // assegno il deposito dell'utente in una variabile per l'evento
    uint userBalance = etherBalanceOf[msg.sender];

    // Calcolo il tempo di deposito
    uint depositTime = block.timestamp - depositStart[msg.sender];

    // Calcolo interesse per secondo e interesse finale
    //31668017 - interest(10% APY) per second for min. deposit amount (0.01 ETH), cuz:
    //1e15(10% of 0.01 ETH) / 31577600 (seconds in 365.25 days)

    //(etherBalanceOf[msg.sender] / 1e16) - calc. how much higher interest will be (based on deposit), e.g.:
    //for min. deposit (0.01 ETH), (etherBalanceOf[msg.sender] / 1e16) = 1 (the same, 31668017/s)
    //for deposit 0.02 ETH, (etherBalanceOf[msg.sender] / 1e16) = 2 (doubled, (2*31668017)/s)
    uint interestPerSecond = 31668017 * (userBalance / 1e16);
    uint interest = interestPerSecond * depositTime;

    // Mando gli ether all'utente
    payable(msg.sender).transfer(userBalance);

    // Mando il valore in token dell'interesse
    token.mint(msg.sender, interest);

    // resetto il valore a zero dopo il trasferimento
    depositStart[msg.sender] = 0;
    etherBalanceOf[msg.sender] = 0;
    isDeposited[msg.sender] = false;

    // Emetto evento
    emit Withdraw(msg.sender, userBalance, depositTime, interest);
  }


}