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
                .to.emit(contrat, "ActeurEnregistre") // verifie si l'evenement a ete bien emis.
                .withArgs(addr1, 0); // verifie si les argument de l'evenement est bien corrrecte.
        })

        it("L'acteur a ete bien enregistre.", async function () {
            await contrat.enregistrerActeur(addr1, 2); // enregistre un acteur.
            const acteur = await contrat.acteurs(addr1); // recupere un acteur avec un key addr1.
            expect(acteur.addr).to.equal(addr1);
            expect(acteur.role).to.equal(2);
        })
    });


    describe("creerParcelle()", function () {
        it("Seul un producteur peut creer un parcelle", async function () {
            await contrat.enregistrerActeur(addr1, 0); // enregistre un producteur.
            await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate"); // creer un parcelle a partir du producteur.
        })
        
        it("Verifie si l'evenemet SemenceValidee a ete bien emis", async function () {
            await contrat.enregistrerActeur(addr1, 0); // enregistre un producteur.
            const tx = await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate"); // creer un parcelle
            await expect(tx)
                .to.emit(contrat, "SemenceValidee") // verifie si l'evenement a ete bien emis.
                .withArgs(parseInt(await contrat.compteurParcelles()), "bon"); // avec les bons arguments
        })

        it("Verifie si l'evenemet MethodeCultureFixee a ete bien emis", async function () {
            await contrat.enregistrerActeur(addr1, 0); // enregistre un producteur.
            const tx = await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate"); // creer un parcelle
            await expect(tx)
                .to.emit(contrat, "MethodeCultureFixee") // verifie si l'evenement a ete bien emis.
                .withArgs(parseInt(await contrat.compteurParcelles()), "sur brulis"); // avec les bons arguments
        })

        it("Verifie si l'evenemet ParcelleCree a ete bien emis", async function () {
            await contrat.enregistrerActeur(addr1, 0); // enregistre un producteur.
            const tx = await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate"); // creer un parcelle
            await expect(tx)
                .to.emit(contrat, "ParcelleCree") // verifie si l'evenement a ete bien emis.
                .withArgs(parseInt(await contrat.compteurParcelles()), "latitude", "longitude"); // avec les bons arguments
        })
    });
});