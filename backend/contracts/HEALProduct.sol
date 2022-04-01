// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/interfaces/IERC20.sol';
import './interfaces/IHEALSpend.sol';
import './HEALWithdrawable.sol';

/**
 * @title HEALProduct
 * @dev Contract that every product developed in the HEAL ecosystem should implement
 */
contract HEALProduct is HEALWithdrawable {
  IERC20 private _token;
  IHEALSpend private _spend;

  uint8 public productID;

  constructor(
    uint8 _productID,
    address _tokenAddy,
    address _spendAddy
  ) {
    productID = _productID;
    _token = IERC20(_tokenAddy);
    _spend = IHEALSpend(_spendAddy);
  }

  function setTokenAddy(address _tokenAddy) external onlyOwner {
    _token = IERC20(_tokenAddy);
  }

  function setSpendAddy(address _spendAddy) external onlyOwner {
    _spend = IHEALSpend(_spendAddy);
  }

  function setProductID(uint8 _newId) external onlyOwner {
    productID = _newId;
  }

  function getTokenAddress() public view returns (address) {
    return address(_token);
  }

  function getSpendAddress() public view returns (address) {
    return address(_spend);
  }

  function _payForService(uint256 _weiToRemoveFromSpend) internal {
    _spend.spendOnProduct{ value: msg.value - _weiToRemoveFromSpend }(
      msg.sender,
      productID
    );
  }
}