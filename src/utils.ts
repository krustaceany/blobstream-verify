import { Hex } from "viem";
import { Namespace } from "./types";

export function chainId(id: string): 31337 | 5 | 11155111 {
  if (id === "31337") return 31337;
  if (id === "5") return 5;
  if (id === "11155111") return 11155111;
  throw new Error("Invalid chain id");
}

export function namespaceToHex(namespace: Namespace): Hex {
  const version = namespace.version.slice(2);
  const id = namespace.id.slice(2);
  return '0x' + version + id as Hex;
}

export function hexToNamespace(hex: Hex): Namespace {
  const version = '0x' + hex.slice(2, 4) as Hex;
  const id = '0x' + hex.slice(4) as Hex;
  return { version, id };
}