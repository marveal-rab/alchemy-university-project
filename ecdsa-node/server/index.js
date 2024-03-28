const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0x2a30f8c51fb19d2658d43b169828fcc4a2aa92c0": 100,
  "0x8a991c9a39742d216770de5da813fcb0472cadbe": 50,
  "0x56deb520fddfd9755e5b4ead1c47ed8dc0770d4c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, hashMessage } = req.body;
  const sig = secp256k1.Signature.fromCompact(signature).addRecoveryBit(0);
  const publicKey = toHex(sig.recoverPublicKey(hashMessage).toRawBytes());
  const isSigned = secp256k1.verify(signature, hashMessage, publicKey);
  if (!isSigned) {
    throw new Error("not signed");
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
