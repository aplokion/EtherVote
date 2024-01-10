const Voting = artifacts.require("Voting");
const UserRegistry = artifacts.require("UserRegistry");

module.exports = async function (deployer) {
  await deployer.deploy(Voting, ["name", "votes"]);
  await deployer.deploy(UserRegistry);
};
