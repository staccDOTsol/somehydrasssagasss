import { FanoutClient } from '../hydra-sdk/src'
import { firstParam } from '../common/utils'
import { useDataHook } from './useDataHook'
import { PublicKey } from '@solana/web3.js'

export const useFanoutId = () => {
  return {data: new PublicKey("9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag")}
}
