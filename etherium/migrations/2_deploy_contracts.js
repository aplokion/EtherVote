const Voting = artifacts.require("Voting");
const UserRegistry = artifacts.require("UserRegistry");
// const Verifier = artifacts.require("../zk/Verifier");

module.exports = async function (deployer) {
  await deployer.deploy(UserRegistry);

  // await deployer.deploy(Verifier);

  // const verifierAddress = Verifier.address;

  // await deployer.deploy(Voting, verifierAddress);
  await deployer.deploy(Voting);
};
