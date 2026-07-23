// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SimpleDAO {

    address[] public memberList;

    struct Proposal {
        string description;
        address payable recipient;
        uint amount;
        bool executed;
        uint voteCount;
    }

    Proposal[] public proposals;

    mapping(address => bool) public members;
    mapping(uint => mapping(address => bool)) public voted;

    bool private locked;

    modifier onlyMember() {
        require(members[msg.sender], "Not a member");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "Reentrancy blocked");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        members[msg.sender] = true;
        memberList.push(msg.sender);
    }

    // -------------------------
    // MEMBERS
    // -------------------------
    function addMember(address _member) public onlyMember {
        require(!members[_member], "Already a member");
        members[_member] = true;
        memberList.push(_member);
    }

    function countMembers() internal view returns (uint) {
        return memberList.length;
    }

    // -------------------------
    // FUNDING (TREASURY)
    // -------------------------
    receive() external payable {}

    function deposit() external payable {}

    // -------------------------
    // PROPOSALS
    // -------------------------
    function createProposal(
        string memory _description,
        address payable _recipient,
        uint _amount
    ) public onlyMember {

        proposals.push(Proposal({
            description: _description,
            recipient: _recipient,
            amount: _amount,
            executed: false,
            voteCount: 0
        }));
    }

    // -------------------------
    // VOTING
    // -------------------------
    function vote(uint _proposalIndex) public onlyMember {
        require(_proposalIndex < proposals.length, "Invalid proposal");
        require(!voted[_proposalIndex][msg.sender], "Already voted");

        proposals[_proposalIndex].voteCount += 1;
        voted[_proposalIndex][msg.sender] = true;
    }

    // -------------------------
    // EXECUTION
    // -------------------------
    function executeProposal(uint _proposalIndex)
        public
        onlyMember
        noReentrancy
    {
        require(_proposalIndex < proposals.length, "Invalid proposal");

        Proposal storage proposal = proposals[_proposalIndex];

        require(!proposal.executed, "Already executed");
        require(
            proposal.voteCount > (countMembers() / 2),
            "Not enough votes"
        );

        require(
            address(this).balance >= proposal.amount,
            "Not enough ETH in DAO"
        );

        proposal.executed = true;

        (bool success, ) = proposal.recipient.call{
            value: proposal.amount
        }("");

        require(success, "Transfer failed");
    }

    // -------------------------
    // VIEW HELPERS
    // -------------------------
    function getProposal(uint index)
        external
        view
        returns (
            string memory description,
            address recipient,
            uint amount,
            bool executed,
            uint voteCount
        )
    {
        Proposal memory p = proposals[index];
        return (
            p.description,
            p.recipient,
            p.amount,
            p.executed,
            p.voteCount
        );
    }
}
