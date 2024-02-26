import { Hex } from "viem";

export type AttestationProof = {
  tupleRootNonce: bigint;
  tuple: DataRootTuple;
  proof: BinaryMerkleProof;
};

export type DataRootTuple = {
  height: bigint;
  dataRoot: Hex;
};

export type BinaryMerkleProof = {
  sideNodes: Hex[];
  key: bigint;
  numLeaves: bigint;
};

export type Namespace = {
  version: Hex;
  id: Hex;
};

export type NamespaceNode = {
  min: Namespace;
  max: Namespace;
  digest: Hex;
};

export type NamespaceMerkleMultiproof = {
  beginKey: bigint;
  endKey: bigint;
  sideNodes: NamespaceNode[];
};

export type SharesProof = {
  data: Hex[];
  shareProofs: NamespaceMerkleMultiproof[];
  namespace: Namespace;
  rowRoots: NamespaceNode[];
  rowProofs: BinaryMerkleProof[];
  attestationProof: AttestationProof;
};
