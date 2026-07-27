export const INSURANCE_ABI = [

    
    // Ownership / insurer
    "function insurer() view returns(address)",

    // Funding
    "function fundContract() payable",

    // Policy management
    "function createPolicy(address,uint256,uint256)",
    "function payPremium(uint256) payable",

    // Claims
    "function submitClaim(uint256)",
    "function approveClaim(uint256)",
    "function claimPayout(uint256)",

    // Views
    "function policyDetails(uint256) view returns (tuple(address policyHolder,uint256 premium,uint256 coverageAmount,bool isClaimed,bool isClaimApproved,bool premiumPaid,bool payoutDone))",

    "function policyCounter() view returns (uint256)",
    "function getContractBalance() view returns (uint256)",

    // Mapping getter
    "function policies(uint256) view returns (address,uint256,uint256,bool,bool,bool,bool)"
];