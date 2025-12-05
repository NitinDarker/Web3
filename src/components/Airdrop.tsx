import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export default function Airdrop() {
  const wallet = useWallet();
  const {connection} = useConnection();

  async function sendAirdrop() {
    await connection.requestAirdrop(wallet.publicKey!, 2000000000);
    alert('10 airdrop')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px', width: '400px', gap: '10px' }}>
      Hi Mr. {wallet.publicKey?.toString()}
      <input type="text" placeholder="Enter amount"></input>
      <button onClick={sendAirdrop}>Send Airdrop</button>
    </div>
  )
}
