// SPDX-Liscense-Identifier: MIT

pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Airdrop {
    using ECDSA for bytes32;
    using Math for *;

    IERC20 public airdropToken;
    uint256 public totalTokenWithdrawn;

    mapping (address => bool) waClaimed;
    uint256 public constant TOKENS_PER_CLAIM = 100 * 10 ** 18;

    event TokenAirdroped(address indexed beneficiary);

    constructor(address _airdropToken) public {
        require(_airdropToken != address(0), "Airdrop: Invalid token address");

        airdropToken = IERC20(_airdropToken);
    }

    function withdrawTokens(uint256 value) public {
        address beneficiary = msg.sender;

        require(beneficiary == tx.origin, "Airdrop: require that message sender is tx-origin");
        require(!waClaimed[beneficiary], "Airdrop: Already claimed");

        wasClaimed[beneficiary] = true;
        bool success = airdropToken.transfer(beneficiary, TOKENS_PER_CLAIM);
        require(success, "Airdrop: airdrop failed");

        totalTokenWithdrawn = totalTokenWithdrawn.add(TOKENS_PER_CLAIM);
        emit TokenAirDroped(beneficiary);
    }
}