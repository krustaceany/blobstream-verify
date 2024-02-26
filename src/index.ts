import { Hex, createPublicClient, createTestClient, createWalletClient, encodePacked, extractChain, fromHex, hexToBytes, http, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry, goerli, sepolia } from 'viem/chains';
import { abi as verifyAbi } from './verify';
import { abi as blobstreamxAbi } from './blobstreamx';
import { AttestationProof, BinaryMerkleProof, Namespace, NamespaceMerkleMultiproof, NamespaceNode, SharesProof } from './types';
import { chainId, hexToNamespace } from './utils';
import { program } from 'commander';
import { getDataRoot, getDataRootInclusionProof, getProveShares } from './network';

async function main() {
  require('dotenv').config();
  const privateKey = process.env.PRIVATE_KEY! as Hex;
  const account = privateKeyToAccount(privateKey);
  const id = process.env.CHAIN_ID!;
  const chain = extractChain({chains: [foundry, goerli, sepolia], id: chainId(id)});
  const walletClient = createWalletClient({
    chain,
    transport: http(),
    account
  });
  const publicClient = createPublicClient({
    chain,
    transport: http()
  });

  const bridge = process.env.BRIDGE_ADDRESS! as Hex;
  const verifyContract = process.env.VERIFY_CONTRACT_ADDRESS! as Hex;

  const celestiaRpcUrl = process.env.CELESTIA_RPC_URL!;
  const namespaceHex = process.env.NAMESPACE! as Hex;

  program.option('-h, --height <height>', 'height of the shares');
  program.parse(process.argv);
  const options = program.opts();
  const height = options.height;
  const namespace = hexToNamespace(namespaceHex);
  const proofNonce = BigInt(1185);
  const shareProofs = await getProveShares(celestiaRpcUrl, height, namespaceHex);
  if (!shareProofs) {
    throw new Error('Failed to get share proofs');
  }
  const dataRootInclusionProof = await getDataRootInclusionProof(celestiaRpcUrl, height, 840030, 840336);
  const dataRoot = await getDataRoot(celestiaRpcUrl, height);
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


  const res = await publicClient.simulateContract({
    address: verifyContract,
    abi: verifyAbi,
    functionName: 'verifyShares',
    args: [
      sharesProof,
      dataRoot,
    ]
  });
  console.log(res);

  const writeRes = await walletClient.writeContract({
    address: verifyContract,
    abi: verifyAbi,
    functionName: 'verifyShares',
    args: [
      sharesProof,
      dataRoot,
    ]
  });
  console.log(writeRes);

  const json = JSON.stringify(sharesProof , (key, value) => {
    return typeof value === 'bigint' ? value.toString() : value;
  });
}

main().catch(console.error);