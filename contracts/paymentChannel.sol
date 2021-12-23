//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "./WETH.sol";
import "./verifySignature.sol";


contract paymentChannel is WETH, verifySignature {
    address public sender;
    address public recipient;
    uint256 public expiration;
    WETH public token;
    mapping (address => uint256) public balance;
    event tokensTransferred(address recipient,uint256 _amount);

constructor(WETH _token) public {
    token = _token;
}


function openChannel(address _recipient, uint256 _expiration, uint256 _amount) public {
    token.transferFrom(msg.sender,address(this),_amount);
    require(token.balanceOf(address(this)) == _amount , 'Specified amount was not transferred');
    balance[msg.sender] = _amount;
    sender = msg.sender;
    recipient = _recipient;
    expiration = block.timestamp + _expiration;
}

function closeChannel(bytes memory signature, uint256 _amount, address _contract, address _token) public {
    require(msg.sender == recipient, 'You are not the recipient!');
    if(verifySignature.verify( sender, _contract , _token , _amount , signature)) {
        token.transfer( recipient , _amount );
        emit tokensTransferred(recipient,_amount);
        balance[sender] -= _amount;
    }
}

function initialCheck(uint256 _amount) public view returns (bool) {
    return balance[sender] == _amount;
}

function verifyHash(bytes memory signature, uint256 _amount, address _contract, address _token) public view returns(bool) {
    return verifySignature.verify( sender, _contract , _token , _amount , signature);
}

function claimTimeout() public {
    require(expiration >= block.timestamp,'Period to claim timeout has expired!');
    require(msg.sender == sender, 'You are not the payment sender!');
    token.transfer(sender,balance[sender]);
}
}