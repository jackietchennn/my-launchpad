// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract C2NAirdrop {
    using ECDSA for bytes32;
    using Math for *;

    IERC20 public airdropToken;
    uint256 public totalTokenWithdrawn;

    mapping (address => bool) wasClaimed;
    uint256 public constant TOKENS_PER_CLAIM = 100 * 10 ** 18;

    event TokenAirdroped(address indexed beneficiary);

    constructor(address _airdropToken) {
        require(_airdropToken != address(0), "Airdrop: Invalid token address");

        airdropToken = IERC20(_airdropToken);
    }

    function withdrawTokens() public {
        address beneficiary = msg.sender;

        require(beneficiary == tx.origin, "Airdrop: require that message sender is tx-origin");
        require(!wasClaimed[beneficiary], "Airdrop: Already claimed");

        wasClaimed[beneficiary] = true;
        bool success = airdropToken.transfer(beneficiary, TOKENS_PER_CLAIM);
        require(success, "Airdrop: airdrop failed");

        totalTokenWithdrawn = totalTokenWithdrawn + TOKENS_PER_CLAIM;
        emit TokenAirdroped(beneficiary);
    }
}