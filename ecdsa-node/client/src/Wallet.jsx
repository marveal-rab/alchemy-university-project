import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils"
import { keccak256 } from 'ethereum-cryptography/keccak'

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const pk = evt.target.value
    setPrivateKey(pk)
    const publicKey = secp256k1.getPublicKey(pk)
    const address = `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`
    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an Private Key" value={privateKey} onChange={onChange}></input>
      </label>
      <div className="address">address: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
