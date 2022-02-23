const Migrations = artifacts.require("Migrations");
const Buddies = artifacts.require("BuddieThePlatypus");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(
    Buddies,
    "abc.com/",
    ["0x0Fb8768c944ba9A37a667b6755472081B060ECE8"],
    [100]
  );
};
