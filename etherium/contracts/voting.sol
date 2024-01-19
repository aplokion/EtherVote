//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
// import "../zk/Verifier.sol";

contract Voting {
    struct Election {
        string topic;
        string description;
        string[] optionTexts;
        uint256[] optionIndices;
        address[] votedAddresses;
        address creator;
        mapping(uint256 => uint256) votes;
    }

    Election[] public elections;
    // address private verifier;

    event Voted(address indexed voter, uint256 electionIndex, uint256 optionIndex);
    // constructor(address _verifier) {
    //     verifier = _verifier;
    // }


    function addElection(string memory _topic, string memory _description, string[] memory _options) external {
        require(_options.length > 0, "At least one option required");

        Election storage newElection = elections.push();
        newElection.topic = _topic;
        newElection.description = _description;
        newElection.optionTexts = _options;
        newElection.creator = msg.sender;

        for (uint256 i = 0; i < _options.length; i++) {
            newElection.optionIndices.push(elections.length + i);
        }
    }

    function vote(uint256 electionIndex, uint256 optionIndex) external {
        require(electionIndex < elections.length, "Invalid election index");
        require(optionIndex < elections[electionIndex].optionIndices.length, "Invalid option index");

        // Verifier verifierContract = Verifier(verifier);
        
        // Verifier.Proof memory realProof = Verifier.Proof({
        //     a: Pairing.G1Point(0x26b5ed7fbdd1fa8fc93ab749989bab202c22b0a3d8707fc017e2495c5f4691b7, 0x17db6fd9b86a269a3f02eb59c79f63b97fad97430f90a2fbb35a40594f860b97),
        //     b: Pairing.G2Point([0x01e81e90c91130b6e5addec06ec62e69af0c6884dee74a8ac05eaf600c2ed272, 0x1c891bd5f2662503bb79793333a68034f19cdc17c53e979a59b2d11b291407af], [0x235ea82ffce62de9c50717882c5cf8c00310d68cedb0e5860a2f7ac3a1428edf, 0x16f99a3cb1621043376329458f49dc58a3bc73c93501cd8f70241e4fdc4d2de6]),
        //     c: Pairing.G1Point(0x0badfa046127250260d994eeeda428b1ec7893ef0abf9f6b8f7ca74aad285354, 0x184ae689fab181bc3a6abc64e9d32b93921a57a8a917398153087fa6a5b59d73)
        // });

        // bool verificationResult = verifierContract.verifyTx(realProof, [electionIndex, optionIndex]);

        // require(verificationResult, "Token verification failed");

        bool hasVoted = false;
        for (uint256 i = 0; i < elections[electionIndex].votedAddresses.length; i++) {
            if (elections[electionIndex].votedAddresses[i] == msg.sender) {
                hasVoted = true;
                break;
            }
        }
        require(!hasVoted, "Already voted");

        elections[electionIndex].votedAddresses.push(msg.sender);

        uint256 optionIndexInArray = elections[electionIndex].optionIndices[optionIndex];
        elections[electionIndex].votes[optionIndexInArray]++;

        emit Voted(msg.sender, electionIndex, optionIndexInArray);
    }


    function getElectionInfo(uint256 electionIndex) external view returns (string memory, string memory, string[] memory, uint256[] memory) {
        require(electionIndex < elections.length, "Invalid election index");

        Election storage election = elections[electionIndex];
        uint256[] memory votes = new uint256[](election.optionIndices.length);

        for (uint256 i = 0; i < election.optionIndices.length; i++) {
            uint256 optionIndex = election.optionIndices[i];
            votes[i] = election.votes[optionIndex];
        }

        return (election.topic, election.description, election.optionTexts, votes);
    }

    function electionsCount() external view returns (uint256) {
        return elections.length;
    }

    function getParticipatedElections(address participant) external view returns (uint256[] memory) {
        uint256[] memory participatedElections = new uint256[](elections.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < elections.length; i++) {
            for (uint256 j = 0; j < elections[i].votedAddresses.length; j++) {
                if (elections[i].votedAddresses[j] == participant) {
                    participatedElections[count] = i;
                    count++;
                    break;
                }
            }
        }

        assembly {
            mstore(participatedElections, count)
        }

        return participatedElections;
    }

    function getCreatedElections(address _creator) external view returns (uint256[] memory) {
        uint256[] memory createdElections = new uint256[](elections.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < elections.length; i++) {
            if (elections[i].creator == _creator) {
                createdElections[count] = i;
                count++;
            }
        }
        assembly {
            mstore(createdElections, count)
        }

        return createdElections;
    }
}
