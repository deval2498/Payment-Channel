//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import './contracts/token/ERC20/ERC20.sol';

contract WETH is ERC20 {
    address public admin;
    constructor() ERC20("Wrapped Ether","WETH") public {
    }

    function mint() external payable {
        _mint(msg.sender,msg.value);
    }

    function burn(uint amount) external {
        payable(msg.sender).transfer(amount);
        _burn(msg.sender,amount);
    }
}
