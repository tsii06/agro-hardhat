const { ethers } = require('hardhat');
const { expect } = require('chai');
const { int } = require('hardhat/internal/core/params/argumentTypes');

describe("ProducteurEnPhaseCulture", function () {
    let Contrat;
    let contrat;
    let addr0, addr1, addr2;
    this.beforeEach(async function () {
        [addr0, addr1, addr2] = await ethers.getSigners();
        
        Contrat = await ethers.getContractFactory("contracts/ProducteurEnPhaseCulture.sol:ProducteurEnPhaseCulture");
        contrat = await Contrat.deploy();
        await contrat.waitForDeployment();
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

            // verifie si l'evenement a bien ete emis
            await expect(await contrat.connect(addr1).mettreAJourEtape(parseInt(await contrat.compteurParcelles()), 1))
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

            await expect(contrat.connect(addr1).appliquerControlePhytosanitaire(idParcelle, true))
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


    describe("confirmerRecolte()", function () {
        let certificateur, producteur, idParcelle;
        this.beforeEach(async function () {
            certificateur = addr1;
            producteur = addr0;
            // enregistrer un certificateur
            await contrat.enregistrerActeur(certificateur, 2);
            // enregistrer un producteur
            await contrat.enregistrerActeur(producteur, 0);
            // creer parcelle
            await contrat.connect(addr0).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");
    
            // recuperer l'id du parcelle fraichement creer
            idParcelle = parseInt(await contrat.compteurParcelles());
            // mettre a jour l'etape de culture du parcelle en recolte
            await contrat.connect(addr0).mettreAJourEtape(idParcelle, 2);
        })
        
        it("Seul un certificateur peut confirmer la qualite de la recolte", async function () {
            await contrat.connect(certificateur).confirmerRecolte(idParcelle, true);
        })

        it("Verifie si l'evenemet RecolteConfirmee a ete bien emis", async function () {
            await expect(contrat.connect(certificateur).confirmerRecolte(idParcelle, true))
                .to.emit(contrat, "RecolteConfirmee")
                .withArgs(idParcelle, true);
        })
    });


    describe("ajouterPhoto()", function () {
        let producteur, idParcelle;
        this.beforeEach(async function () {
            producteur = addr0;
            // enregistrer un producteur
            await contrat.enregistrerActeur(producteur, 0);
            // creer parcelle
            await contrat.connect(producteur).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");
            // recuperer l'id du parcelle
            idParcelle = parseInt(await contrat.compteurParcelles());
        })

        it("Seul un producteur peut ajouter un photo", async function () {
            await contrat.connect(producteur).ajouterPhoto(idParcelle, "urlPhoto");
        })
        
        it("Verifie si l'evenemet PhotoAjoutee a ete bien emis", async function () {
            await expect(contrat.connect(producteur).ajouterPhoto(idParcelle, "urlPhoto"))
                .to.emit(contrat, "PhotoAjoutee")
                .withArgs(idParcelle, "urlPhoto");
        })
        
        it("Verifie si l'url de la photo a bien ete donnee", async function () {
            await contrat.connect(producteur).ajouterPhoto(idParcelle, "urlPhoto");
            // recuperer tous les photos
            const photos = await contrat.getPhotos(idParcelle);
            expect(photos[0]).to.equal("urlPhoto");
        })
    });


    describe("ajouterIntrant()", function () {
        let fournisseur, producteur, idParcelle;
        this.beforeEach(async function () {
            // enregistrer un fournisseur et un producteur
            await contrat.enregistrerActeur(addr0, 1);
            await contrat.enregistrerActeur(addr1, 0);
            fournisseur = addr0;
            producteur = addr1;
            // enregistrer un parcelle
            await contrat.connect(producteur).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            idParcelle = await contrat.compteurParcelles();
        });

        it("Verifie si l'evenemet IntrantAjoute a ete bien emis", async function () {
            await expect(contrat.connect(fournisseur).ajouterIntrant(idParcelle, "nom", 10))
                .to.emit(contrat, "IntrantAjoute")
                .withArgs(idParcelle, "nom", 10);
        })

        it("Verifie si l'intrant a bien ete ajouter", async function () {
            await contrat.connect(fournisseur).ajouterIntrant(idParcelle, "nom", 10);
            const intrant = await contrat.connect(producteur).getIntrants(idParcelle);
            expect(intrant[0].nom).to.equal("nom");
            expect(intrant[0].quantite).to.equal(10);
            expect(intrant[0].valide).to.equal(false);
        })
    });


    describe("validerIntrant()", function () {
        let certificateur, producteur,fournisseur, idParcelle;
        this.beforeEach(async function () {
            // enregistrer un certificateur et un producteur et certificateur
            await contrat.enregistrerActeur(addr0, 0);
            await contrat.enregistrerActeur(addr1, 1);
            await contrat.enregistrerActeur(addr2, 2);
            producteur = addr0;
            fournisseur = addr1;
            certificateur = addr2;
            // enregistrer un parcelle
            await contrat.connect(producteur).creerParcelle("bon", "sur brulis", "latitude", "longitude", "nomProduit", "12/12/25", "certificate");

            idParcelle = await contrat.compteurParcelles();
            // ajouter intrant a parcelle
            await contrat.connect(fournisseur).ajouterIntrant(idParcelle, "nom", 10);
        });

        it("Verifie si l'evenemet IntrantValide a ete bien emis", async function () {
            await expect(contrat.connect(certificateur).validerIntrant(idParcelle, "nom", true))
                .to.emit(contrat, "IntrantValide")
                .withArgs(idParcelle, "nom", true);
        })

        it("Verifie si l'intrant a bien ete valider", async function () {
            await contrat.connect(certificateur).validerIntrant(idParcelle, "nom", true);
            const intrants = await contrat.getIntrants(idParcelle);
            expect(intrants[0].valide).to.equal(true);
        })
    });
});