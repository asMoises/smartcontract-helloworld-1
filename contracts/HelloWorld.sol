// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract HelloWorld {
    string public message = "Moises";
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function update(string memory newMessage) public {
        require(owner != address(0), "Owner is 0, the contract is already finalized."); // bloqueia alterações após finalize()
        message = newMessage;
    }

    function finalize() public {
        require(msg.sender == owner, "Not owner");
        require(
            keccak256(bytes(message)) == keccak256(bytes("finalize")),
            "Message must be 'finalize'"
        );
        owner = address(0);
    }
}
