const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log("\n=== Available Accounts ===");
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    
    console.log(`Account ${i}: ${account.address}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log("---");
  }
});

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
  });

task("send-eth", "Sends ETH from one account to another")
  .addParam("to", "The recipient's address")
  .addParam("amount", "Amount to send in ETH")
  .addOptionalParam("from", "The sender's index (default: 0)")
  .setAction(async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const fromIndex = taskArgs.from ? parseInt(taskArgs.from) : 0;
    const sender = accounts[fromIndex];
    
    const tx = await sender.sendTransaction({
      to: taskArgs.to,
      value: hre.ethers.parseEther(taskArgs.amount)
    });
    
    console.log(`Sent ${taskArgs.amount} ETH from ${sender.address} to ${taskArgs.to}`);
    console.log(`Transaction hash: ${tx.hash}`);
    
    await tx.wait();
    console.log("Transaction confirmed");
  });