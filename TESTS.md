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


### CollecteurExportateurContractOK
|-------------------------------------------------------------------------------------------------------|
| **Fonction**                          | **Description du test**                                       |
|---------------------------------------|---------------------------------------------------------------|
| enregistrerActeur()                   | Verifie si l'evenemet ActeurEnregistre a ete bien emis        |
|                                       | Verifie si l'acteur a bien ete enregistre                     |
|---------------------------------------|---------------------------------------------------------------|


## Les commandes pour executer les tests
~ Executer tous les tests :
```sh
npx hardhat test
```
~ Executer un seul fichier test :
```sh
npx hardhat test test/<nomDuFichierTest>
```