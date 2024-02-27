import { Hex, toHex } from "viem";
import { NamespaceNode } from "./types";
import axios, { AxiosError, AxiosInstance } from "axios";

type ProveShares = {
  data: string[];
  share_proofs: [{
    start?: number;
    end: number;
    nodes: string[];
  }];
  namespace_id: string;
  row_proof: {
    row_roots: string[];
    proofs: [{
      total: number;
      index: number;
      leaf_hash: string;
      aunts: string[];
    }];
    start_row: number;
    end_row: number;
  };
  namespace_version: number;
}

export class CelestiaClient {
  private client: AxiosInstance;
  constructor(private rpcUrl: string) {
    this.client = axios.create({
      baseURL: rpcUrl,
    });
  }

  async getProveShares(height: bigint, namespace: Hex) {
    let startShare = 0;
    let endShare = 255;
    while (startShare <= endShare) {
      try {
        const response = await this.client.get(`/prove_shares?height=${height}&startShare=${startShare}&endShare=${endShare}`);
        const data = response.data as { result: ProveShares };
        const proveShares = data.result;
        console.log('Getting shares from', startShare, 'to', endShare, 'of namespace', namespace, 'at height', height.toString());
        return parseProveShares(proveShares);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const e = error as AxiosError;
          const responseData = e.response?.data as { error: { data: string } };
          const data = responseData.error.data;
          const includes = data.includes('shares range contain different namespaces at index');
          if (includes) {
            const regex = /shares range contain different namespaces at index (\d+): \{(\d+) \[(.*)\]\} and \{(\d+) \[(.*)\]\}/;
            const m = data.match(regex);
            if (m) {
              const firstNamespace = parseNamespaceBytes(m[2], m[3]);
              if (firstNamespace === namespace) {
                endShare = startShare + parseInt(m[1]);
              } else {
                startShare += parseInt(m[1]);
              }
            }
          } else {
            throw new Error(data);
          }
        } else {
          throw error;
        }
    }
    }
  }

  async getDataRootInclusionProof(height: bigint, start: bigint, end: bigint) {
    const response = await this.client.get(`/data_root_inclusion_proof?height=${height}&start=${start}&end=${end}`);
    const data = response.data as { result: { proof: { total: string, index: string, leaf_hash: string, aunts: string[] } } };
    const proof = data.result.proof;
    const sideNodes = proof.aunts.map((node) => toHex(Uint8Array.from(atob(node), c => c.charCodeAt(0))));
    const key = BigInt(proof.index);
    const numLeaves = BigInt(proof.total);
    return { key, numLeaves, sideNodes };
  }

  async getDataRoot(height: bigint) {
    const response = await this.client.get(`/block?height=${height}`);
    const data = response.data as { result: { block: { header: { data_hash: string } } } };
    return '0x' + data.result.block.header.data_hash as Hex;
  }
}

function parseNamespaceBytes(version: string, id: string) {
  const n = id.split(" ");
  n.unshift(version);
  const namespace = new Uint8Array(29);
  for (let i = 0; i < 29; i++) {
    namespace[i] = parseInt(n[i]);
  }
  return toHex(namespace);
}

function parseProveShares(proveShares: ProveShares) {
  const data = proveShares.data.map((share) => toHex(Uint8Array.from(atob(share), c => c.charCodeAt(0))));
  const shareProofs = proveShares.share_proofs.map((shareProof) => {
    const beginKey = BigInt(shareProof.start?? 0);
    const endKey = BigInt(shareProof.end!);
    const sideNodes = parseShareProofSideNodes(shareProof.nodes);
    return { beginKey, endKey, sideNodes };
  });
  const rowRoots = parseRowRoots(proveShares.row_proof.row_roots);
  const rowProofs = proveShares.row_proof.proofs.map((rowProof) => {
    const key = BigInt(rowProof.index);
    const numLeaves = BigInt(rowProof.total);
    const sideNodes = rowProof.aunts.map((node) => toHex(Uint8Array.from(atob(node), c => c.charCodeAt(0))));
    return { key, numLeaves, sideNodes };
  });
  return { data, shareProofs, rowRoots, rowProofs };
}

function parseShareProofSideNodes(nodes: string[]): NamespaceNode[] {
  const sideNodes = nodes.map((node) =>  {
    const n = Uint8Array.from(atob(node), c => c.charCodeAt(0));
    const min = {
      version: toHex(n.slice(0, 1)),
      id: toHex(n.slice(1, 29)),
    };
    const max = {
      version: toHex(n.slice(29, 30)),
      id: toHex(n.slice(30, 58)),
    };
    const digest = toHex(n.slice(58));
    return {
      min,
      max,
      digest,
    }
  });
  return sideNodes;
}

function parseRowRoots(roots: string[]): NamespaceNode[] {
  const rowRoots = roots.map((root) => {
    const min = {
      version: '0x' + root.slice(0, 2) as Hex,
      id: '0x' + root.slice(2, 58) as Hex,
    };
    const max = {
      version: '0x' + root.slice(58, 60) as Hex,
      id: '0x' + root.slice(60, 116) as Hex,
    };
    const digest = '0x' + root.slice(116) as Hex;
    return {
      min,
      max,
      digest,
    }
  });
  return rowRoots;
}

