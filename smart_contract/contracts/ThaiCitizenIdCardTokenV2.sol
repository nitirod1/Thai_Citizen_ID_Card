// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract ThaiCitizenIdCardTokenV2 is Initializable, ERC721Upgradeable, PausableUpgradeable, AccessControlUpgradeable, ERC721BurnableUpgradeable, UUPSUpgradeable ,ERC721URIStorageUpgradeable{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    bytes32 public constant SUB_OWNER_ROLE = keccak256("SUB_OWNER_ROLE");
    bytes32 public constant CITIZEN_ROLE = keccak256("CITIZEN_ROLE");

    struct Citizen {
        string encrypData;
        string issueDate;
        string expiryDate;
    }
    // Mapping to store secure attributes for each tokenId
    mapping(uint256 => Citizen) private citizens;
    mapping(address => uint256) public tokenOwner;

    event mintToken(uint256 tokenId, address to);

    function initialize() public initializer {
        __ERC721_init("Thai Citizen ID Card", "TDIC");
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SUB_OWNER_ROLE, msg.sender);
    }

    constructor() {
       
    }

    modifier newRoleCitizen(address _to) {
        require(!hasRole(CITIZEN_ROLE, _to), "You already citizen role");
        _;
    }

    function isTokenOwner(
        uint256 tokenId,
        address account
    ) internal view returns (bool) {
        return _ownerOf(tokenId) == account; // fixed
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function getOwnToken() public view returns (uint256) {
        return tokenOwner[msg.sender];
    }

    function safeMint(
        address _to,
        string memory _encrypData,
        string memory _issueDate,
        string memory _expiryDate,
        string memory uri
    ) public newRoleCitizen(_to) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, uri);
        tokenOwner[msg.sender] = tokenId;
        // Store the secure attributes
        citizens[tokenId] = Citizen(_encrypData, _issueDate, _expiryDate);
        _grantRole(CITIZEN_ROLE, msg.sender);
        emit mintToken(tokenId, _to);
    }

    function update(
        uint256 _tokenId,
        string memory _encrypData,
        string memory _issueDate,
        string memory _expiryDate
    ) public onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        // Store the secure attributes
        citizens[_tokenId] = Citizen(_encrypData, _issueDate, _expiryDate);
    }

    // Function to retrieve secure attributes for a tokenId
    function getCitizenParty(
        uint256 _tokenId
    ) public view returns (string memory, string memory, string memory) {
        require(hasRole(SUB_OWNER_ROLE, msg.sender) == true);
        string memory encrypData = citizens[_tokenId].encrypData;
        string memory expiryDate = citizens[_tokenId].expiryDate;
        string memory issueDate = citizens[_tokenId].issueDate;
        return (encrypData, expiryDate, issueDate);
    }

    function getCitizen(
        uint256 _tokenId
    ) public view returns (string memory, string memory, string memory) {
        require(_ownerOf(_tokenId) == msg.sender);
        string memory encrypData = citizens[_tokenId].encrypData;
        string memory expiryDate = citizens[_tokenId].expiryDate;
        string memory issueDate = citizens[_tokenId].issueDate;
        return (encrypData, expiryDate, issueDate);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred."
        );
    }

    // The following functions are overrides required by Solidity.
    // the onlyRole DEFAULT_ADMIN_ROLE burn token
    function removeToken(uint256 _tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        delete citizens[_tokenId];
        delete tokenOwner[msg.sender];
        _revokeRole(CITIZEN_ROLE, ownerOf(_tokenId));
        _burn(_tokenId);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

   function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    modifier allowView(address _acount) {
        require(
            hasRole(SUB_OWNER_ROLE, _acount) ,
            "You already citizen role"
        );
        _;
    }
}
