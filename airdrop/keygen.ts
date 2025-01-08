import { Keypair } from "@solana/web3.js";

//Generate a new keypair
let kp = Keypair.generate()

// Log the public key
console.log(`You've generated a new Solana wallet: ${kp.publicKey.toBase58()}`);

// Log the secret key
console.log(`[${kp.secretKey}]`);