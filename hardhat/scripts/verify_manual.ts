import { run, upgrades } from "hardhat";

const FORWARDER = "0x3d01b5d1e8dC61247559DAAeE6364Bf93cE338b5";
const MINT_NFT_PROXY = "0x866131722F7CAE06C33704c79aF1ff9088ff37B6";
const EVENT_MANAGER_PROXY = "0xc13cD875B74285bE88C8B0debC0A2Bb15Bd8eD18";
const SECRET_PHRASE_VERIFIER = "0x5084b81581b4ce9B96c1E0FAcB1B0b2C379F68f9";
const OPERATION_CONTROLLER = "0x58d1bcFf61Ae6a0Cf7414485ae615168Dbd9FaCb";

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
