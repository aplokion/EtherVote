//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
// import "../zk/Verifier.sol";

contract Voting {
    struct Proposal {
        string topic;
        string description;
        string[] optionTexts;  // Добавлен массив строк для хранения текстов вариантов голосования
        uint256[] optionIndices;
        address[] votedAddresses;
        mapping(uint256 => uint256) votes;
    }

    Proposal[] public proposals;
    // address private verifier;

    event Voted(address indexed voter, uint256 proposalIndex, uint256 optionIndex);

    // constructor(address _verifier) {
    //     verifier = _verifier;
    // }

    function addProposal(string memory _topic, string memory _description, string[] memory _options) external {
        require(_options.length > 0, "At least one option required");

        Proposal storage newProposal = proposals.push();

        newProposal.topic = _topic;
        newProposal.description = _description;
        newProposal.optionTexts = _options;

        for (uint256 i = 0; i < _options.length; i++) {
            newProposal.optionIndices.push(proposals.length + i);
        }
    }

    function vote(uint256 proposalIndex, uint256 optionIndex) external {
        require(proposalIndex < proposals.length, "Invalid proposal index");
        require(optionIndex < proposals[proposalIndex].optionIndices.length, "Invalid option index");

        // // Fetch necessary parameters from the Verifier contract
        // Verifier verifierContract = Verifier(verifier);
        
        // // Prepare the real proof using the obtained parameters
        // Verifier.Proof memory realProof = Verifier.Proof({
        //     a: Pairing.G1Point(0x26b5ed7fbdd1fa8fc93ab749989bab202c22b0a3d8707fc017e2495c5f4691b7, 0x17db6fd9b86a269a3f02eb59c79f63b97fad97430f90a2fbb35a40594f860b97),
        //     b: Pairing.G2Point([0x01e81e90c91130b6e5addec06ec62e69af0c6884dee74a8ac05eaf600c2ed272, 0x1c891bd5f2662503bb79793333a68034f19cdc17c53e979a59b2d11b291407af], [0x235ea82ffce62de9c50717882c5cf8c00310d68cedb0e5860a2f7ac3a1428edf, 0x16f99a3cb1621043376329458f49dc58a3bc73c93501cd8f70241e4fdc4d2de6]),
        //     c: Pairing.G1Point(0x0badfa046127250260d994eeeda428b1ec7893ef0abf9f6b8f7ca74aad285354, 0x184ae689fab181bc3a6abc64e9d32b93921a57a8a917398153087fa6a5b59d73)
        // });

        // // Call zk-SNARKs verification with the real proof and input data
        // bool verificationResult = verifierContract.verifyTx(realProof, [proposalIndex, optionIndex]);

        // require(verificationResult, "Token verification failed");

        // Check if the sender's address is in the votedAddresses array
        bool hasVoted = false;
        for (uint256 i = 0; i < proposals[proposalIndex].votedAddresses.length; i++) {
            if (proposals[proposalIndex].votedAddresses[i] == msg.sender) {
                hasVoted = true;
                break;
            }
        }
        require(!hasVoted, "Already voted");

        // Add the sender's address to the votedAddresses array
        proposals[proposalIndex].votedAddresses.push(msg.sender);

        uint256 optionIndexInArray = proposals[proposalIndex].optionIndices[optionIndex];
        proposals[proposalIndex].votes[optionIndexInArray]++;

        emit Voted(msg.sender, proposalIndex, optionIndexInArray);
    }


    function getProposalInfo(uint256 proposalIndex) external view returns (string memory, string memory, string[] memory, uint256[] memory) {
        require(proposalIndex < proposals.length, "Invalid proposal index");

        Proposal storage proposal = proposals[proposalIndex];
        uint256[] memory votes = new uint256[](proposal.optionIndices.length);

        for (uint256 i = 0; i < proposal.optionIndices.length; i++) {
            uint256 optionIndex = proposal.optionIndices[i];
            votes[i] = proposal.votes[optionIndex];
        }

        return (proposal.topic, proposal.description, proposal.optionTexts, votes);
    }

    function proposalsCount() external view returns (uint256) {
        return proposals.length;
    }
}
