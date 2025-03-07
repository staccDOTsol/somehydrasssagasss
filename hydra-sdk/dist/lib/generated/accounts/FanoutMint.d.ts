/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
/// <reference types="node" />
/// <reference types="node" />
import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
/**
 * Arguments used to create {@link FanoutMint}
 * @category Accounts
 * @category generated
 */
export type FanoutMintArgs = {
    mint: web3.PublicKey;
    fanout: web3.PublicKey;
    tokenAccount: web3.PublicKey;
    totalInflow: beet.bignum;
    lastSnapshotAmount: beet.bignum;
    bumpSeed: number;
};
/**
 * Holds the data for the {@link FanoutMint} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export declare class FanoutMint implements FanoutMintArgs {
    readonly mint: web3.PublicKey;
    readonly fanout: web3.PublicKey;
    readonly tokenAccount: web3.PublicKey;
    readonly totalInflow: beet.bignum;
    readonly lastSnapshotAmount: beet.bignum;
    readonly bumpSeed: number;
    private constructor();
    /**
     * Creates a {@link FanoutMint} instance from the provided args.
     */
    static fromArgs(args: FanoutMintArgs): FanoutMint;
    /**
     * Deserializes the {@link FanoutMint} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [FanoutMint, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link FanoutMint} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey): Promise<FanoutMint>;
    /**
     * Deserializes the {@link FanoutMint} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [FanoutMint, number];
    /**
     * Serializes the {@link FanoutMint} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link FanoutMint}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link FanoutMint} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link FanoutMint} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link FanoutMint} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        mint: string;
        fanout: string;
        tokenAccount: string;
        totalInflow: number | {
            toNumber: () => number;
        };
        lastSnapshotAmount: number | {
            toNumber: () => number;
        };
        bumpSeed: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
export declare const fanoutMintBeet: beet.BeetStruct<FanoutMint, FanoutMintArgs & {
    accountDiscriminator: number[];
}>;
//# sourceMappingURL=FanoutMint.d.ts.map