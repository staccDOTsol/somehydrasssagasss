/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export type ProcessDistributeNftInstructionArgs = {
  distributeForMint: boolean;
};
/**
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export const processDistributeNftStruct = new beet.BeetArgsStruct<
  ProcessDistributeNftInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['distributeForMint', beet.bool],
  ],
  'ProcessDistributeNftInstructionArgs',
);
/**
 * Accounts required by the _processDistributeNft_ instruction
 *
 * @property [**signer**] payer
 * @property [_writable_] member
 * @property [_writable_] membershipMintTokenAccount
 * @property [] membershipKey
 * @property [_writable_] membershipVoucher
 * @property [_writable_] fanout
 * @property [_writable_] holdingAccount
 * @property [_writable_] fanoutForMint
 * @property [_writable_] fanoutForMintMembershipVoucher
 * @property [] fanoutMint
 * @property [_writable_] fanoutMintMemberTokenAccount
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export type ProcessDistributeNftInstructionAccounts = {
  collection: web3.PublicKey;
  metadata: web3.PublicKey;
  payer: web3.PublicKey;
  member: web3.PublicKey;
  membershipMintTokenAccount: web3.PublicKey;
  membershipKey: web3.PublicKey;
  membershipVoucher: web3.PublicKey;
  fanout: web3.PublicKey;
  holdingAccount: web3.PublicKey;
  fanoutForMint: web3.PublicKey;
  fanoutForMintMembershipVoucher: web3.PublicKey;
  fanoutMint: web3.PublicKey;
  fanoutMintMemberTokenAccount: web3.PublicKey;
};

export const processDistributeNftInstructionDiscriminator = [108, 240, 68, 81, 144, 83, 58, 153];

/**
 * Creates a _ProcessDistributeNft_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessDistributeNft
 * @category generated
 */
export function createProcessDistributeNftInstruction(
  accounts: ProcessDistributeNftInstructionAccounts,
  args: ProcessDistributeNftInstructionArgs,
) {
  const {
    payer,
    member,
    membershipMintTokenAccount,
    membershipKey,
    membershipVoucher,
    fanout,
    holdingAccount,
    fanoutForMint,
    fanoutForMintMembershipVoucher,
    fanoutMint,
    fanoutMintMemberTokenAccount,
  } = accounts;

  const [data] = processDistributeNftStruct.serialize({
    instructionDiscriminator: processDistributeNftInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: member,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: membershipMintTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: membershipKey,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: membershipVoucher,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fanout,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: holdingAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fanoutForMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fanoutForMintMembershipVoucher,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fanoutMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: fanoutMintMemberTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collection,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.metadata,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('3e8xyB755tq3EAFx6SbgHrRD51ETy4vfvZN8jPbr6pCP'),
    keys,
    data,
  });
  return ix;
}
