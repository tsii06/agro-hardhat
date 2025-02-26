const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(`🚀 Déploiement du contrat avec l'adresse : ${deployer.address}`);

    // Déploiement du contrat
    const Contrat = await ethers.getContractFactory("CollecteurExportateurContrat");
    const contrat = await Contrat.deploy(deployer.address);
    await contrat.waitForDeployment();

    console.log(`✅ Contrat déployé à l'adresse : ${await contrat.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
