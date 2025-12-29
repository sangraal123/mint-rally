import { run, upgrades } from "hardhat";

const FORWARDER = "0x8e7d27ABCFCEB47961eB8Ff2A738f135A83972D5";
const MINT_NFT_PROXY = "0xD52dd2C326F7866EE050F683151c4799D3f290f1";
const EVENT_MANAGER_PROXY = "0xdea448D216672ffaD61a9A6b110235eBCF5f7f3D";
const SECRET_PHRASE_VERIFIER = "0xcFEC6D017B0A8F95c017C0a989457545d85bA888";
const OPERATION_CONTROLLER = "0x002ffeb1F10FAaAB4161354Bcb283Cb2261aeB82";

async function verify(address: string, constructorArguments: any[] = []) {
    try {
        await run("verify:verify", {
            address,
            constructorArguments,
            force: true,
        });
        console.log(`Verified ${address}`);
    } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log(`Already verified ${address}`);
        } else {
            console.error(`Error verifying ${address}:`, error);
        }
    }
}

async function main() {
    console.log("Starting verification...");

    // 1. Verify Forwarder
    console.log("Verifying Forwarder...");
    await verify(FORWARDER);

    // 2. Verify SecretPhraseVerifier
    console.log("Verifying SecretPhraseVerifier...");
    await verify(SECRET_PHRASE_VERIFIER);

    // 3. Verify OperationController
    // Note: OperationController is upgradeable but deployed as a regular contract in deploy_sepolia.ts?
    // Let's check deploy_sepolia.ts again.
    // It says: operationController = await OperationControllerFactory.deploy(); await operationController.deployed();
    // It is deployed as a standard contract, not a proxy.
    console.log("Verifying OperationController...");
    await verify(OPERATION_CONTROLLER);

    // 4. Verify MintNFT Implementation
    console.log("Verifying MintNFT Implementation...");
    const mintNftImpl = await upgrades.erc1967.getImplementationAddress(MINT_NFT_PROXY);
    console.log(`MintNFT Proxy: ${MINT_NFT_PROXY}`);
    console.log(`MintNFT Implementation: ${mintNftImpl}`);
    await verify(mintNftImpl);

    // 5. Verify EventManager Implementation
    console.log("Verifying EventManager Implementation...");
    const eventManagerImpl = await upgrades.erc1967.getImplementationAddress(EVENT_MANAGER_PROXY);
    console.log(`EventManager Proxy: ${EVENT_MANAGER_PROXY}`);
    console.log(`EventManager Implementation: ${eventManagerImpl}`);
    await verify(eventManagerImpl);

    console.log("Verification finished.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
