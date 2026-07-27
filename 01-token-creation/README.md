## 01-token-creation
### For ERC-20 Tokens:
1. Using boilerplate code from OpenZeppelin, set constructor to reflect desired token settings, features, access controls, upgradeability options, and info.
2. Add code to Remix, compile and test.
3. Set Environment to Metamask Injected and Deploy Contract.
4. Verify in wallet or explorer.

### For ERC-721 (Non-Fungible) Tokens:
1. Create or choose the media files(s) you would like to turn into an NFT.
2. Give the file(s) ascending numbers as filenames and upload into an IPFS cloud service like pinata.cloud
3. Create .json files also with numerically ascending filenames, corresponding to each media file previously uploaded.
4. Fill in .json "attributes" (this can be automated at creation).
    - Point "image" attribute to the [decentalized]folderindex/filename as displayed in Pinata. This is also called the BaseURI. (e.g. "image": "https://gateway.pinata.cloud/ipfs/bafybeid7mnkdt5ja6x5scjaqr6vx2isiajpwhp2qrtb7midmcwod47cr7e/1.png")
4. Add to Remix, set environment to 'Metamask Injected' and Deploy Contract.
5. Verify in wallet, explorer, or marketplace.