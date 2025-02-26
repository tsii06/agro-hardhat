# Tests unitaires des smarts contracts


## Objectifs
Decrit les tests unitaires effectues sur les smart contracts du projet.


## Smart contracts Testes
- **CollecteurExportateurContractOK.sol**
- **ProducteurEnPhaseCulture.sol**


## Tests effectues

## ProducteurEnPhaseCulture
|-------------------------------------------------------------------------------------------------------|
| **Fonction**                          | **Description du test**                                       |
|---------------------------------------|---------------------------------------------------------------|
| enregistrerActeur()                   | Verifie si l'evenemet ActeurEnregistre a ete bien emis        |
|                                       | Verifie si l'acteur a bien ete enregistre                     |
|---------------------------------------|---------------------------------------------------------------|
| creerParcelle()                       | Seul un producteur peut creer un parcelle                     |
|                                       | Verifie si l'evenemet SemenceValidee a ete bien emis          |
|                                       | Verifie si l'evenemet MethodeCultureFixee a ete bien emis     |
|                                       | Verifie si l'evenemet ParcelleCree a ete bien emis            |
|                                       | Verifie qu'un parcelle a ete bien creer                       |
|---------------------------------------|---------------------------------------------------------------|
| mettreAJourEtape()                    | Seul un producteur peut mettre a jour l'etape                 |
|                                       | Verifie si l'evenemet EtapeMiseAJour a ete bien emis          |
|                                       | Verifie si l'etape a bien ete mise a jour                     |
|---------------------------------------|---------------------------------------------------------------|
| appliquerControlePhytosanitaire()     | Seul un certificateur peut controler un control phytosanitaire|
|                                       | Verifie si l'evenemet ControlePhytosanitaire a ete bien emis  |
|                                       | Verifie qu'un parcelle a ete bien certifiter                  |
|---------------------------------------|---------------------------------------------------------------|
| confirmerRecolte()                    | Seul un certificateur peut confirmer la qualite de la recolte |
|                                       | Verifie si l'evenemet RecolteConfirmee a ete bien emis        |
|---------------------------------------|---------------------------------------------------------------|
| ajouterPhoto()                        | Seul un producteur peut ajouter un photo                      |
|                                       | Verifie si l'evenemet PhotoAjoutee a ete bien emis            |
|                                       | Verifie si l'url de la photo a bien ete donnee                |
|---------------------------------------|---------------------------------------------------------------|
| ajouterIntrant()                      | Verifie si l'evenemet IntrantAjoute a ete bien emis           |
|                                       | Verifie si l'intrant a bien ete ajouter                       |


### CollecteurExportateurContractOK
|-------------------------------------------------------------------------------------------------------|
| **Fonction**                          | **Description du test**                                       |
|---------------------------------------|---------------------------------------------------------------|
| enregistrerActeur()                   | Verifie si l'evenemet ActeurEnregistre a ete bien emis        |
|                                       | Verifie si l'acteur a bien ete enregistre                     |
|---------------------------------------|---------------------------------------------------------------|
| ajouterProduit()                      | Verifie si l'evenemet ProduitAjoute a ete bien emis           |
|                                       | Verifie si le produit a bien ete enregistre                   |
|---------------------------------------|---------------------------------------------------------------|
| passerCommande()                      | Verifie si l'evenemet CommandePasser a ete bien emis          |
|                                       | Verifie si la commande a bien ete enregistre                  |
|---------------------------------------|---------------------------------------------------------------|
| validerProduit()                      | Verifie si l'evenemet ProduitValide a ete bien emis           |
|                                       | Verifie si le produit a bien ete valider                      |
|---------------------------------------|---------------------------------------------------------------|
| effectuerPaiement()                   | Verifie si l'evenemet PaiementEffectue a ete bien emis        |
|                                       | Verifie si le payement a ete enregistrer                      |
|---------------------------------------|---------------------------------------------------------------|
| valideenregistrerConditionrProduit()  | Verifie si l'evenemet ConditionEnregistree a ete bien         |
|                                       | Verifie si le condition a ete enregistrer                     |
|---------------------------------------|---------------------------------------------------------------|
| mettreAJourStatutTransport()          | Verifie si l'evenemet StatutTransportMisAJour a ete bien      |
|                                       | Verifie si le statut transport a ete vraiment mise a jour     |


## Les commandes pour executer les tests
~ Executer tous les tests :
```sh
npx hardhat test
```
~ Executer un seul fichier test :
```sh
npx hardhat test test/<nomDuFichierTest>
```