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

        it("Verifie qu'un parcelle a ete bien creer", async function () {
            await contrat.enregistrerActeur(addr1, 0); // enregistre un producteur.
            await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate"); // creer un parcelle

            const compteurParcelles = parseInt(await contrat.compteurParcelles());
            // recuperer le parcelle
            const parcelle = await contrat.parcelles(compteurParcelles); 

            // Verifie si c'est bien la parcelle creer.
            expect(parcelle.id).to.equal(compteurParcelles);
            expect(parcelle.dateRecolte).to.equal("12/12/25");
        })
    });


    describe("mettreAJourEtape()", function () {
        it("Seul un producteur peut mettre a jour l'etape", async function () {
            // creation d'un producteur
            await contrat.enregistrerActeur(addr1, 0);
            // creation parcelle
            await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            // faire appel a la fonction mettreAJourEtape() par le producteur
            await contrat.connect(addr1).mettreAJourEtape(parseInt(await contrat.compteurParcelles()), 1);
        })

        it("Verifie si l'evenemet EtapeMiseAJour a ete bien emis", async function () {
            // creation d'un producteur
            await contrat.enregistrerActeur(addr1, 0);
            // creation parcelle
            await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            // faire appel a la fonction mettreAJourEtape() par le producteur
            const tx = await contrat.connect(addr1).mettreAJourEtape(parseInt(await contrat.compteurParcelles()), 1);

            // verifie si l'evenement a bien ete emis
            expect(tx)
                .to.emit(contrat, "EtapeMiseAJour")
                .withArgs(parseInt(await contrat.compteurParcelles()), 1)
        })

        it("Verifie si l'etape a bien ete mise a jour", async function () {
            // creation d'un producteur
            await contrat.enregistrerActeur(addr1, 0);
            // creation parcelle
            await contrat.connect(addr1).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");
            // recuperer la parcelle
            let parcelle = await contrat.parcelles(parseInt(await contrat.compteurParcelles()));

            // verifie si l'etape a ete initialiser a 0
            expect(parcelle.etape).to.equal(0);
            
            // faire appel a la fonction mettreAJourEtape() par le producteur
            const tx = await contrat.connect(addr1).mettreAJourEtape(parcelle.id, 2);
            
            // verifie si l'etape a ete mise a jour
            parcelle = await contrat.parcelles(parcelle.id);
            expect(parcelle.etape).to.equal(2);
        })
    });


    describe("appliquerControlePhytosanitaire()", function () {
        it("Seul un certificateur peut controler un control phytosanitaire", async function () {
            // enregistrer un certificateur
            await contrat.enregistrerActeur(addr1, 2);
            // enregistrer un producteur
            await contrat.enregistrerActeur(addr0, 0);
            // creer parcelle
            await contrat.connect(addr0).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            // recuperer l'id du parcelle fraichement creer
            const idParcelle = parseInt(await contrat.compteurParcelles());
            // mettre a jour l'etape de culture du parcelle
            await contrat.connect(addr0).mettreAJourEtape(idParcelle, 1);

            // appel la fonction appliquerControlePhytosanitaire()
            await contrat.connect(addr1).appliquerControlePhytosanitaire(idParcelle, true);
        })

        it("Verifie si l'evenemet ControlePhytosanitaire a ete bien emis", async function () {
            // enregistrer un certificateur
            await contrat.enregistrerActeur(addr1, 2);
            // enregistrer un producteur
            await contrat.enregistrerActeur(addr0, 0);
            // creer parcelle
            await contrat.connect(addr0).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            // recuperer l'id du parcelle fraichement creer
            const idParcelle = parseInt(await contrat.compteurParcelles());
            // mettre a jour l'etape de culture du parcelle
            await contrat.connect(addr0).mettreAJourEtape(idParcelle, 1);

            expect(contrat.connect(addr1).appliquerControlePhytosanitaire(idParcelle, true))
                .to.emit(contrat, "ControlePhytosanitaire")
                .withArgs(idParcelle, true);
        })

        it("Verifie qu'un parcelle a ete bien certifiter", async function () {
            // enregistrer un certificateur
            await contrat.enregistrerActeur(addr1, 2);
            // enregistrer un producteur
            await contrat.enregistrerActeur(addr0, 0);
            // creer parcelle
            await contrat.connect(addr0).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            // recuperer l'id du parcelle fraichement creer
            const idParcelle = parseInt(await contrat.compteurParcelles());
            // mettre a jour l'etape de culture du parcelle
            await contrat.connect(addr0).mettreAJourEtape(idParcelle, 1);

            // appel la fonction appliquerControlePhytosanitaire()
            await contrat.connect(addr1).appliquerControlePhytosanitaire(idParcelle, true);

            // recuperer le parcelle certifier
            const parcelle = await contrat.parcelles(idParcelle);

            expect(parcelle.certifie).to.equal(true);
        })
    });
});