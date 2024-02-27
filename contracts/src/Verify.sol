pragma solidity ^0.8.24;

import "forge-std/console.sol";
// import {BlobstreamX} from "@blobstreamx/src/BlobstreamX.sol";
import {DataRootTuple} from "@blobstream/DataRootTuple.sol";
import {IDAOracle} from "@blobstream/IDAOracle.sol";
import {SharesProof, DAVerifier} from "@blobstream-verifier/DAVerifier.sol";

contract Verify {
    function verify(address bridgeAddress, SharesProof calldata sharesProof, bytes32 dataRoot)
        public
        view
        returns (bool, DAVerifier.ErrorCodes)
    {
        IDAOracle bridge = IDAOracle(bridgeAddress);

        return DAVerifier.verifySharesToDataRootTupleRoot(bridge, sharesProof, dataRoot);
    }
}
