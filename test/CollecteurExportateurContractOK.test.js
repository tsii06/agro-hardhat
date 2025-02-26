const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("CollecteurExportateurContractOK", function () {
    let Contrat, contrat;
    let addr0, addr1;
    // pour le contrat ProducteurEnPhaseCulture
    let Pepc, pepc;
    let prod, idParcelle;

    this.beforeEach(async function () {
        [addr0, addr1, prod] = await ethers.getSigners();
        
        // Deploie le contrat ProducteurEnPhaseCulture
        Pepc = await ethers.getContractFactory("contracts/ProducteurEnPhaseCulture.sol:ProducteurEnPhaseCulture");
        pepc = await Pepc.deploy();
        pepc.waitForDeployment();
        // Deploie le contrat CollecteurExportateurContractOK
        Contrat = await ethers.getContractFactory("CollecteurExportateurContrat");
        contrat = await Contrat.deploy(pepc.getAddress());
        contrat.waitForDeployment();

        // creer un parcelle
        // enregistrer un producteur
        await pepc.enregistrerActeur(prod, 0);
        // enregistrer un parcelle
        await pepc.connect(prod).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");
        idParcelle = await pepc.compteurParcelles();
    })

    describe("enregistrerActeur()", function () {
        it("L'evenement ActeurEnregistre a ete bien emis.", async function () {
            expect(await contrat.enregistrerActeur(addr1, 0)) // enregistrer un acteur.
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


    describe("ajouterProduit()", function () {
        let collecteur;
        this.beforeEach(async function () {
           await contrat.enregistrerActeur(addr0, 0);
           collecteur = addr0; 
        });

        it("Verifie si l'evenemet ProduitAjoute a ete bien emis", async function () {
            expect(await contrat.connect(collecteur).ajouterProduit(idParcelle, 10, 10))
                .to.emit(contrat, "ProduitAjoute");
        })

        it("Verifie si le produit a bien ete enregistre", async function () {
            await contrat.connect(collecteur).ajouterProduit(idParcelle, 10, 10);
            const produit = await contrat.produits(await contrat.compteurProduits());
            expect(produit.nom).to.equal("nomProduit");
            expect(produit.prix).to.equal(10);
            expect(produit.quantite).to.equal(10);
        })
    });


    describe("passerCommande()", function () {
        let collecteur, exportateur,idProduit;
        this.beforeEach(async function () {
            // enregistrer collecteur
            await contrat.enregistrerActeur(addr0, 0);
            collecteur = addr0; 
            // enregistrer exportateur
            await contrat.enregistrerActeur(addr1, 1);
            exportateur = addr1; 
            // enregistrer produit
            await contrat.connect(collecteur).ajouterProduit(idParcelle, 10, 10);
            idProduit = await contrat.compteurProduits();
        });

        it("Verifie si l'evenemet CommandePasser a ete bien emis", async function () {
            expect(await contrat.connect(exportateur).passerCommande(idProduit, 10))
                .to.emit(contrat, "CommandePasser")
                .withArgs(exportateur, idProduit);
        })

        it("Verifie si la commande a bien ete enregistre", async function () {
            await contrat.connect(exportateur).passerCommande(idProduit, 10);
            const commande = await contrat.commandes(await contrat.compteurCommandes());
            expect(commande.idProduit).to.equal(idProduit);
            expect(commande.quantite).to.equal(10);
        })
    });
});