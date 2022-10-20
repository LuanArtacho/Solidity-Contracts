// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LuanNFT is ERC721, AccessControl {

    // We can create as many roles as we want
    // We use keccak256 to create a hash that identifies this constant in the contract
    bytes32 public constant USER_ROLE = keccak256("USER"); // hash a USER as a role constant
    bytes32 public constant INTERN_ROLE = keccak256("INTERN"); // hash a INTERN as a role constant

    using Counters for Counters.Counter;

    Counters.Counter public tokenIds;

    constructor(string memory _name, string memory _symbol, address root ) ERC721(_name, _symbol) {
        // NOTE: Other DEFAULT_ADMIN's can remove other admins, give this role with great care
        _setupRole(DEFAULT_ADMIN_ROLE, root); // The creator of the contract is the default admin

        // SETUP role Hierarchy:
        // DEFAULT_ADMIN_ROLE > USER_ROLE > INTERN_ROLE > no role
        _setRoleAdmin(USER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(INTERN_ROLE, USER_ROLE);
    }

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to) public {
        tokenIds.increment();

        uint256 tokenIdToBe = tokenIds.current();
        require(hasRole(INTERN_ROLE, msg.sender), "Caller is not a minter");
        _mint(_to, tokenIdToBe);
    }

    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Create a bool check to see if a account address has the role admin
    function isAdmin(address account) public virtual view returns(bool)
    {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    // Create a modifier that can be used in other contract to make a pre-check
    // That makes sure that the sender of the transaction (msg.sender)  is a admin
    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Restricted to admins.");
        _;
    }

    // Add a user address as a admin
    function addAdmin(address account) public virtual onlyAdmin
    {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function burn(uint256 tokenId, address account) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, account), "Caller is not a burner");
        super._burn(tokenId);
        
    }

}
