//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract HealNFT is ERC721Enumerable, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;
  
  Counters.Counter private _tokenIds;
  uint public constant MAX_SUPPLY = 100;
  uint public constant PRICE = 0.001 ether;
  uint public constant MAX_PER_MINT = 5;
  string public baseTokenURI;
  string[4] public uriBases = [
    "https://ipfs.io/ipfs/QmVR7hosBX71j5REFeqPMVSXzmdFj1iMYoFakHSB1wmHec",
    "https://ipfs.io/ipfs/QmYXXQn9CqJxgNk5Qwngi5t3RRuQtT9qe5aAJ2jHVHHBKe",
    "https://ipfs.io/ipfs/QmYMLCfuxP6YP9y7noDAJV3KzVJjmsTyqmh57uT8XRKczy",
    "https://ipfs.io/ipfs/QmSWz6U2aPo7L5Yka1bA3Q2xoxr3V7Yay6oCJQfTn9ePyR"
  ];
  uint public max_per_mint = 5;

  constructor(string memory baseURI) ERC721("HEAL NFT", "HLNFT") {
    setBaseURI(baseURI);
  }

  function configure(uint _max_per_mint) public onlyOwner {
    require(_max_per_mint > 0, "Max per mint count should be greater than zero!");
    max_per_mint = _max_per_mint;
  }

  function reserveNFTs() public onlyOwner {
    uint totalMinted = _tokenIds.current();
    require(totalMinted.add(10) < MAX_SUPPLY, "Not enough NFTs");
    for (uint i = 0; i < 10; i ++) {
      _mintSingleNFT();
    }
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function mintNFTs(uint _count) public payable {
    uint totalMinted = _tokenIds.current();

    require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs!");
    require(_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs");
    require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");

    for(uint i = 0; i < _count; i ++) {
      _mintSingleNFT();
    }
  }

  function _mintSingleNFT() private {
    uint newTokenID = _tokenIds.current();
    _safeMint(msg.sender, newTokenID);
    _tokenIds.increment();
  }

  function setBaseURI(string memory uri) private {
    baseTokenURI = uri;
  }

  function tokensOfOwner(address _owner) 
    external 
    view 
    returns(uint[] memory) {
    
    uint tokenCount = balanceOf(_owner);
    uint[] memory tokensId = new uint256[](tokenCount);

    for(uint i = 0; i < tokenCount; i ++) {
      tokensId[i] = tokenOfOwnerByIndex(_owner, i);
    }

    return tokensId;
  }

  function withdraw() public payable onlyOwner {
    uint balance = address(this).balance;
    require(balance > 0, "No ether left to withdraw");
    (bool success, ) = (msg.sender).call{value:balance}("");
    require(success, "Transfer failed");
  }
}

