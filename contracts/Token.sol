// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{

  // Indirizzo dell'admin che può creare i token
  address public minter;

  //Evento per il cambio minter. "indexed" significa che posso usare quel parametro in una ricerca
  event MinterChange(address indexed from , address to);

  // Funzioni e indirizzi dihiarati "payable" possono ricevere ether nel contratto
  constructor() public payable ERC20("Exchange Currency", "EC"){
    // Imposto di default il minter come colui che deploia il contratto
    minter = msg.sender;
  }

  function setMinter(address newMinter) public returns(bool){
    require(msg.sender==minter, "Error, only admin can change minter");
    minter = newMinter;
    emit MinterChange(msg.sender, newMinter);
    return true;
  }

  // Funzione che crea il token
  function mint(address account, uint value) public {
    require(msg.sender==minter, "Error, only minter can create tokens!");
    _mint(account, value);
  }
}