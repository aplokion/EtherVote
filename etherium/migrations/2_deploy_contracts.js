const Voting = artifacts.require("Voting");
const UserRegistry = artifacts.require("UserRegistry");
const Verifier = artifacts.require("../zk/Verifier");

module.exports = async function (deployer) {
  // Развертывание контракта UserRegistry
  await deployer.deploy(UserRegistry);

  // Развертывание контракта Verifier
  await deployer.deploy(Verifier);

  // Адрес развернутого контракта Verifier
  const verifierAddress = Verifier.address;

  // Развертывание контракта Voting без начальных голосований
  await deployer.deploy(Voting, verifierAddress);
};
