const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("ProducteurEnPhaseCulture", function () {
    let Contrat;
    let contrat;
    let addr0, addr1;

    this.beforeEach(async function () {
        [addr0, addr1] = await ethers.getSigners();
        
        Contrat = await ethers.getContractFactory("contracts/ProducteurEnPhaseCulture.sol:ProducteurEnPhaseCulture");
        contrat = await Contrat.deploy();
    })

    describe("enregistrerActeur()", function () {
        it("L'evenement ActeurEnregistre a ete bien emis.", async function () {
            await expect(contrat.enregistrerActeur(addr1, 0)) // enregistrer un acteur.
                .to.emit(await contrat, "ActeurEnregistre") // verifie si l'evenement a ete bien emis.
                .withArgs(addr1, 0); // verifie si les argument de l'evenement est bien corrrecte.
        })

        it("L'acteur a ete bien enregistre.", async function () {
            await contrat.enregistrerActeur(addr1, 0); // enregistre un acteur.
            const acteur = await contrat.acteurs(addr1); // recupere un acteur avec un key addr1.
            expect(acteur.addr).to.equal(addr1);
            expect(acteur.role).to.equal(0);
        })
    });
});