// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Lottery {

    address public admin;
    address payable[] public participants;

    constructor() {
        admin = msg.sender;
    }

    receive() external payable {
        require(msg.value == 0.1 ether, "Must send 0.1 ETH");
        participants.push(payable(msg.sender));
    }

    function getBalance() public view returns (uint) {
        require(msg.sender == admin, "Only admin");
        return address(this).balance;
    }

    function random() internal view returns (uint) {
        return uint(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    participants.length
                )
            )
        );
    }

    function pickWinner() public {
        require(msg.sender == admin, "Only admin");
        require(participants.length >= 3, "Not enough participants");

        uint index = random() % participants.length;
        address payable winner = participants[index];

        uint prize = address(this).balance;

        (bool success, ) = winner.call{value: prize}("");
        require(success, "Transfer failed");

        delete participants;
    }
}