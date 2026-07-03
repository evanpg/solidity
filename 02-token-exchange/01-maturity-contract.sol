// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Trust {

    struct Kid {
        uint amount;
        uint maturity;
        bool paid;
    }

    mapping(address => Kid) public kids;
    address public parent;

    event KidAdded(address kid, uint maturity, uint amount);
    event Withdrawn(address kid, uint amount);
    event KidRemoved(address kid, uint refundedAmount);

    constructor() {
        parent = msg.sender;
    }

    // Allow contract to receive ETH directly
    receive() external payable {}

    function addKid(address kid, uint timeToMaturity) external payable {
        require(msg.sender == parent, "Only parent can add a kid");
        require(msg.value > 0, "Must send ETH");
        require(kids[kid].maturity == 0, "Kid already exists");

        kids[kid] = Kid({
            amount: msg.value,
            maturity: block.timestamp + timeToMaturity,
            paid: false
        });

        emit KidAdded(kid, kids[kid].maturity, msg.value);
    }

    function withdraw() external {
        Kid storage kid = kids[msg.sender];

        require(kid.maturity > 0, "Not a kid");
        require(block.timestamp >= kid.maturity, "Too early");
        require(!kid.paid, "Already paid");

        uint amount = kid.amount;
        kid.paid = true;

        emit Withdrawn(msg.sender, amount);

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        delete kids[msg.sender];
    }

    function cancelKid(address kidAddress) external {
        require(msg.sender == parent, "Only parent");
        
        Kid storage kid = kids[kidAddress];
        require(kid.maturity > 0, "Kid does not exist");
        require(!kid.paid, "Already paid");

        uint amount = kid.amount;

        delete kids[kidAddress];

        emit KidRemoved(kidAddress, amount);

        // Refund parent
        (bool success, ) = payable(parent).call{value: amount}("");
        require(success, "Refund failed");
    }
}