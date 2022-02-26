// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
/*
 * @title Buddie The Platypus
 */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BuddieThePlatypus is
    ERC721,
    ERC721URIStorage,
    PaymentSplitter,
    Ownable
{
    uint256 TOTAL = 999;
    uint256 count = 0;
    uint256 price = 12000000000000000000;
    string URI;

    constructor(
        string memory _URI,
        address[] memory _payees,
        uint256[] memory _shares
    ) ERC721("Buddie the Platypus", "BUDD") PaymentSplitter(_payees, _shares) {
        URI = _URI;
    }

    /**
     * @notice Mint!
     * @param _count The number of NFTs to mint!
     */

    function publicMint(uint256 _count) public payable {
        require(msg.value >= price * _count, "Not enough Matic to mint.");
        require(count + _count <= TOTAL, "Can't mind that many Buddies.");

        // Hashlips generator starts at 1, but count needs to start at 0, so adding
        // +1 to count to get tokenId.
        _mint(msg.sender, count + 1);

        count = count += 1;
    }

    /**
     * @notice get the total number of NFTs minted
     */
    function getTotal() public view returns (uint256) {
        return count;
    }

    /**
     * @notice Get the current minting price
     */
    function getPrice() public view returns (uint256) {
        return price;
    }

    /**
     * @notice Set the metadata URI
     * @param _URI The URI to set.
     */

    function setURI(string memory _URI) public onlyOwner {
        URI = _URI;
    }

    /**
     * @notice Set the current price
     * @param _price The price in matic to set.
     */

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyOwner
    {
        super._burn(tokenId);
    }

    /**
     * @notice The URI for a given token.
     * @param tokenId The ID of the token to check.
     */

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return
            string(abi.encodePacked(URI, Strings.toString(tokenId), ".json"));
    }
}
