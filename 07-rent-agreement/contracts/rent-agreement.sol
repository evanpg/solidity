// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentAgreement {
    address payable public landlord;
    address public tenant;
    uint public rentAmount;
    uint public startTimestamp;
    uint public durationMonths;
    uint public rentPaidUntil;
    bool public isTerminated;
    uint public constant penaltyRate = 10;
    uint public constant maxPenaltyRate = 50;
    uint public constant gracePeriod = 7;
    bool public terminationRequested = false;
    address public terminationRequester;
    bool private locked;


    event RentPaid(address tenant, uint amount, uint paidUntil, uint penalty);
    event TerminationRequested(address requester);
    event AgreementTerminated(address terminator);


    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only the landlord can perform this action");
        _;
    }

    modifier onlyTenant() {
        require(msg.sender == tenant, "Only the tenant can perform this action");
        _;
    }

    modifier notTerminated() {
        require(!isTerminated, "This contract is terminated");
        _;
    }

    modifier notTerminationRequester() {
        require(msg.sender != terminationRequester, "Requester cannot approve termination");
        _; 
    }
    
    modifier noReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _landlord, uint _rentAmount, uint _durationMonths) {
        require(_landlord != address(0), "Invalid landlord address");
        require(_rentAmount > 0, "Invalid rent");
        require(_durationMonths > 0, "Invalid duration");
        landlord = payable(_landlord);
        rentAmount = _rentAmount;
        durationMonths = _durationMonths;
        startTimestamp = block.timestamp;
        rentPaidUntil = startTimestamp;
    }


    receive() external payable {}

    function setTenant(address _tenant) external onlyLandlord notTerminated {
        require(tenant == address(0), "tenant already set");
        require(_tenant != address(0), "Invalid tenant address");
        tenant = _tenant;
    }

    function payRent() external payable onlyTenant notTerminated {
        require(!terminationRequested, "Termination requested, contract pending closure.");
        require(block.timestamp < startTimestamp + (durationMonths * 30 days), "Rent Agreement expired");
        require(block.timestamp >= rentPaidUntil, "Rent already paid for current period");        
        //require(block.timestamp < startTimestamp + 30 days, "Too early to pay next rent");
        uint currentMonth = (block.timestamp - startTimestamp)/30 days;
        uint paymentDueDate = startTimestamp + (currentMonth * 30 days) + (gracePeriod * 1 days);
        uint penalty = 0;

    if(block.timestamp > paymentDueDate) {
        uint monthsLate = (block.timestamp - paymentDueDate) / 30 days;
        penalty = (rentAmount * penaltyRate * (monthsLate + 1)) / 100;
        if (penalty > (rentAmount * maxPenaltyRate) / 100) {
            penalty = (rentAmount * maxPenaltyRate) / 100;
            }
        }

        require(msg.value == rentAmount + penalty, "Incorrect amount, penalty may apply.");
        rentPaidUntil = startTimestamp + ((currentMonth + 1) * 30 days);
        emit RentPaid(msg.sender, msg.value, rentPaidUntil, penalty);
    }

    function withdrawRent() external onlyLandlord notTerminated noReentrant{
        //require(!terminationRequested, "Termination requested, contract is pending closure (2)");
        uint amount = address(this).balance;
        require(amount > 0, "No funds available");
        (bool sent, ) = landlord.call{value: amount}("");
        require(sent, "Failed to send ETH");
    }
    
    function requestTermination() external notTerminated {
        require(msg.sender == tenant || msg.sender == landlord, "only tenant or landlord can terminate");
        require(!terminationRequested, "Termination already requested."); //this freezes everything until termination is resolved, but also allows termination flag to be rewritten
        terminationRequested = true;
        terminationRequester = msg.sender;
        emit TerminationRequested(msg.sender);
    }

    function approveTermination() external notTerminationRequester notTerminated noReentrant {
        require(terminationRequested, "No termination request to approve");
        require(msg.sender == tenant || msg.sender == landlord, "Only tenant or landlord can approve");
        transferBalanceToLandlord(); //if fails, no
        isTerminated = true;
        emit AgreementTerminated(msg.sender);

    }

    function transferBalanceToLandlord() private {
        uint balance = address(this).balance;
        require(balance > 0, "No balance");
        (bool sent, ) = landlord.call{value: balance}("");
        require(sent, "failed to send ETH");
    }
}