import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("InsuranceModule", (m) => {

  const insurance = m.contract("Insurance");

  return { insurance };

});