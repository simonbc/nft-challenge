//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessToken is ERC1155, ERC1155Holder, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;
    string public baseUri;

    struct Token {
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        string slug;
        string ipfsHash;
    }

    Token[] private _tokens;

    mapping(string => uint256) private _slugToId;
    mapping(uint256 => Token) private _idToToken;

    constructor(string memory _baseUri) ERC1155(_baseUri) {
        baseUri = _baseUri;
    }

    function mint(
        string memory slug,
        uint256 amount,
        uint256 price,
        string memory ipfsHash
    ) external onlyOwner {
        require(_slugToId[slug] == 0, "Slug already taken");

        _tokenId.increment();
        uint256 tokenId = _tokenId.current();
        Token memory token = Token(tokenId, amount, price, slug, ipfsHash);

        _slugToId[slug] = tokenId;
        _tokens.push(token);
        _idToToken[tokenId] = token;

        _mint(msg.sender, tokenId, amount, "0x00");

        _safeTransferFrom(msg.sender, address(this), tokenId, amount, "0x00");
    }

    function purchase(uint256 tokenId) external payable {
        Token memory token = _idToToken[tokenId];

        require(msg.value >= token.price, "Not enough ETH for transaction");

        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "0x00");
    }

    function authenticate(address account, string memory slug)
        external
        view
        returns (bool)
    {
        uint256 tokenId = _slugToId[slug];
        return balanceOf(account, tokenId) > 0;
    }

    function getTokens() external view returns (Token[] memory) {
        return _tokens;
    }

    function getPurchasedTokens() external view returns (Token[] memory) {
        uint256 totalTokenCount = _tokenId.current();
        uint256 userTokenCount = 0;

        for (uint256 i = 1; i <= totalTokenCount; i++) {
            if (balanceOf(msg.sender, i) > 0) {
                userTokenCount++;
            }
        }

        uint256 currentIndex = 0;
        Token[] memory tokens = new Token[](userTokenCount);
        for (uint256 i = 1; i <= totalTokenCount; i++) {
            if (balanceOf(msg.sender, i) > 0) {
                tokens[currentIndex] = _idToToken[i];
                currentIndex++;
            }
        }
        return tokens;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        Token memory token = _idToToken[tokenId];
        return string(abi.encodePacked(baseUri, token.ipfsHash));
    }
}
