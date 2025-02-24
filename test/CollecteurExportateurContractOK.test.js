const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("CollecteurExportateurContractOK test", function () {
    let Contrat;
    let contrat;
    let onwer1, addr1;

    this.beforeEach(async function () {
        [onwer1, addr1] = await ethers.getSigners();
        
        Contrat = ethers.getContractFactory("CollecteurExportateurContrat");
        contrat = (await Contrat).deploy(onwer1.address, addr1.address);
        (await contrat).waitForDeployment();
    })

    it("acteur bien enregistree", async function () {
        const tx = (await contrat).enregistrerActeur(addr1.address, 0);
        await tx;
        const acteur = (await contrat).getActeur(addr1.address);
        expect((await acteur).addr).to.equal(onwer1.address);

    });
});