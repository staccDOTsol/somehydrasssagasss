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
 * @category ProcessSetForTokenMemberStake
 * @category generated
 */
export type ProcessSetForTokenMemberStakeInstructionArgs = {
    shares: beet.bignum;
};
/**
 * @category Instructions
 * @category ProcessSetForTokenMemberStake
 * @category generated
 */
export declare const processSetForTokenMemberStakeStruct: beet.BeetArgsStruct<ProcessSetForTokenMemberStakeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processSetForTokenMemberStake_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] member
 * @property [_writable_] fanout
 * @property [_writable_] membershipVoucher
 * @property [_writable_] membershipMint
 * @property [_writable_] membershipMintTokenAccount
 * @property [_writable_] memberStakeAccount
 * @category Instructions
 * @category ProcessSetForTokenMemberStake
 * @category generated
 */
export type ProcessSetForTokenMemberStakeInstructionAccounts = {
    authority: web3.PublicKey;
    member: web3.PublicKey;
    fanout: web3.PublicKey;
    membershipVoucher: web3.PublicKey;
    membershipMint: web3.PublicKey;
    membershipMintTokenAccount: web3.PublicKey;
    memberStakeAccount: web3.PublicKey;
};
export declare const processSetForTokenMemberStakeInstructionDiscriminator: number[];
/**
 * Creates a _ProcessSetForTokenMemberStake_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessSetForTokenMemberStake
 * @category generated
 */
export declare function createProcessSetForTokenMemberStakeInstruction(accounts: ProcessSetForTokenMemberStakeInstructionAccounts, args: ProcessSetForTokenMemberStakeInstructionArgs): web3.TransactionInstruction;
//# sourceMappingURL=processSetForTokenMemberStake.d.ts.map