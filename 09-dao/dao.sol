pragma soliditiy ^0.8.0;

contract SimpleDAO{
    struct Proposal{
        string description;
        address payable recipient;
        uint amount;
        bool executed;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping (address => bool) public members;
    mapping (uint => mapping (address => bool)) public voted;

    modifier OnlyMembers(){
        require(members[msg.sender], "Not a member");
        _;
    }

    constructor(){
        members[msg.sender]=true;
    }

    function addMember(address _member) public OnlyMember(
        members[_member] = true;
    )

    function createProposal(string memory _description, address payable recipient, uint amount) public OnlyMember {
        proposals.push(Proposal({
            description: _description,
            recipient: _recipient,
            amount: _amount,
            executed: false,
            voteCount: 0 
        }));
    }

    function vote(uint _proposalIndex) public OnlyMembers {
        require(!voted[_proposalIndex][(msg.sender), "Already voted"]);
        require(_proposalIndex < proposals.length, "Invalid proposal");

        Proposal storage proposals[_proposalIndex];
        Proposal.voteCount += 1;
        voted[_proposalIndex][msg.sender] = true;
    }

    function executeProposal(uint _proposalIndex) public OnlyMembers {
        Proposal storage proposal = proposals[_proposalIndex];
        require(!Proposal.executed, "Proposal already executed.");
        require(Proposal.voteCount > (countMembers / 2), "Not enough votes.");

        Proposal.recipient.transfer(proposal.amount);
        proposal.executed = true;
    }


}