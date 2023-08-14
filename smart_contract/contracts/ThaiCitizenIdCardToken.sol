// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ThaiCitizenIdCardToken is ERC721, ERC721URIStorage, Pausable, AccessControl, ERC721Burnable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    bytes32 public constant SUB_OWNER_ROLE = keccak256("SUB_OWNER_ROLE");
    bytes32 public constant CITIZEN_ROLE = keccak256("CITIZEN_ROLE");

    struct Citizen {
        bytes32 citizenIdHash;
        bytes32 fullNameHash;
        bytes32 ageHash;
        bytes32 genderHash;
        string issueDate;
        string expiryDate;
    }
    // Mapping to store secure attributes for each tokenId
    mapping(uint256 => Citizen) public citizens;

    constructor() ERC721("Thai Citizen ID Card", "TDIC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SUB_OWNER_ROLE, msg.sender);
    }

    modifier newRoleCitizen(){
        require(
            !hasRole(CITIZEN_ROLE, msg.sender),
            "You already citizen role"
        );
        _;
    }

    modifier onlyAllowedRoles(uint256 _tokenId) {
        require(
            hasRole(SUB_OWNER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender)||  ownerOf(_tokenId) == msg.sender,
            "Only allowed roles can access this"
        );
        _;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function safeMint(address to,
        bytes32 _citizenIdHash,
        bytes32 _fullNameHash,
        bytes32 _ageHash,
        bytes32 _genderHash,
        string memory _issueDate,
        string memory _expiryDate,
        string memory uri) public newRoleCitizen(){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        // Store the secure attributes
        citizens[tokenId] = Citizen(
            _citizenIdHash,
            _fullNameHash,
            _ageHash,
            _genderHash,
            _issueDate,
            _expiryDate
        );
        _grantRole(CITIZEN_ROLE, msg.sender);
    }

    function updateMetadataURI(uint256 _tokenId,
        bytes32 _citizenIdHash,
        bytes32 _fullNameHash,
        bytes32 _ageHash,
        bytes32 _genderHash,
        string memory _issueDate,
        string memory _expiryDate, string memory newMetadataURI)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenNotPaused
    {
        // Store the secure attributes
        citizens[_tokenId] = Citizen(
            _citizenIdHash,
            _fullNameHash,
            _ageHash,
            _genderHash,
            _issueDate,
            _expiryDate
        );
        _setTokenURI(_tokenId, newMetadataURI);
    }

     // Function to retrieve secure attributes for a tokenId
    function getCitizen(uint256 _tokenId)
        public
        view 
        onlyAllowedRoles(_tokenId) 
        returns (
            bytes32,
            bytes32,
            bytes32,
            bytes32,
            string memory,
            string memory
        )
    {
        Citizen memory citizen = citizens[_tokenId];
        return (
            citizen.citizenIdHash,
            citizen.fullNameHash,
            citizen.ageHash,
            citizen.genderHash,
            citizen.issueDate,
            citizen.expiryDate
        );
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }

    // The following functions are overrides required by Solidity.
    // the onlyRole DEFAULT_ADMIN_ROLE burn token
    function removeToken(uint256 _tokenId) public onlyRole(DEFAULT_ADMIN_ROLE){
        delete citizens[_tokenId];
        _revokeRole(CITIZEN_ROLE, ownerOf(_tokenId));
        _burn(_tokenId);
    }

    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

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
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}