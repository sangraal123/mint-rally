import { ethers } from "hardhat";

// EventManager proxy on Sepolia
const EVENT_MANAGER_ADDRESS = "0xc13cD875B74285bE88C8B0debC0A2Bb15Bd8eD18";

async function main() {
    console.log("Scanning storage for:", EVENT_MANAGER_ADDRESS);
    const provider = ethers.provider;

    // Scan a range where we expect the variables to be (OwnableUpgradeable usually takes 50 slots)
    // We'll scan 0-100 to be safe.
    for (let i = 0; i < 152; i++) {
        const val = await provider.getStorageAt(EVENT_MANAGER_ADDRESS, i);
        // Print non-zero slots
        if (val !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
            console.log(`Slot ${i}: ${val}`);

            // Check for Relayer address (0xe67f015837930043fc1acaec777e9ba716a5d2ac)
            if (val.toLowerCase().includes("e67f015837930043fc1acaec777e9ba716a5d2ac".toLowerCase())) {
                console.log(`*** FOUND RELAYER ADDRESS AT SLOT ${i} ***`);
            }

            // Check for 250000 (0x3d090) or similar
            const bigVal = ethers.BigNumber.from(val);
            if (bigVal.eq(250000)) {
                console.log(`*** FOUND mtxPrice (250000) AT SLOT ${i} ***`);
            }
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
