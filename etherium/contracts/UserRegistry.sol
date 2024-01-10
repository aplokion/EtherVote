//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.19;


contract UserRegistry {
    struct UserData {
        string username;
        string password;
    }

    mapping(address => UserData) public users;

    function registerUser(address userAddress, string memory _username, string memory _password) public {
        require(bytes(users[userAddress].username).length == 0, "User already registered");
        users[userAddress] = UserData(_username, _password);
    }

    function getUserData(address userAddress) public view returns (string memory, string memory) {
        return (users[userAddress].username, users[userAddress].password);
    }
}
