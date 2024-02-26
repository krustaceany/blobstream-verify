import { Hex, createPublicClient, extractChain, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry, goerli, sepolia } from 'viem/chains';
import { abi as verifyAbi } from './verify';
import { AttestationProof, SharesProof } from './types';
import { chainId, hexToNamespace } from './utils';
import { program } from 'commander';
import { CelestiaClient } from './network';

async function main() {
  require('dotenv').config();
  const privateKey = process.env.PRIVATE_KEY! as Hex;
  const account = privateKeyToAccount(privateKey);
  const id = process.env.CHAIN_ID!;
  const chain = extractChain({chains: [foundry, goerli, sepolia], id: chainId(id)});
  const publicClient = createPublicClient({
    chain,
    transport: http()
  });

  const bridge = process.env.BRIDGE_ADDRESS! as Hex;
  const verifyContract = process.env.VERIFY_CONTRACT_ADDRESS! as Hex;

  const celestiaRpcUrl = process.env.CELESTIA_RPC_URL!;
  const namespaceHex = process.env.NAMESPACE! as Hex;

  program
    .option('-h, --height <height>', 'block height')
    .option('-s, --start <start>', 'block start for range')
    .option('-e, --end <end>', 'block end for range')
    .option('-n, --nonce <nonce>', 'proof nonce');

  program.parse(process.argv);
  const options = program.opts();
  const height = BigInt(options.height);
  const start = BigInt(options.start);
  const end = BigInt(options.end);
  const proofNonce = BigInt(options.nonce);

  const namespace = hexToNamespace(namespaceHex);
  const celestiaClient = new CelestiaClient(celestiaRpcUrl);
  const shareProofs = await celestiaClient.getProveShares(height, namespaceHex);
  if (!shareProofs) {
    throw new Error('Failed to get share proofs');
  }
  const dataRootInclusionProof = await celestiaClient.getDataRootInclusionProof(height, start, end);
  const dataRoot = await celestiaClient.getDataRoot(height);
  const dataRootTuple = { height, dataRoot };
  const attestationProof: AttestationProof = {
    tupleRootNonce: proofNonce,
    tuple: dataRootTuple,
    proof: dataRootInclusionProof
  };

  const sharesProof: SharesProof = {
    data: shareProofs.data,
    shareProofs: shareProofs.shareProofs,
    namespace,
    rowRoots: shareProofs.rowRoots,
    rowProofs: shareProofs.rowProofs,
    attestationProof,
  }


  const res = await publicClient.readContract({
    address: verifyContract,
    abi: verifyAbi,
    functionName: 'verify',
    args: [
      bridge,
      sharesProof,
      dataRoot,
    ]
  });

  if (res[0]) {
    console.log('Verified');
  } else {
    console.log('Error verifying: ', res[1]);
  }
}

main().catch(console.error);