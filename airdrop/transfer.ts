import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

// Import the wallet from the dev-wallet.json file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our Turbin3 public key
const to = new PublicKey("58Scew9jAQH6SS81qcWzgaU61AHD9uSAWgZmp3VBrnbY");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Step 1: Get the balance of the wallet
        const balance = await connection.getBalance(from.publicKey);
        console.log(`Current Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

        if (balance === 0) {
            console.error("Wallet has no funds to transfer.");
            return;
        }

        // Step 2: Create a mock transaction to estimate the fee
        const mockTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance, // Initially set to full balance
            })
        );

        mockTransaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
        mockTransaction.feePayer = from.publicKey;

        const fee = (await connection.getFeeForMessage(mockTransaction.compileMessage(), "confirmed")).value || 0;
        console.log(`Estimated Transaction Fee: ${fee} lamports`);

        // Step 3: Adjust the transaction amount to exclude the fee
        const lamportsToSend = balance - fee;

        if (lamportsToSend <= 0) {
            console.error("Not enough balance to cover the transaction fee.");
            return;
        }

        // Step 4: Create the final transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: lamportsToSend,
            })
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
        transaction.feePayer = from.publicKey;

        // Step 5: Sign and send the transaction
        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();