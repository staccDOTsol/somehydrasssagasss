import {
  PaymentMintConfig,
  paymentMintConfig,
} from './../config/paymentMintConfig'
import { useFanoutId } from '../hooks/useFanoutId'
import * as hydra from '../hydra-sdk/src'
import { BorshAccountsCoder, utils } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { useDataHook } from './useDataHook'
import { FanoutMint } from '../hydra-sdk/src'
import * as splToken from '@solana/spl-token'
import { shortPubKey } from '../common/utils'
import { useConnection } from '@solana/wallet-adapter-react'
// @ts-ignore
import { getMint } from '@solana/spl-token'

export const HYDRA_PROGRAM_ID = new PublicKey(
  '3e8xyB755tq3EAFx6SbgHrRD51ETy4vfvZN8jPbr6pCP'
)

export type FanoutMintData = {
  id: PublicKey
  data: FanoutMint
  balance: number
  info: splToken.MintInfo
  config: PaymentMintConfig
}

export const useFanoutMints = () => {
  const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=0d4b4fd6-c2fc-4f55-b615-a23bab1ffc85")
  const fanoutId = new PublicKey("9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag")

  return useDataHook<FanoutMintData[]>(
    async () => {
      console.log(123123)
      const programAccounts = await connection.getProgramAccounts(
        HYDRA_PROGRAM_ID,
        {
          filters: [
            
            {
              memcmp: {
                offset: 40,
                bytes: fanoutId.toBase58(),
              },
            },
          ],
        }
      )
      console.log('wtf')
      console.log(programAccounts)
      const fanoutMints = await Promise.all(
        programAccounts.map(async (account) => {
          const fanoutMintData = hydra.FanoutMint.fromAccountInfo(
            account.account
          )[0]
          const mintAddress = fanoutMintData.mint
          return {
            id: account.pubkey,
            data: fanoutMintData,
            balance: parseFloat(
              (
                await connection.getTokenAccountBalance(
                  fanoutMintData.tokenAccount
                )
              ).value.uiAmountString ?? '0'
            ),
            info: await getMint(connection, mintAddress),
            config: paymentMintConfig[fanoutMintData.mint.toString()] ?? {
              name: shortPubKey(mintAddress),
              symbol: shortPubKey(mintAddress),
            },
          }

        })
      )
      console.log(fanoutMints)
      return fanoutMints
    },
    [fanoutId?.toString()],
    { name: 'useFanoutMints' }
  )
}
