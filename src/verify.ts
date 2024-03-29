export const abi = [
  {
    "type": "function",
    "name": "verify",
    "inputs": [
      {
        "name": "bridgeAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "sharesProof",
        "type": "tuple",
        "internalType": "struct SharesProof",
        "components": [
          {
            "name": "data",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "shareProofs",
            "type": "tuple[]",
            "internalType": "struct NamespaceMerkleMultiproof[]",
            "components": [
              {
                "name": "beginKey",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "endKey",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "sideNodes",
                "type": "tuple[]",
                "internalType": "struct NamespaceNode[]",
                "components": [
                  {
                    "name": "min",
                    "type": "tuple",
                    "internalType": "struct Namespace",
                    "components": [
                      {
                        "name": "version",
                        "type": "bytes1",
                        "internalType": "bytes1"
                      },
                      {
                        "name": "id",
                        "type": "bytes28",
                        "internalType": "bytes28"
                      }
                    ]
                  },
                  {
                    "name": "max",
                    "type": "tuple",
                    "internalType": "struct Namespace",
                    "components": [
                      {
                        "name": "version",
                        "type": "bytes1",
                        "internalType": "bytes1"
                      },
                      {
                        "name": "id",
                        "type": "bytes28",
                        "internalType": "bytes28"
                      }
                    ]
                  },
                  {
                    "name": "digest",
                    "type": "bytes32",
                    "internalType": "bytes32"
                  }
                ]
              }
            ]
          },
          {
            "name": "namespace",
            "type": "tuple",
            "internalType": "struct Namespace",
            "components": [
              {
                "name": "version",
                "type": "bytes1",
                "internalType": "bytes1"
              },
              {
                "name": "id",
                "type": "bytes28",
                "internalType": "bytes28"
              }
            ]
          },
          {
            "name": "rowRoots",
            "type": "tuple[]",
            "internalType": "struct NamespaceNode[]",
            "components": [
              {
                "name": "min",
                "type": "tuple",
                "internalType": "struct Namespace",
                "components": [
                  {
                    "name": "version",
                    "type": "bytes1",
                    "internalType": "bytes1"
                  },
                  {
                    "name": "id",
                    "type": "bytes28",
                    "internalType": "bytes28"
                  }
                ]
              },
              {
                "name": "max",
                "type": "tuple",
                "internalType": "struct Namespace",
                "components": [
                  {
                    "name": "version",
                    "type": "bytes1",
                    "internalType": "bytes1"
                  },
                  {
                    "name": "id",
                    "type": "bytes28",
                    "internalType": "bytes28"
                  }
                ]
              },
              {
                "name": "digest",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "rowProofs",
            "type": "tuple[]",
            "internalType": "struct BinaryMerkleProof[]",
            "components": [
              {
                "name": "sideNodes",
                "type": "bytes32[]",
                "internalType": "bytes32[]"
              },
              {
                "name": "key",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "numLeaves",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "attestationProof",
            "type": "tuple",
            "internalType": "struct AttestationProof",
            "components": [
              {
                "name": "tupleRootNonce",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "tuple",
                "type": "tuple",
                "internalType": "struct DataRootTuple",
                "components": [
                  {
                    "name": "height",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "dataRoot",
                    "type": "bytes32",
                    "internalType": "bytes32"
                  }
                ]
              },
              {
                "name": "proof",
                "type": "tuple",
                "internalType": "struct BinaryMerkleProof",
                "components": [
                  {
                    "name": "sideNodes",
                    "type": "bytes32[]",
                    "internalType": "bytes32[]"
                  },
                  {
                    "name": "key",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "numLeaves",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "dataRoot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum DAVerifier.ErrorCodes"
      }
    ],
    "stateMutability": "view"
  }
] as const
