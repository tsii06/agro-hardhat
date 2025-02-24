const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("CollecteurExportateurContractOK", function () {
    let Contrat;
    let contrat;
    let onwer1, addr1;

    this.beforeEach(async function () {
        [onwer1, addr1] = await ethers.getSigners();
        
        Contrat = await ethers.getContractFactory("CollecteurExportateurContrat");
        contrat = await Contrat.deploy(onwer1.address);
    })

    it("acteur bien enregistree", async function () {
        await contrat.enregistrerActeur(addr1.address, 0);
        const acteur = await contrat.getActeur(addr1.address);
        expect(acteur.addr).to.equal(addr1.address);

    });
});