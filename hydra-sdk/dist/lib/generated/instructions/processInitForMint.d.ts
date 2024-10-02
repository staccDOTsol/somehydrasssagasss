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
 * @category ProcessInitForMint
 * @category generated
 */
export type ProcessInitForMintInstructionArgs = {
    bumpSeed: number;
};
/**
 * @category Instructions
 * @category ProcessInitForMint
 * @category generated
 */
export declare const processInitForMintStruct: beet.BeetArgsStruct<ProcessInitForMintInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processInitForMint_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] fanout
 * @property [_writable_] fanoutForMint
 * @property [_writable_] mintHoldingAccount
 * @property [] mint
 * @category Instructions
 * @category ProcessInitForMint
 * @category generated
 */
export type ProcessInitForMintInstructionAccounts = {
    authority: web3.PublicKey;
    fanout: web3.PublicKey;
    fanoutForMint: web3.PublicKey;
    mintHoldingAccount: web3.PublicKey;
    mint: web3.PublicKey;
};
export declare const processInitForMintInstructionDiscriminator: number[];
/**
 * Creates a _ProcessInitForMint_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessInitForMint
 * @category generated
 */
export declare function createProcessInitForMintInstruction(accounts: ProcessInitForMintInstructionAccounts, args: ProcessInitForMintInstructionArgs): web3.TransactionInstruction;
//# sourceMappingURL=processInitForMint.d.ts.map