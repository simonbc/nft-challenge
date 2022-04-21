const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access token", function () {
  let accessToken, owner, acct1;

  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();

    const AccessToken = await ethers.getContractFactory("AccessToken");
    accessToken = await AccessToken.deploy("https://ipfs.io/ipfs/");

    await accessToken.deployed();
  });

  it("Fetch tokens", async function () {
    await accessToken.mint("foo", 10, 1, "123");
    expect((await accessToken.getTokens()).length).to.equal(1);

    await accessToken.mint("bar", 10, 1, "123");
    expect((await accessToken.getTokens()).length).to.equal(2);
  });

  it("Authentication", async function () {
    await accessToken.mint("foo", 10, 1, "123");

    await accessToken.connect(account1).purchase(1, { value: 1 });

    expect(await accessToken.authenticate(owner.address, "foo")).to.equal(
      false
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
