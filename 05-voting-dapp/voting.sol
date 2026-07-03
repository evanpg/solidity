// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract VotingSystem {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    uint public candidatesCount = 0;
    uint public startTime;
    uint public endTime;

    event VotedEvent(uint indexed candidateId);

    constructor(uint _durationInMinutes) {
        startTime = block.timestamp;
        endTime = startTime + (_durationInMinutes * 1 minutes);

        addCandidate("Bob");
        addCandidate("Alice");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting not active");
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateArray = new Candidate[](candidatesCount);

        for (uint i = 1; i <= candidatesCount; i++) {
            candidateArray[i - 1] = candidates[i];
        }

        return candidateArray;
    }

    function getCurrentLeader() public view returns (string memory) {
        uint maxVotes = 0;
        uint leadingCandidateId = 0;

        for (uint8 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                leadingCandidateId = i;
            }
        }

        if (leadingCandidateId == 0) {
            return "No votes cast yet";
        }
        return candidates[leadingCandidateId].name; 
    }

    function getWinner() public view returns (string memory) {
        require(block.timestamp > endTime, "Voting is still ongoing, results will be available after voting ends.");
        
        uint maxVotes = 0;
        uint leadingCandidateId = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                leadingCandidateId = i;
            }
        }

        if (leadingCandidateId == 0) {
            return "No votes cast yet";
        }

        return candidates[leadingCandidateId].name; 
    }
}