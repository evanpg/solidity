// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Insurance {
address public insurer;
uint public policyCounter;

```
struct Policy {
    address policyHolder;
    uint premium;
    uint coverageAmount;
    bool isClaimed;
    bool isClaimApproved;
    bool premiumPaid;
    bool payoutDone;
}

mapping(uint => Policy) public policies;

// 🔔 Events (very important for tracking)
event PolicyCreated(uint policyId, address policyHolder, uint premium, uint coverageAmount);
event PremiumPaid(uint policyId, address policyHolder);
event ClaimSubmitted(uint policyId);
event ClaimApproved(uint policyId);
event PayoutDone(uint policyId, uint amount);
event FundsDeposited(address from, uint amount);

constructor() {
    insurer = msg.sender;
}

// 🔒 Modifiers
modifier onlyInsurer() {
    require(msg.sender == insurer, "Only insurer allowed");
    _;
}

modifier validPolicy(uint _policyId) {
    require(_policyId > 0 && _policyId <= policyCounter, "Invalid policy ID");
    _;
}

// 🏦 Allow insurer to fund contract
function fundContract() external payable onlyInsurer {
    require(msg.value > 0, "Must send ETH");
    emit FundsDeposited(msg.sender, msg.value);
}

function createPolicy(
    address _policyHolder,
    uint _premium,
    uint _coverageAmount
) public onlyInsurer {
    require(_policyHolder != address(0), "Invalid address");
    require(_premium > 0, "Premium must be > 0");
    require(_coverageAmount > 0, "Coverage must be > 0");

    policyCounter++;

    policies[policyCounter] = Policy(
        _policyHolder,
        _premium,
        _coverageAmount,
        false,
        false,
        false,
        false
    );

    emit PolicyCreated(policyCounter, _policyHolder, _premium, _coverageAmount);
}

function payPremium(uint _policyId) public payable validPolicy(_policyId) {
    Policy storage policy = policies[_policyId];

    require(msg.sender == policy.policyHolder, "Only policy holder");
    require(!policy.premiumPaid, "Premium already paid");
    require(msg.value == policy.premium, "Incorrect premium");

    policy.premiumPaid = true;

    emit PremiumPaid(_policyId, msg.sender);
}

function submitClaim(uint _policyId) public validPolicy(_policyId) {
    Policy storage policy = policies[_policyId];

    require(msg.sender == policy.policyHolder, "Only policy holder");
    require(policy.premiumPaid, "Premium not paid");
    require(!policy.isClaimed, "Already claimed");

    policy.isClaimed = true;

    emit ClaimSubmitted(_policyId);
}

function approveClaim(uint _policyId) public onlyInsurer validPolicy(_policyId) {
    Policy storage policy = policies[_policyId];

    require(policy.isClaimed, "No claim submitted");
    require(!policy.isClaimApproved, "Already approved");

    policy.isClaimApproved = true;

    emit ClaimApproved(_policyId);
}

function claimPayout(uint _policyId) public validPolicy(_policyId) {
    Policy storage policy = policies[_policyId];

    require(msg.sender == policy.policyHolder, "Only policy holder");
    require(policy.isClaimApproved, "Claim not approved");
    require(!policy.payoutDone, "Already paid");

    uint amount = policy.coverageAmount;

    require(address(this).balance >= amount, "Insufficient contract funds");

    // Effects before interaction (reentrancy-safe pattern)
    policy.payoutDone = true;

    (bool success, ) = payable(policy.policyHolder).call{value: amount}("");
    require(success, "Transfer failed");

    emit PayoutDone(_policyId, amount);
}

function policyDetails(uint _policyId)
    public
    view
    validPolicy(_policyId)
    returns (Policy memory)
{
    return policies[_policyId];
}

// 📊 Check contract balance
function getContractBalance() public view returns (uint) {
    return address(this).balance;
}
```

}
