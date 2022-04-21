const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access token", function () {
  let accessToken, owner, acct1;

  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();

    const AccessToken = await ethers.getContractFactory("AccessToken");
    accessToken = await AccessToken.deploy("https://ipfs.io/ipfs/123");

    await accessToken.deployed();
  });

  it("Fetch tokens", async function () {
    await accessToken.mint("foo", 10);
    expect((await accessToken.getTokens()).length).to.equal(1);

    await accessToken.mint("bar", 10);
    expect((await accessToken.getTokens()).length).to.equal(2);
  });

  it("Authentication", async function () {
    await accessToken.mint("foo", 10);

    await accessToken.safeTransferFrom(
      owner.address,
      account1.address,
      1,
      1,
      "0x00"
    );

    expect(await accessToken.authenticate(account1.address, "foo")).to.equal(
      true
    );
    expect(await accessToken.authenticate(account1.address, "bar")).to.equal(
      false
    );
    expect(await accessToken.authenticate(account1.address, "bar")).to.equal(
      false
    );
  });
});
