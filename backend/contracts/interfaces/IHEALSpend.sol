// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title IHEALSpend
 * @dev Logic for spending HEAL on products in the product ecosystem.
 */
interface IHEALSpend {
  function spendOnProduct(address _payor, uint8 _product) external payable;
}