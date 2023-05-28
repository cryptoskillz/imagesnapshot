// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract Factory {
    // Returns the address of the newly deployed contract
    function deploy(string memory _name, string memory _symbol, uint256 _amount, bytes32 _salt) public payable returns (address) {
        return address(new ERC20FixedSupply{salt: _salt}(_name, _symbol, _amount));
    }
}

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20FixedSupply is ERC20 {
   
    constructor(string memory name, string memory symbol,uint256 amount   ) ERC20(name, symbol) {
        _mint(tx.origin, amount * (10 ** decimals()));
    }
}

