const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("LockModule", (m) => {

  const lock = m.contract("DecentralisedBank", []);

  return { lock };
});

// metamask deploy - 0x8295478BD1f94296E57B0a9bc50200eeDC3c9c43
// hardhat deploy - 0x5FbDB2315678afecb367f032d93F642f64180aa3