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
 * @category ProcessTransferShares
 * @category generated
 */
export type ProcessTransferSharesInstructionArgs = {
    shares: beet.bignum;
};
/**
 * @category Instructions
 * @category ProcessTransferShares
 * @category generated
 */
export declare const processTransferSharesStruct: beet.BeetArgsStruct<ProcessTransferSharesInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processTransferShares_ instruction
 *
 * @property [**signer**] authority
 * @property [] fromMember
 * @property [] toMember
 * @property [_writable_] fanout
 * @property [_writable_] fromMembershipAccount
 * @property [_writable_] toMembershipAccount
 * @category Instructions
 * @category ProcessTransferShares
 * @category generated
 */
export type ProcessTransferSharesInstructionAccounts = {
    authority: web3.PublicKey;
    fromMember: web3.PublicKey;
    toMember: web3.PublicKey;
    fanout: web3.PublicKey;
    fromMembershipAccount: web3.PublicKey;
    toMembershipAccount: web3.PublicKey;
};
export declare const processTransferSharesInstructionDiscriminator: number[];
/**
 * Creates a _ProcessTransferShares_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessTransferShares
 * @category generated
 */
export declare function createProcessTransferSharesInstruction(accounts: ProcessTransferSharesInstructionAccounts, args: ProcessTransferSharesInstructionArgs): web3.TransactionInstruction;
//# sourceMappingURL=processTransferShares.d.ts.map