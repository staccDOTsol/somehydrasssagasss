/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
/**
 * @category Instructions
 * @category ProcessDistributeWallet
 * @category generated
 */
export type ProcessDistributeWalletInstructionArgs = {
    distributeForMint: boolean;
};
/**
 * @category Instructions
 * @category ProcessDistributeWallet
 * @category generated
 */
export declare const processDistributeWalletStruct: beet.BeetArgsStruct<ProcessDistributeWalletInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processDistributeWallet_ instruction
 *
 * @property [**signer**] payer
 * @property [_writable_] member
 * @property [_writable_] membershipVoucher
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] fanoutForMint
 * @property [_writable_] fanoutForMintMembershipVoucher
 * @property [] fanoutMint
 * @property [_writable_] fanoutMintMemberTokenAccount
 * @category Instructions
 * @category ProcessDistributeWallet
 * @category generated
 */
export type ProcessDistributeWalletInstructionAccounts = {
    payer: web3.PublicKey;
    member: web3.PublicKey;
    membershipVoucher: web3.PublicKey;
    fanout: web3.PublicKey;
    holdingAccount: web3.PublicKey;
    fanoutForMint: web3.PublicKey;
    fanoutForMintMembershipVoucher: web3.PublicKey;
    fanoutMint: web3.PublicKey;
    fanoutMintMemberTokenAccount: web3.PublicKey;
};
export declare const processDistributeWalletInstructionDiscriminator: number[];
/**
 * Creates a _ProcessDistributeWallet_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessDistributeWallet
 * @category generated
 */
export declare function createProcessDistributeWalletInstruction(accounts: ProcessDistributeWalletInstructionAccounts, args: ProcessDistributeWalletInstructionArgs): web3.TransactionInstruction;
//# sourceMappingURL=processDistributeWallet.d.ts.map