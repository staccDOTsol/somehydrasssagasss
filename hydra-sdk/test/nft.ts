/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComputeBudgetProgram, Connection, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';

import {
  FanoutClient,
  MembershipModel,
} from '../src'
import fs from 'fs'
import { keypairIdentity, Metaplex, PublicKey } from '@metaplex-foundation/js';
import { AnchorProvider, Wallet } from '@project-serum/anchor';
const authority = new PublicKey("99VXriv7RXJSypeJDBQtGRsak1n5o2NBzbtMXhHW2RNG");
const collection = new PublicKey("46pcSL5gmjBrPqGKFaLbbCmR6iVuLJbnQy13hAe7s6CC");
const METADATA = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const MPL_TM_BUF = METADATA.toBuffer();
const MPL_TM_PREFIX = "metadata";
const [metadata, _] = PublicKey.findProgramAddressSync([Buffer.from(MPL_TM_PREFIX), MPL_TM_BUF, collection.toBuffer()], METADATA);

let nfts: [{earliest: number, id: String}] = JSON.parse(fs.readFileSync('test/nfts.json').toString())
  const connection = new Connection(process.env.ANCHOR_PROVIDER_URL as string, 'confirmed');
  let authorityWallet: Keypair = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(
       fs.readFileSync( process.env.ANCHOR_WALLET as string ).toString(),
      ),
    ),
  );
  let totalShares = 0
  for (var nft of nfts){
    totalShares+= nft.earliest
  }
  // shuffle nfts
  console.log(nfts[0])
   nfts = nfts.sort(() => Math.random() - 0.5);
   console.log(nfts[0])
  console.log(totalShares)
  let fanoutSdk: FanoutClient;

  const provider = new AnchorProvider(connection, new Wallet(authorityWallet), {})
  // @ts-ignore
    fanoutSdk = new FanoutClient(connection, new Wallet(authorityWallet));
    async function createFanout() {
   /*     const {instructions, signers: sss} = await fanoutSdk.initializeFanoutInstructions({
          totalShares,
          name: `Saga Genesis Hydra`,
          membershipModel: MembershipModel.NFT,
          defaultWeight: 138,
          collectionMetadata: metadata,

        });*/
        const fanout = new PublicKey("9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag")/*
        const tx = new Transaction().add(...instructions)
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
        tx.feePayer = authorityWallet.publicKey
        await provider.sendAndConfirm(tx, sss)*/
        let signers: any[] = []
        let newmembers: any = []
        let ixs: any = [ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 666420})]
          
        for (var i in nfts){
       let nft = new PublicKey(nfts[i].id)
       // @ts-ignore
          let shares = nfts[i].earliest
          try {


let blarg = await fanoutSdk.addMemberNftInstructions({
    fanout: fanout,
    shares,
    membershipKey: nft
      })  

          if (blarg.instructions.length == 0) {
        continue
      }

  ixs.push(
    ...blarg.instructions,
    )
    signers.push(...blarg.signers)
  }
 catch (err){
  console.log(err)
 }
        if (ixs.length > 3) {
          try {
         
          let tx = new Transaction().add(...ixs)
          tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
          tx.feePayer = authorityWallet.publicKey
          /// you may want to await this if your rpc isn't nice
          provider.sendAndConfirm(tx, signers)
          } catch (err){
            console.log(i)
console.log(err)
          }
ixs = [ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 666420})]
  signers =   []

      }
    }
        try {
         
          console.log('sending batch')
          let tx = new Transaction().add(...ixs)
          tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash
          tx.feePayer = authorityWallet.publicKey
          provider.sendAndConfirm(tx, signers)
          } catch (err){
console.log(err)
          }
      }
      createFanout()