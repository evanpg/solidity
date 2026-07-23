const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("RentAgreement", function () {

    let rentAgreement;
    let owner;
    let tenant;


    beforeEach(async function () {

        [owner, tenant] = await ethers.getSigners();

        const RentAgreement =
            await ethers.getContractFactory("RentAgreement");


        rentAgreement =
            await RentAgreement.deploy(
                owner.address,
                ethers.parseEther("1"),
                12
            );


        await rentAgreement.waitForDeployment();


        // Set tenant for every test
        await rentAgreement
            .connect(owner)
            .setTenant(tenant.address);

    });



    it("Should allow landlord to set the tenant", async function () {

        const setTenantAddress =
            await rentAgreement.tenant();

        expect(setTenantAddress)
            .to.equal(tenant.address);

    });



    it("Should allow tenant to pay rent, including penalties if late", async function () {

        const rentAmount =
            ethers.parseEther("1");


        const penaltyAmount =
            rentAmount * 10n / 100n;


        // Move time 8 days forward
        // Rent is due after 7 day grace period
        await ethers.provider.send(
            "evm_increaseTime",
            [8 * 24 * 60 * 60]
        );


        await ethers.provider.send(
            "evm_mine"
        );


        await rentAgreement
            .connect(tenant)
            .payRent({
                value: rentAmount + penaltyAmount
            });



        const rentPaidUntil =
            await rentAgreement.rentPaidUntil();


        const startTimestamp =
            await rentAgreement.startTimestamp();


        const expected =
            startTimestamp + 30n * 24n * 60n * 60n;


        expect(rentPaidUntil)
            .to.equal(expected);

    });





    it("Should allow landlord to withdraw rent", async function () {


        // Tenant pays rent first
        await rentAgreement
            .connect(tenant)
            .payRent({
                value: ethers.parseEther("1")
            });



        const contractBalance =
            await ethers.provider.getBalance(
                await rentAgreement.getAddress()
            );


        expect(contractBalance)
            .to.equal(ethers.parseEther("1"));



        const landlordBefore =
            await ethers.provider.getBalance(
                owner.address
            );



        const tx =
            await rentAgreement
                .connect(owner)
                .withdrawRent();


        const receipt =
            await tx.wait();



        const gasCost =
            receipt.gasUsed *
            receipt.gasPrice;



        const landlordAfter =
            await ethers.provider.getBalance(
                owner.address
            );


        expect(
            landlordAfter + gasCost
        )
        .to.equal(
            landlordBefore + ethers.parseEther("1")
        );


    });







    it("Should handle termination request and approvals correctly", async function () {


        // Contract needs balance before termination
        await rentAgreement
            .connect(tenant)
            .payRent({
                value: ethers.parseEther("1")
            });



        await rentAgreement
            .connect(tenant)
            .requestTermination();



        const isTerminationRequested =
            await rentAgreement.terminationRequested();


        expect(isTerminationRequested)
            .to.equal(true);




        await rentAgreement
            .connect(owner)
            .approveTermination();



        const isTerminated =
            await rentAgreement.isTerminated();



        expect(isTerminated)
            .to.equal(true);


    });


});