//const Migrations = artifacts.require("Migrations");
const Buddies = artifacts.require("BuddieThePlatypus");
module.exports = function (deployer) {
  //deployer.deploy(Migrations);
  deployer.deploy(
    Buddies,
    "https://gateway.pinata.cloud/ipfs/QmVz8hiq57cZSwebtaT91QuzjygnZfSqD9Bak3TLJiXtcf/",
    [
      "0x2De8839b1058A44EA833434AadD1D1aC1F5B225e",
      "0x5D2c83B52ADf274b8F1c69A9c2873b491127Da2b",
    ],
    [98, 2]
  );
};
