import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import "hardhat-interface-generator";
import "hardhat-watcher";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Check current gas fee before deploy
    // https://livdir.com/polygongaspricechart/ja/
    polygon: {
      url: process.env.MAINNET_ALCHEMY_KEY || "",
      accounts: [String(process.env.MAINNET_PRIVATE_KEY)],
    },
    mumbai: {
      url: process.env.STAGING_ALCHEMY_KEY || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_ALCHEMY_KEY || "",
      accounts:
        process.env.SEPOLIA_PRIVATE_KEY !== undefined ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
    local: {
      url: "http://localhost:8545",
      accounts: [String(process.env.LOCAL_PRIVATE_KEY)],
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      polygon: String(process.env.ETHERSCAN_API_KEY),
      polygonMumbai: String(process.env.ETHERSCAN_API_KEY),
      sepolia: String(process.env.ETHERSCAN_API_KEY),
    },
  },
  mocha: {
    timeout: 600000,
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
      files: ["./contracts"],
      ignoredFiles: ["**/.vscode"],
      verbose: true,
      clearOnStart: true,
      start: "echo Running my compilation task now..",
    },
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**/*", "./contracts"],
      verbose: true,
      clearOnStart: true,
      start: "echo Running my test task now..",
    },
  },
};

export default config;
