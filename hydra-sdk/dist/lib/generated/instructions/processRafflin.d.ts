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
 * @category ProcessRafflin
 * @category generated
 */
export declare const processRafflinStruct: beet.BeetArgsStruct<{
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _processRafflin_ instruction
 *
 * @property [_writable_] fanout
 * @property [_writable_, **signer**] payer
 * @property [] switchboard
 * @property [] switchboardState
 * @property [] switchboardAttestationQueue
 * @property [_writable_] switchboardFunction
 * @property [_writable_, **signer**] switchboardRequest
 * @property [_writable_] switchboardRequestEscrow
 * @property [] switchboardMint
 * @property [] associatedTokenProgram
 * @category Instructions
 * @category ProcessRafflin
 * @category generated
 */
export type ProcessRafflinInstructionAccounts = {
    fanout: web3.PublicKey;
    payer: web3.PublicKey;
    switchboard: web3.PublicKey;
    switchboardState: web3.PublicKey;
    switchboardAttestationQueue: web3.PublicKey;
    switchboardFunction: web3.PublicKey;
    switchboardRequest: web3.PublicKey;
    switchboardRequestEscrow: web3.PublicKey;
    switchboardMint: web3.PublicKey;
    tokenProgram?: web3.PublicKey;
    associatedTokenProgram: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
export declare const processRafflinInstructionDiscriminator: number[];
/**
 * Creates a _ProcessRafflin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ProcessRafflin
 * @category generated
 */
export declare function createProcessRafflinInstruction(accounts: ProcessRafflinInstructionAccounts, programId?: web3.PublicKey): web3.TransactionInstruction;
//# sourceMappingURL=processRafflin.d.ts.map