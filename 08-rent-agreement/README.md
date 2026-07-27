# RENT AGREEMENT CONTRACT USING HARDHAT

This contract allows a landlord to deploy a dynamic smart contract where rent payments and terminations can be managed.
1. The landlord assigns itself a payable entity and creates lease terms.
2. When a renter is found, the landlord calls the *setTenant* function with agreement terms.
3. The renter pays the rentAmount before the 30 days + 7 days grace period.
    - If payment is late there is a 10% fee that gets accumulated until it hits  the 50% maxPenaltyRate.
4. Once rent is paid and held in the contract, the landlord can execute *withdrawRent()*.
5. At any time, a party can request termination of contract agreement via *requestTermination()*. The termination is subject to approval by the other party.
6. Any balance locked in the contract when termination occurs is then divided equally between landlord and tenant.
NOTE: The addition od *noReentrant()* is a security upgrade that disables the function to be run in parallel with itself, essentially blocking an attacker trying to access locked funds a legitimate user accesses the contract function.


## The process was to: 
    1. start in remix
    2. put the .sol file into /contracts/ 
    3. add dependencies into package.json
    4. create tests
    5. start node
    6. deploy
    7. run scripts to interact and validate



### default commands
Try running some of the following tasks:

```shell
npm install ethers #already installed v6
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/rent-agreement.js
```
