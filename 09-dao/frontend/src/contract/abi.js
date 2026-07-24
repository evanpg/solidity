// src/contract/abi.js

export const DAO_ABI = [

    // Members
    "function addMember(address _member)",
    "function members(address) view returns (bool)",

    // Treasury
    "function deposit() payable",

    // Proposals
    "function createProposal(string,address,uint256)",
    "function vote(uint256)",
    "function executeProposal(uint256)",

    // Views
    "function getProposal(uint256) view returns (string,address,uint256,bool,uint256)",

    // Public proposal getter
    "function proposals(uint256) view returns (string,address,uint256,bool,uint256)"
];