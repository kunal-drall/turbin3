import bs58 from 'bs58';
import promptSync from 'prompt-sync';

// Initialize prompt-sync
const prompt = promptSync();

// Function to convert Base58 to Wallet Byte Array
function base58ToWallet() {
    const input = prompt('Enter your Base58 string: '); // Prompt user for Base58 string
    const wallet = bs58.decode(input); // Decode Base58 string to Uint8Array
    console.log('Wallet (Byte Array):', Array.from(wallet)); // Convert to regular array for display
}

// Function to convert Wallet Byte Array to Base58
function walletToBase58() {
    const wallet = [
        34, 46, 55, 124, 141, 190, 24, 204, 134, 91, 70, 184, 161, 181, 44, 122,
        15, 172, 163, 140, 255, 134, 144, 16, 144, 178, 108, 213, 158, 101, 185, 76
    ]; // Example wallet byte array
    const base58 = bs58.encode(Buffer.from(wallet)); // Encode byte array to Base58 string
    console.log('Base58 String:', base58); // Log the Base58 string
}

// Example Usage
// Uncomment the function you want to test
base58ToWallet();
// walletToBase58();
