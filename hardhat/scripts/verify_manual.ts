import { run, upgrades } from "hardhat";

const FORWARDER = "0x94D59635d245dcf953C9F658813312eB556eF977";
const MINT_NFT_PROXY = "0x73501F37CE694918713eC8Eca4697166833a696A";
const EVENT_MANAGER_PROXY = "0x6Ce254b5c0a53506bBC64F4BA1BEB237f38fad30";
const SECRET_PHRASE_VERIFIER = "0x0D1108e8b0878183d7668BfB72Db68b76f6DfdB7";
const OPERATION_CONTROLLER = "0x22Af9c01EFA249c431a41Cde9C9B5934a56eF71A";

async function verify(address: string, constructorArguments: any[] = []) {
    try {
        await run("verify:verify", {
            address,
            constructorArguments,
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
