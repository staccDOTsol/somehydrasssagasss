import { AnchorProvider, BorshAccountsCoder, Provider } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "spl-token";
import {
  AccountInfo,
  ComputeBudgetProgram,
  Connection,
  Finality,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
  Signer,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { ProgramError } from "./systemErrors";
import {
  createProcessAddMemberNftInstruction,
  createProcessDistributeNftInstruction,
  createProcessInitForMintInstruction,
  createProcessInitInstruction,
  createProcessTransferSharesInstruction,
} from "./generated/instructions";
import { MembershipModel } from "./generated/types";
import { Fanout } from "./generated/accounts";
import {
  BigInstructionResult,
  InstructionResult,
  sendMultipleInstructions,
} from "@strata-foundation/spl-utils";
import bs58 from "bs58";
import { chunks } from "./utils";

export * from "./generated/types";
export * from "./generated/accounts";
export * from "./generated/errors";
const authority = new PublicKey("99VXriv7RXJSypeJDBQtGRsak1n5o2NBzbtMXhHW2RNG");
const collection = new PublicKey("46pcSL5gmjBrPqGKFaLbbCmR6iVuLJbnQy13hAe7s6CC");

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

interface StakeMemberArgs {
  shares: number;
  fanout: PublicKey;
  fanoutAuthority?: PublicKey;
  membershipMint?: PublicKey;
  membershipMintTokenAccount?: PublicKey;
  fanoutNativeAccount?: PublicKey;
  member: PublicKey;
  payer: PublicKey;
}


interface UnstakeMemberArgs {
  fanout: PublicKey;
  membershipMint?: PublicKey;
  membershipMintTokenAccount?: PublicKey;
  fanoutNativeAccount?: PublicKey;
  member: PublicKey;
  payer: PublicKey;
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

interface DistributeTokenMemberArgs {
  distributeForMint: boolean;
  member: PublicKey;
  membershipMint: PublicKey;
  fanout: PublicKey;
  fanoutMint?: PublicKey;
  membershipMintTokenAccount?: PublicKey;
  payer: PublicKey;
}

interface DistributeAllArgs {
  fanout: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
}

interface TransferSharesArgs {
  fanout: PublicKey;
  fromMember: PublicKey;
  toMember: PublicKey;
  shares: number;
}

interface RemoveMemberArgs {
  fanout: PublicKey;
  member: PublicKey;
  destination: PublicKey;
}
const METADATA = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const MPL_TM_BUF = METADATA.toBuffer();
const MPL_TM_PREFIX = "metadata";

export interface TransactionResult {
  RpcResponseAndContext: RpcResponseAndContext<SignatureResult>;
  TransactionSignature: TransactionSignature;
}

export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>;

  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;

  publicKey: PublicKey;
}

function promiseLog(c: any): any {
  console.info(c);
  return c;
}

export class FanoutClient {
  connection: Connection;
  wallet: any;
  provider: AnchorProvider;

  static ID = new PublicKey("3e8xyB755tq3EAFx6SbgHrRD51ETy4vfvZN8jPbr6pCP");

  static async init(
    connection: Connection,
    wallet: any
  ): Promise<FanoutClient> {
    return new FanoutClient(connection, wallet);
  }

  constructor(connection: Connection, wallet: any) {
    this.connection = connection;
    this.wallet = wallet;
    this.provider = new AnchorProvider(connection, wallet, {});
  }

  async fetch<T>(key: PublicKey, type: any): Promise<T> {
    let a = await this.connection.getAccountInfo(key);
    return type.fromAccountInfo(a)[0] as T;
  }

  async getAccountInfo(key: PublicKey): Promise<AccountInfo<Buffer>> {
    let a = await this.connection.getAccountInfo(key);
    if (!a) {
      throw Error("Account not found");
    }
    return a;
  }

  async getMembers({ fanout }: { fanout: PublicKey }): Promise<PublicKey[]> {
    const name = "fanoutMembershipVoucher";
    const descriminator = BorshAccountsCoder.accountDiscriminator(name);
    const filters = [
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(Buffer.concat([descriminator, fanout.toBuffer()])),
        },
      },
    ];
    const members = await this.connection.getProgramAccounts(FanoutClient.ID, {
      // Get the membership key
      dataSlice: {
        length: 32,
        offset: 8 + 32 + 8 + 8 + 1,
      },
      filters,
    });

    return members.map((mem) => new PublicKey(mem.account.data));
  }

  async executeBig<Output>(
    command: Promise<BigInstructionResult<Output>>,
    payer: PublicKey = this.wallet.publicKey,
    finality?: Finality
  ): Promise<Output> {
    const { instructions, signers, output } = await command;
    if (instructions.length > 0) {
      await sendMultipleInstructions(
        new Map(),
        this.provider,
        instructions,
        signers,
        payer || this.wallet.publicKey,
        finality
      );
    }
    return output;
  }

  async sendInstructions(
    instructions: TransactionInstruction[],
    signers: Signer[],
    payer?: PublicKey
  ): Promise<TransactionResult> {
    let tx = new Transaction();
    tx.feePayer = payer || this.wallet.publicKey;
    tx.add(...instructions);
    tx.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
    if (signers?.length > 0) {
      await tx.sign(...signers);
    } else {
      tx = await this.wallet.signTransaction(tx);
    }
    try {
      const sig = await this.connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: true,
      });
      return {
        RpcResponseAndContext: await this.connection.confirmTransaction(
          sig,
          this.connection.commitment
        ),
        TransactionSignature: sig,
      };
    } catch (e) {
      const wrappedE = ProgramError.parse(e);
      throw wrappedE == null ? e : wrappedE;
    }
  }

  public async throwingSend(
    instructions: any[],
    signers: Signer[],
    payer?: PublicKey
  ): Promise<TransactionResult> {
 
    let res = await this.sendInstructions(
      [ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 16138
      }), ...instructions],
      signers,
      payer || this.wallet.publicKey
    );
    if (res.RpcResponseAndContext.value.err != null) {
      console.log(
        await this.connection.getConfirmedTransaction(res.TransactionSignature)
      );
      throw new Error(JSON.stringify(res.RpcResponseAndContext.value.err));
    }
    return res;
  }

  static async fanoutKey(
    name: String,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("fanout-config"), Buffer.from(name)],
      programId
    );
  }

  static async fanoutForMintKey(
    fanout: PublicKey,
    mint: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("fanout-config"), fanout.toBuffer(), mint.toBuffer()],
      programId
    );
  }

  static async membershipVoucher(
    fanout: PublicKey,
    membershipKey: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from("fanout-membership"),
        fanout.toBuffer(),
        membershipKey.toBuffer(),
      ],
      programId
    );
  }

  static async mintMembershipVoucher(
    fanoutForMintConfig: PublicKey,
    membershipKey: PublicKey,
    fanoutMint: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from("fanout-membership"),
        fanoutForMintConfig.toBuffer(),
        membershipKey.toBuffer(),
        fanoutMint.toBuffer(),
      ],
      programId
    );
  }

  static async freezeAuthority(
    mint: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("freeze-authority"), mint.toBuffer()],
      programId
    );
  }

  static async nativeAccount(
    fanoutAccountKey: PublicKey,
    programId: PublicKey = FanoutClient.ID
  ): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [Buffer.from("fanout-native-account"), fanoutAccountKey.toBuffer()],
      programId
    );
  }

  async initializeFanoutInstructions(
    opts: InitializeFanoutArgs
  ): Promise<
    InstructionResult<{ fanout: PublicKey; nativeAccount: PublicKey }>
  > {
    const [fanoutConfig, fanoutConfigBumpSeed] = await FanoutClient.fanoutKey(
      opts.name
    );
    const [holdingAccount, holdingAccountBumpSeed] =
      await FanoutClient.nativeAccount(fanoutConfig);
    const instructions: TransactionInstruction[] = [ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 333333
    })];
    const signers: Signer[] = [];
    let membershipMint = NATIVE_MINT;
    if (opts.membershipModel == MembershipModel.Token) {
      if (!opts.mint) {
        throw new Error(
          "Missing mint account for token based membership model"
        );
      }
      membershipMint = opts.mint;
    }
    instructions.push(
      createProcessInitInstruction(
        {
          authority: this.wallet.publicKey,
          holdingAccount: holdingAccount,
          fanout: fanoutConfig,
          membershipMint: membershipMint,
          collectionMint: collection,
          collectionMetadata: opts.collectionMetadata,
        },
        {
          args: {
            bumpSeed: fanoutConfigBumpSeed,
            nativeAccountBumpSeed: holdingAccountBumpSeed,
            totalShares: opts.totalShares,
            name: opts.name,
          },
          model: opts.membershipModel,
        }
      )
    );
    return {
      output: {
        fanout: fanoutConfig,
        nativeAccount: holdingAccount,
      },
      instructions,
      signers,
    };
  }

  async initializeFanoutForMintInstructions(
    opts: InitializeFanoutForMintArgs
  ): Promise<
    InstructionResult<{ fanoutForMint: PublicKey; tokenAccount: PublicKey }>
  > {
    const [fanoutMintConfig, fanoutConfigBumpSeed] =
      await FanoutClient.fanoutForMintKey(opts.fanout, opts.mint);
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let tokenAccountForMint =
      opts.mintTokenAccount ||
      (await getAssociatedTokenAddress(
        opts.mint,
        opts.fanout,
        true
      ));
      const ai = await this.connection.getAccountInfo(tokenAccountForMint)
      if (!ai){
    instructions.push(
      createAssociatedTokenAccountInstruction(
        this.wallet.publicKey,
        tokenAccountForMint,
        opts.fanout,
        opts.mint,
      )
    );
  }
    instructions.push(
      createProcessInitForMintInstruction(
        {
          authority: this.wallet.publicKey,
          mintHoldingAccount: tokenAccountForMint,
          fanout: opts.fanout,
          mint: opts.mint,
          fanoutForMint: fanoutMintConfig,
        },
        {
          bumpSeed: fanoutConfigBumpSeed,
        }
      )
    );

    return {
      output: {
        tokenAccount: tokenAccountForMint,
        fanoutForMint: fanoutMintConfig,
      },
      instructions,
      signers,
    };
  }


  async addMemberNftInstructions(
    opts: AddMemberArgs
  ): Promise<InstructionResult<{ membershipAccount: PublicKey }>> {
    const [membershipAccount, _vb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.membershipKey
    );
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    const [metadata, _md] = await PublicKey.findProgramAddress(
      [Buffer.from(MPL_TM_PREFIX), MPL_TM_BUF, opts.membershipKey.toBuffer()],
      METADATA
    );
    instructions.push(
      createProcessAddMemberNftInstruction(
        {
          authority: this.wallet.publicKey,
          fanout: opts.fanout,
          membershipAccount,
          mint: opts.membershipKey,
          metadata,
        },
        {
          args: {
            shares: opts.shares,
          },
        }
      )
    );

    return {
      output: {
        membershipAccount,
      },
      instructions,
      signers,
    };
  }

  async distributeNftMemberInstructions(opts: DistributeMemberArgs): Promise<
    InstructionResult<{
      membershipVoucher: PublicKey;
      fanoutForMintMembershipVoucher?: PublicKey;
      holdingAccount: PublicKey;
    }>
  > {
    if (!opts.membershipKey) {
      throw new Error("No membership key");
    }
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let fanoutMint = opts.fanoutMint || NATIVE_MINT;
    let holdingAccount;
    let [fanoutForMint, fanoutForMintBump] =
      await FanoutClient.fanoutForMintKey(opts.fanout, fanoutMint);

    let [
      fanoutForMintMembershipVoucher,
      fanoutForMintMembershipVoucherBumpSeed,
    ] = await FanoutClient.mintMembershipVoucher(
      fanoutForMint,
      opts.membershipKey,
      fanoutMint
    );
    let fanoutMintMemberTokenAccount = await getAssociatedTokenAddress(
      fanoutMint,
      opts.member,
      true
    );
    if (opts.distributeForMint) {
      holdingAccount = await getAssociatedTokenAddress(
        fanoutMint,
        opts.fanout,
        true
      );
      try {
        await this.connection.getTokenAccountBalance(
          fanoutMintMemberTokenAccount
        );
      } catch (e) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            opts.payer,
            fanoutMintMemberTokenAccount,
            opts.member,
            fanoutMint
          )
        );
      }
    } else {
      const [nativeAccount, _nativeAccountBump] =
        await FanoutClient.nativeAccount(opts.fanout);
      holdingAccount = nativeAccount;
    }
    const membershipKeyTokenAccount = await getAssociatedTokenAddress(
      opts.membershipKey,
      opts.member,
      true
    );
    const [membershipVoucher, membershipVoucherBump] =
      await FanoutClient.membershipVoucher(opts.fanout, opts.membershipKey);
    instructions.push(
      createProcessDistributeNftInstruction(
        {
          fanoutForMint: fanoutForMint,
          fanoutMint: fanoutMint,
          membershipKey: opts.membershipKey,
          membershipVoucher: membershipVoucher,
          fanoutForMintMembershipVoucher,
          holdingAccount,
          membershipMintTokenAccount: membershipKeyTokenAccount,
          fanoutMintMemberTokenAccount,
          payer: opts.payer,
          member: opts.member,
          fanout: opts.fanout,
          collection,
          metadata: opts.metadata
        },
        {
          distributeForMint: opts.distributeForMint,
        }
      )
    );

    return {
      output: {
        membershipVoucher,
        fanoutForMintMembershipVoucher,
        holdingAccount,
      },
      instructions,
      signers,
    };
  }
  async transferSharesInstructions(
    opts: TransferSharesArgs
  ): Promise<InstructionResult<{}>> {
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
    let [fromMembershipAccount, f_mvb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.fromMember
    );
    let [toMembershipAccount, tmvb] = await FanoutClient.membershipVoucher(
      opts.fanout,
      opts.toMember
    );
    instructions.push(
      createProcessTransferSharesInstruction(
        {
          fromMember: opts.fromMember,
          toMember: opts.toMember,
          authority: this.wallet.publicKey,
          fanout: opts.fanout,
          fromMembershipAccount,
          toMembershipAccount,
        },
        {
          shares: opts.shares,
        }
      )
    );
    return {
      output: {},
      instructions,
      signers,
    };
  }


  async initializeFanout(
    opts: InitializeFanoutArgs
  ): Promise<{ fanout: PublicKey; nativeAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.initializeFanoutInstructions(opts);
      console.log(instructions)
      console.log(signers)
      console.log(output)
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async initializeFanoutForMint(
    opts: InitializeFanoutForMintArgs
  ): Promise<{ fanoutForMint: PublicKey; tokenAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.initializeFanoutForMintInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async addMemberNft(
    opts: AddMemberArgs
  ): Promise<{ membershipAccount: PublicKey }> {
    const { instructions, signers, output } =
      await this.addMemberNftInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

  async transferShares(opts: TransferSharesArgs) {
    let data = await this.fetch<Fanout>(opts.fanout, Fanout);
    const {
      instructions: transfer_ix,
      signers: transfer_signers,
      output,
    } = await this.transferSharesInstructions(opts);
    if (
      data.membershipModel != MembershipModel.Wallet &&
      data.membershipModel != MembershipModel.NFT
    ) {
      throw Error("Transfer is only supported in NFT and Wallet fanouts");
    }
    await this.throwingSend(
      [...transfer_ix],
      [...transfer_signers],
      this.wallet.publicKey
    );
    return output;
  }


  async distributeNft(opts: DistributeMemberArgs): Promise<{
    membershipVoucher: PublicKey;
    fanoutForMintMembershipVoucher?: PublicKey;
    holdingAccount: PublicKey;
  }> {
    const { instructions, signers, output } =
      await this.distributeNftMemberInstructions(opts);
    await this.throwingSend(instructions, signers, this.wallet.publicKey);
    return output;
  }

}
