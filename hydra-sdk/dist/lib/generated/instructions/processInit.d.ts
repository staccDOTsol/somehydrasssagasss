/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { InitializeFanoutArgs } from '../types/InitializeFanoutArgs';
import { MembershipModel } from '../types/MembershipModel';
/**
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export type ProcessInitInstructionArgs = {
    args: InitializeFanoutArgs;
    model: MembershipModel;
};
/**
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export declare const processInitStruct: beet.FixableBeetArgsStruct<ProcessInitInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processInit_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] membershipMint
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export type ProcessInitInstructionAccounts = {
    authority: web3.PublicKey;
    fanout: web3.PublicKey;
    holdingAccount: web3.PublicKey;
    membershipMint: web3.PublicKey;
    collectionMint?: web3.PublicKey;
    collectionMetadata?: web3.PublicKey;
};
export declare const processInitInstructionDiscriminator: number[];
/**
 * Creates a _ProcessInit_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessInit
 * @category generated
 */
export declare function createProcessInitInstruction(accounts: ProcessInitInstructionAccounts, args: ProcessInitInstructionArgs): web3.TransactionInstruction;
//# sourceMappingURL=processInit.d.ts.map