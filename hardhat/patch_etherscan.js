const fs = require('fs');
const path = 'node_modules/@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  'urlWithQuery.search = parameters.toString();',
  'parameters.forEach((value, key) => { urlWithQuery.searchParams.set(key, value); });'
);
fs.writeFileSync(path, content);
console.log('Patched EtherscanService.js');
