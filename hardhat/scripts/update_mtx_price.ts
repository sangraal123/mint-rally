import { ethers } from "hardhat";

const EVENT_MANAGER_ADDRESS = "0xc13cD875B74285bE88C8B0debC0A2Bb15Bd8eD18";
const NEW_MTX_PRICE = 600000;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Updating mtxPrice with account:", deployer.address);

    const EventManager = await ethers.getContractFactory("EventManager");
    const eventManager = EventManager.attach(EVENT_MANAGER_ADDRESS);

    const tx = await eventManager.setMtxPrice(NEW_MTX_PRICE);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();

    console.log("mtxPrice updated to:", NEW_MTX_PRICE);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
