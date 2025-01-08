import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq"; // Import IDL and types
import wallet from "./Turbin3-wallet.json"; // Wallet private key

// Load wallet keypair
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Establish a connection to the Solana Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Encode your GitHub username as a UTF-8 buffer
const github = Buffer.from("kunal-drall", "utf8");

// Create an Anchor provider using the connection and wallet
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed",
});

// Initialize the program with the IDL, program ID, and provider
const programId = new PublicKey("WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq");
const program : Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for the prereq account
const enrollmentSeeds = [
    Buffer.from("prereq"), // Seed "prereq"
    keypair.publicKey.toBuffer(), // Public key of the signer
];
const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(
    enrollmentSeeds,
    programId
);

// Submit the transaction to complete the Turbin3 prerequisites
(async () => {
    try {
        const txhash = await program.methods
            .complete(github) // Call the "complete" instruction
            .accounts({
                signer: keypair.publicKey, // Signer account
            })
            .signers([keypair]) // Sign the transaction
            .rpc();

        // Output the transaction hash
        console.log(
            `Success! View your transaction: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
        );
    } catch (e) {
        // Log any errors that occur
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
