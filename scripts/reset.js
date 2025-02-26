const { ethers, network } = require("hardhat");

describe("Reset Blockchain", function () {
    it("Devrait réinitialiser la blockchain locale", async function () {
        await network.provider.request({
            method: "hardhat_reset",
            params: [],
        });
        console.log("Blockchain locale réinitialisée !");
    });
});
