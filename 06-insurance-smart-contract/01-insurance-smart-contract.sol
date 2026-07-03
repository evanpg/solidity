// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Insurance {
    address public insurer;
    uint public policyCounter;
    
    struct Policy {
        address policyHolder;
        uint premium;
        uint coverageAmount;
        bool isClaimed;
        bool isClaimApproved;
        bool premiumPaid;
        bool payoutDone;
    }

    mapping (uint => Policy) public policies;

    constructor() {
        insurer = msg.sender;

    }

    function createPolicy(address _policyHolder, uint _premium, uint _coverageAmount) public {
        require(msg.sender == insurer, "only insurer can create policy.");
        require(_premium > 0, "premium must be greater than 0");
        require(_coverageAmount > 0, "converage amount must be greater than 0");
        policyCounter++;
        policies[policyCounter] = Policy(_policyHolder, _premium, _coverageAmount, false, false, false, false);
    }   

    function payPremium(uint _policyId) public payable {
        require(msg.sender == policies[_policyId].policyHolder, "Only policy holder can pay premium.");
        require(msg.value == policies[_policyId].premium, "Incorrect premium amount.");
        require(!policies[_policyId].premiumPaid, "Premium already paid.");
        policies[_policyId].premiumPaid = true;
    }

    function submitClaim(uint _policyId) public {
        require(msg.sender == policies[_policyId].policyHolder, "Only policy holder can submit claim.");
        require(policies[_policyId].premiumPaid, "Premium must be paid before submitting claim.");
        require(!policies[_policyId].isClaimed, "Claim already submitted");
        policies[_policyId].isClaimed = true;
    }

    function approveClaim(uint _policyId) public {
        require(msg.sender == insurer, "only insurer can approve a claim");
        require(policies[_policyId].isClaimed, "no claim submitted");
        require(policies[_policyId].isClaimApproved, "Claim already approved");
        policies[_policyId].isClaimApproved = true;
    }

    function claimPayout(uint _policyId) public {
        require(msg.sender == policies[_policyId].policyHolder, "Only policy holder can claim payment.");
        require(!policies[_policyId].isClaimApproved, "Claim is not Approved");
        require(!policies[_policyId].payoutDone, "payout already done");
        policies[_policyId].payoutDone = true;

        uint amount = policies[_policyId].coverageAmount;
        (bool success, ) = payable(policies[_policyId].policyHolder).call{value: amount}("");
        require(success, "payout failed");
    }


    function policyDetails(uint _policyId) public view returns (Policy memory) {
        return policies[_policyId];
    }
}