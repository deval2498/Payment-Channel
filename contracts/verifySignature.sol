//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract verifySignature {


    function getMessageHash(address _contract, address _token, uint256 _amount) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_contract, _token, _amount));
    }

    function getEthSignedMessage(bytes32 _message) public pure returns(bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _message));
    }

    function verify(address _signer, address _contract, address _token, uint256 _amount, bytes memory _signature) public pure returns(bool){
        bytes32 messageHash = getMessageHash(_contract,_token,_amount);
        bytes32 ethSignedMsg = getEthSignedMessage(messageHash);

        return recoverSigner(ethSignedMsg,_signature) == _signer;

    }

    function recoverSigner(bytes32 _message, bytes memory _signature) public pure returns(address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_message,v,r,s);
    }

    function splitSignature(bytes memory _sig) public pure returns(bytes32 r,bytes32 s,uint8 v) {
        require(_sig.length == 65,'invalid signature!');
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }
    }


}