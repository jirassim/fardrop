// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AirdropBadge
 * @dev NFT Badge สำหรับแสดงผล Airdrop Eligibility
 *
 * Tier System:
 * - Tier 1 (High): Score >= 120
 * - Tier 2 (Medium): Score 60-119
 * - Tier 3 (Low): Score < 60
 */
contract AirdropBadge is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping from address to token ID
    mapping(address => uint256) public addressToTokenId;

    // Mapping from token ID to badge data
    struct BadgeData {
        uint256 score;
        uint256 basePoints;
        uint256 farcasterPoints;
        string tier;
        uint256 mintedAt;
    }

    mapping(uint256 => BadgeData) public tokenToBadgeData;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 score, string tier);
    event BadgeUpdated(uint256 indexed tokenId, uint256 newScore, string newTier);

    constructor() ERC721("Airdrop Eligibility Badge", "AIRDROP") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from 1
    }

    /**
     * @dev Mint badge สำหรับ user (1 address = 1 badge เท่านั้น)
     */
    function mintBadge(
        address to,
        uint256 score,
        uint256 basePoints,
        uint256 farcasterPoints,
        string memory tier,
        string memory tokenURI
    ) public onlyOwner {
        require(addressToTokenId[to] == 0, "Address already has a badge");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        addressToTokenId[to] = tokenId;
        tokenToBadgeData[tokenId] = BadgeData({
            score: score,
            basePoints: basePoints,
            farcasterPoints: farcasterPoints,
            tier: tier,
            mintedAt: block.timestamp
        });

        emit BadgeMinted(to, tokenId, score, tier);
    }

    /**
     * @dev Update badge ของ user (ถ้ามี activity ใหม่)
     */
    function updateBadge(
        address owner,
        uint256 newScore,
        uint256 newBasePoints,
        uint256 newFarcasterPoints,
        string memory newTier,
        string memory newTokenURI
    ) public onlyOwner {
        uint256 tokenId = addressToTokenId[owner];
        require(tokenId != 0, "Address does not have a badge");

        tokenToBadgeData[tokenId] = BadgeData({
            score: newScore,
            basePoints: newBasePoints,
            farcasterPoints: newFarcasterPoints,
            tier: newTier,
            mintedAt: tokenToBadgeData[tokenId].mintedAt // Keep original mint time
        });

        _setTokenURI(tokenId, newTokenURI);

        emit BadgeUpdated(tokenId, newScore, newTier);
    }

    /**
     * @dev Check if address has badge
     */
    function hasBadge(address owner) public view returns (bool) {
        return addressToTokenId[owner] != 0;
    }

    /**
     * @dev Get badge data for address
     */
    function getBadgeData(address owner) public view returns (BadgeData memory) {
        uint256 tokenId = addressToTokenId[owner];
        require(tokenId != 0, "Address does not have a badge");
        return tokenToBadgeData[tokenId];
    }

    /**
     * @dev Override transfer functions to make badges soulbound (ไม่สามารถโอนได้)
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0)) but block transfers
        if (from != address(0)) {
            require(to == address(0), "Soulbound: Badge cannot be transferred");
        }

        return super._update(to, tokenId, auth);
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
