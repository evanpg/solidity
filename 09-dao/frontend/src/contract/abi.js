export const DAO_ABI = [
  "function addMember(address)",
  "function createProposal(string,address,uint256)",
  "function vote(uint256)",
  "function executeProposal(uint256)",
  "function getProposal(uint256) view returns(string,address,uint256,bool,uint256)",
  "function isMember(address) view returns(bool)"
];