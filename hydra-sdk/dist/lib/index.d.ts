/// <reference types="node" />
/// <reference types="node" />
import { AnchorProvider } from "@project-serum/anchor";
import { AccountInfo, Connection, Finality, PublicKey, RpcResponseAndContext, SignatureResult, Signer, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { MembershipModel } from "./generated/types";
import { BigInstructionResult, InstructionResult } from "@strata-foundation/spl-utils";
export * from "./generated/types";
export * from "./generated/accounts";
export * from "./generated/errors";
interface InitializeFanoutArgs {
    name: string;
    membershipModel: MembershipModel;
    totalShares: number;
    defaultWeight: number;
    collectionMetadata: PublicKey;
    mint?: PublicKey;
}
interface InitializeFanoutForMintArgs {
    fanout: PublicKey;
    mint: PublicKey;
    mintTokenAccount?: PublicKey;
}
interface AddMemberArgs {
    shares: number;
    fanout: PublicKey;
    fanoutNativeAccount?: PublicKey;
    membershipKey: PublicKey;
}
interface DistributeMemberArgs {
    distributeForMint: boolean;
    member: PublicKey;
    membershipKey?: PublicKey;
    fanout: PublicKey;
    fanoutMint?: PublicKey;
    metadata: PublicKey;
    payer: PublicKey;
}
interface TransferSharesArgs {
    fanout: PublicKey;
    fromMember: PublicKey;
    toMember: PublicKey;
    shares: number;
}
export interface TransactionResult {
    RpcResponseAndContext: RpcResponseAndContext<SignatureResult>;
    TransactionSignature: TransactionSignature;
}
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
export declare class FanoutClient {
    connection: Connection;
    wallet: any;
    provider: AnchorProvider;
    static ID: PublicKey;
    static init(connection: Connection, wallet: any): Promise<FanoutClient>;
    constructor(connection: Connection, wallet: any);
    fetch<T>(key: PublicKey, type: any): Promise<T>;
    getAccountInfo(key: PublicKey): Promise<AccountInfo<Buffer>>;
    getMembers({ fanout }: {
        fanout: PublicKey;
    }): Promise<PublicKey[]>;
    executeBig<Output>(command: Promise<BigInstructionResult<Output>>, payer?: PublicKey, finality?: Finality): Promise<Output>;
    sendInstructions(instructions: TransactionInstruction[], signers: Signer[], payer?: PublicKey): Promise<TransactionResult>;
    throwingSend(instructions: any[], signers: Signer[], payer?: PublicKey): Promise<TransactionResult>;
    static fanoutKey(name: String, programId?: PublicKey): Promise<[PublicKey, number]>;
    static fanoutForMintKey(fanout: PublicKey, mint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static membershipVoucher(fanout: PublicKey, membershipKey: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static mintMembershipVoucher(fanoutForMintConfig: PublicKey, membershipKey: PublicKey, fanoutMint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static freezeAuthority(mint: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    static nativeAccount(fanoutAccountKey: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
    initializeFanoutInstructions(opts: InitializeFanoutArgs): Promise<InstructionResult<{
        fanout: PublicKey;
        nativeAccount: PublicKey;
    }>>;
    initializeFanoutForMintInstructions(opts: InitializeFanoutForMintArgs): Promise<InstructionResult<{
        fanoutForMint: PublicKey;
        tokenAccount: PublicKey;
    }>>;
    addMemberNftInstructions(opts: AddMemberArgs): Promise<InstructionResult<{
        membershipAccount: PublicKey;
    }>>;
    distributeNftMemberInstructions(opts: DistributeMemberArgs): Promise<InstructionResult<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>>;
    transferSharesInstructions(opts: TransferSharesArgs): Promise<InstructionResult<{}>>;
    initializeFanout(opts: InitializeFanoutArgs): Promise<{
        fanout: PublicKey;
        nativeAccount: PublicKey;
    }>;
    initializeFanoutForMint(opts: InitializeFanoutForMintArgs): Promise<{
        fanoutForMint: PublicKey;
        tokenAccount: PublicKey;
    }>;
    addMemberNft(opts: AddMemberArgs): Promise<{
        membershipAccount: PublicKey;
    }>;
    transferShares(opts: TransferSharesArgs): Promise<{}>;
    distributeNft(opts: DistributeMemberArgs): Promise<{
        membershipVoucher: PublicKey;
        fanoutForMintMembershipVoucher?: PublicKey;
        holdingAccount: PublicKey;
    }>;
}
//# sourceMappingURL=index.d.ts.map