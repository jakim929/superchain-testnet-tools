// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Owned } from "solmate/auth/Owned.sol";

contract Counter is Owned {
    uint256 public number;

    constructor(address _owner) Owned(owner) {
    }

    function setNumber(uint256 _newNumber) public {
        number = _newNumber;
    }

    function increment() public {
        number++;
    }
}
