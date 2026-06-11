import { assert, expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Etiqueta do grupo de testes!", function () {
  let helloWorld: any;

  before(async () => {
    helloWorld = await ethers.deployContract("HelloWorld");
    console.log(
      "- Contrato HelloWorld implantado em:",
      await helloWorld.getAddress(),
    );
    console.log("- Dono do contrato:", await helloWorld.owner());
    console.log("- Mensagem inicial:", await helloWorld.message());
    console.log(
      "- Saldo do contrato:",
      await ethers.provider.getBalance(await helloWorld.getAddress()),
    );
    console.log(
      "- Número de transações do contrato:",
      await ethers.provider.getTransactionCount(await helloWorld.getAddress()),
    );
  });

  it("Should be Moises", async function () {
    // O owner pega a primeira conta disponível da lista e o otherAccount pega a segunda conta disponível da lista.
    const [owner, otherAccount] = await ethers.getSigners();

    const result = await helloWorld.message();

    expect(result).to.equal("Moises");
  });

  it("Should update message to Lidia", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    await helloWorld.connect(otherAccount).update("Lidia");
    const message = await helloWorld.message();

    expect(message).to.equal("Lidia");
  });

  it("Should not Finalize, Not the Owner", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(
      helloWorld.connect(otherAccount).finalize(),
    ).to.be.revertedWith("Not owner");
  });
  
  it("Should not Finalize, Wrong Message", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(helloWorld.connect(owner).finalize()).to.be.revertedWith(
      "Message must be 'finalize'",
    );
  });

  it("Should Finalize", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    await helloWorld.connect(otherAccount).update("finalize");
    console.log("Finalize by the " + otherAccount.address);

    await helloWorld.connect(owner).finalize();

    expect(await helloWorld.owner()).to.equal(
      "0x0000000000000000000000000000000000000000",
    );
  });

  it("Should NOT update message, contract finalized", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(
      helloWorld.connect(otherAccount).update("new message"),
    ).to.be.revertedWith("Owner is 0, the contract is already finalized.");
  });
});
