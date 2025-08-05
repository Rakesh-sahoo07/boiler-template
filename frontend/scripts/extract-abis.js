import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractsDir = path.join(__dirname, '../../smart-contracts/artifacts/contracts');
const outputDir = path.join(__dirname, '../src/contracts/abis');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const contracts = [
  'SimpleToken',
  'NFTCollection', 
  'PriceConsumer',
  'VRFConsumer',
  'UpgradeableContract'
];

contracts.forEach(contractName => {
  try {
    const artifactPath = path.join(contractsDir, `${contractName}.sol`, `${contractName}.json`);
    
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      const abi = artifact.abi;
      
      // Write ABI to output file
      const outputPath = path.join(outputDir, `${contractName}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
      
      console.log(`✅ Extracted ABI for ${contractName}`);
    } else {
      console.log(`⚠️  Artifact not found for ${contractName}`);
    }
  } catch (error) {
    console.error(`❌ Error extracting ABI for ${contractName}:`, error.message);
  }
});

console.log('🎉 ABI extraction completed!');