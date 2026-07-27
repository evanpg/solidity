## 05-voting-dapp
Similar to the Crowdfunding project, this project highlights voting mechanisms that can be used in smart contracts. In this dApp, however, the outcome is not binary as multiple candidates can be in the running.
1. The contract is deployed with a *durationInMinutes* argument that signals when voting has ended.
2. Candidates sign up using the *addCandidate contract function.
3. Voters can vote once.
4. Helper functions are available to see an array of all candidates, get the current leader, and ultimately get the Winner, once the current block.timestamp is greater than the endTime.
5. Decision is made on popular vote.
NOTE: Solidity cannot return mappings, that is why *getAllCandidates()* creates an array from the mapping. This contract would need to be used in concert with an authentication device, such as an NFT, so that a malicious actor cannot generate many unique addresses to offset true amount of voters.
