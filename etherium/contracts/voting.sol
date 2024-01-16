//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.19;

contract Voting {
    address public admin;
    uint public totalVotes;
    
    struct Option {
        string name;
        uint votes;
    }

    struct Vote {
        address voter;
        string choice;
    }

    Option[] public options;
    mapping(address => bool) public hasVoted;
    mapping(address => Vote) public votes;

    event Voted(address indexed voter, string choice);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(string[] memory _optionNames) {
        admin = msg.sender;

        for (uint i = 0; i < _optionNames.length; i++) {
            options.push(Option({
                name: _optionNames[i],
                votes: 0
            }));
        }
    }

    function vote(string memory choice) external {
        require(!hasVoted[msg.sender], "You have already voted");
        require(validateOption(choice), "Invalid choice");

        votes[msg.sender] = Vote({
            voter: msg.sender,
            choice: choice
        });

        options[getOptionIndex(choice)].votes++;
        hasVoted[msg.sender] = true;
        totalVotes++;

        emit Voted(msg.sender, choice);
    }

    function validateOption(string memory choice) internal view returns (bool) {
        for (uint i = 0; i < options.length; i++) {
            if (keccak256(abi.encodePacked(options[i].name)) == keccak256(abi.encodePacked(choice))) {
                return true;
            }
        }
        return false;
    }

    function getOptionIndex(string memory choice) internal view returns (uint) {
        for (uint i = 0; i < options.length; i++) {
            if (keccak256(abi.encodePacked(options[i].name)) == keccak256(abi.encodePacked(choice))) {
                return i;
            }
        }
        revert("Option not found");
    }
}