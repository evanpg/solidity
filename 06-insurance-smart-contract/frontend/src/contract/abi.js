const ABI = [
  "function insurer() view returns (address)",
  "function policyCounter() view returns (uint256)",
  "function policies(uint256) view returns (address policyHolder, uint256 premium, uint256 coverageAmount, bool isClaimed, bool isClaimApproved, bool premiumPaid, bool payoutDone)",
  "function createPolicy(address _policyHolder, uint256 _premium, uint256 _coverageAmount)",
  "function payPremium(uint256 _policyId) payable",
  "function submitClaim(uint256 _policyId)",
  "function approveClaim(uint256 _policyId)",
  "function claimPayout(uint256 _policyId)",
  "function policyDetails(uint256 _policyId) view returns (tuple(address policyHolder, uint256 premium, uint256 coverageAmount, bool isClaimed, bool isClaimApproved, bool premiumPaid, bool payoutDone))",
];

const STORAGE_KEY = "insurance.contractAddress";

const el = {
  connectBtn: document.getElementById("connectBtn"),
  loadContractBtn: document.getElementById("loadContractBtn"),
  contractAddress: document.getElementById("contractAddress"),
  setupStatus: document.getElementById("setupStatus"),
  networkLabel: document.getElementById("networkLabel"),
  accountDisplay: document.getElementById("accountDisplay"),
  insurerDisplay: document.getElementById("insurerDisplay"),
  policyCountDisplay: document.getElementById("policyCountDisplay"),
  balanceDisplay: document.getElementById("balanceDisplay"),
  roleDisplay: document.getElementById("roleDisplay"),
  txStatus: document.getElementById("txStatus"),
  refreshBtn: document.getElementById("refreshBtn"),
  policyDetails: document.getElementById("policyDetails"),
  dHolder: document.getElementById("dHolder"),
  dPremium: document.getElementById("dPremium"),
  dCoverage: document.getElementById("dCoverage"),
  dPremiumPaid: document.getElementById("dPremiumPaid"),
  dClaimed: document.getElementById("dClaimed"),
  dApproved: document.getElementById("dApproved"),
  dPayout: document.getElementById("dPayout"),
};

let provider = null;
let signer = null;
let account = null;
let contract = null;
let insurer = null;

function shortAddr(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function setStatus(target, message, kind = "") {
  target.textContent = message || "";
  target.classList.remove("ok", "err", "warn");
  if (kind) target.classList.add(kind);
}

function parseRevert(err) {
  return (
    err?.reason ||
    err?.shortMessage ||
    err?.data?.message ||
    err?.message ||
    "Transaction failed"
  );
}

function requireWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask (or another EIP-1193 wallet) is required.");
  }
}

function requireContract() {
  if (!contract || !signer) {
    throw new Error("Connect your wallet and load a contract address first.");
  }
}

async function connectWallet() {
  requireWallet();
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  account = await signer.getAddress();

  const network = await provider.getNetwork();
  el.networkLabel.textContent = `${network.name} (${network.chainId})`;
  el.accountDisplay.textContent = account;
  el.connectBtn.textContent = "Connected";

  if (contract) {
    contract = new ethers.Contract(await contract.getAddress(), ABI, signer);
    await refreshOverview();
  }

  setStatus(el.txStatus, `Wallet connected: ${shortAddr(account)}`, "ok");
}

async function loadContract() {
  requireWallet();
  if (!provider || !signer) {
    await connectWallet();
  }

  const address = el.contractAddress.value.trim();
  if (!ethers.isAddress(address)) {
    setStatus(el.setupStatus, "Enter a valid contract address.", "err");
    return;
  }

  contract = new ethers.Contract(address, ABI, signer);
  localStorage.setItem(STORAGE_KEY, address);

  try {
    await refreshOverview();
    setStatus(el.setupStatus, `Loaded ${shortAddr(address)}`, "ok");
  } catch (err) {
    contract = null;
    setStatus(el.setupStatus, parseRevert(err), "err");
  }
}

async function refreshOverview() {
  requireContract();

  insurer = await contract.insurer();
  const count = await contract.policyCounter();
  const balance = await provider.getBalance(await contract.getAddress());

  el.insurerDisplay.textContent = insurer;
  el.policyCountDisplay.textContent = count.toString();
  el.balanceDisplay.textContent = `${ethers.formatEther(balance)} ETH`;

  const isInsurer = account.toLowerCase() === insurer.toLowerCase();
  el.roleDisplay.textContent = isInsurer ? "Insurer" : "Policy holder / other";

  document.querySelectorAll(".panel[data-role]").forEach((panel) => {
    const role = panel.getAttribute("data-role");
    panel.dataset.dimmed = String(
      (role === "insurer" && !isInsurer) || (role === "holder" && isInsurer)
    );
  });
}

async function withTx(label, action) {
  try {
    requireContract();
    setStatus(el.txStatus, `${label}… waiting for wallet confirmation`, "warn");
    const tx = await action();
    setStatus(el.txStatus, `${label}… confirming ${shortAddr(tx.hash)}`, "warn");
    await tx.wait();
    await refreshOverview();
    setStatus(el.txStatus, `${label} confirmed (${shortAddr(tx.hash)})`, "ok");
  } catch (err) {
    setStatus(el.txStatus, parseRevert(err), "err");
  }
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

async function showPolicyDetails(policyId) {
  requireContract();
  const p = await contract.policyDetails(policyId);

  if (p.policyHolder === ethers.ZeroAddress) {
    el.policyDetails.hidden = true;
    setStatus(el.txStatus, `No policy found for ID ${policyId}.`, "warn");
    return;
  }

  el.dHolder.textContent = p.policyHolder;
  el.dPremium.textContent = `${ethers.formatEther(p.premium)} ETH`;
  el.dCoverage.textContent = `${ethers.formatEther(p.coverageAmount)} ETH`;
  el.dPremiumPaid.textContent = yesNo(p.premiumPaid);
  el.dClaimed.textContent = yesNo(p.isClaimed);
  el.dApproved.textContent = yesNo(p.isClaimApproved);
  el.dPayout.textContent = yesNo(p.payoutDone);
  el.policyDetails.hidden = false;
  setStatus(el.txStatus, `Loaded policy #${policyId}`, "ok");
}

el.connectBtn.addEventListener("click", async () => {
  try {
    await connectWallet();
  } catch (err) {
    setStatus(el.txStatus, parseRevert(err), "err");
  }
});

el.loadContractBtn.addEventListener("click", () => {
  loadContract();
});

el.refreshBtn.addEventListener("click", async () => {
  try {
    await refreshOverview();
    setStatus(el.txStatus, "Overview refreshed.", "ok");
  } catch (err) {
    setStatus(el.txStatus, parseRevert(err), "err");
  }
});

document.getElementById("createPolicyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const holder = document.getElementById("policyHolder").value.trim();
  const premium = ethers.parseEther(document.getElementById("premium").value);
  const coverage = ethers.parseEther(document.getElementById("coverageAmount").value);

  await withTx("Create policy", () =>
    contract.createPolicy(holder, premium, coverage)
  );
});

document.getElementById("payPremiumForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const policyId = BigInt(document.getElementById("payPolicyId").value);
  await withTx("Pay premium", async () => {
    const policy = await contract.policies(policyId);
    return contract.payPremium(policyId, { value: policy.premium });
  });
});

document.getElementById("submitClaimForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const policyId = BigInt(document.getElementById("claimPolicyId").value);
  await withTx("Submit claim", () => contract.submitClaim(policyId));
});

document.getElementById("approveClaimForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const policyId = BigInt(document.getElementById("approvePolicyId").value);
  await withTx("Approve claim", () => contract.approveClaim(policyId));
});

document.getElementById("claimPayoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const policyId = BigInt(document.getElementById("payoutPolicyId").value);
  await withTx("Claim payout", () => contract.claimPayout(policyId));
});

document.getElementById("lookupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const policyId = BigInt(document.getElementById("lookupPolicyId").value);
    await showPolicyDetails(policyId);
  } catch (err) {
    setStatus(el.txStatus, parseRevert(err), "err");
  }
});

if (window.ethereum) {
  window.ethereum.on("accountsChanged", async (accounts) => {
    if (!accounts.length) {
      account = null;
      signer = null;
      el.accountDisplay.textContent = "—";
      el.roleDisplay.textContent = "—";
      el.connectBtn.textContent = "Connect Wallet";
      setStatus(el.txStatus, "Wallet disconnected.", "warn");
      return;
    }
    try {
      await connectWallet();
    } catch (err) {
      setStatus(el.txStatus, parseRevert(err), "err");
    }
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  el.contractAddress.value = saved;
}
