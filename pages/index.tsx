import { AppBar, Stack, TextField, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';

import AccountInfo from '../components/AccountInfo';
import DisconnectButton from '../components/DisconnectButton';
import FundAccountButton from '../components/FundAccountButton';
import type { NextPage } from 'next';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { ToastProvider } from '../components/ToastProvider';
import { PublicKey } from '@solana/web3.js';
import { useFanoutData } from '../hooks/useFanoutData';

const Offset = styled('div')(
    // @ts-ignore
    ({ theme }) => theme.mixins.toolbar,
);

const ConnectButtonDynamic = dynamic(() => import('../components/ConnectButton'), { ssr: false });

const Home: NextPage = () => {
    const wallet = useWallet();
    const publicKey = new PublicKey("9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag")
    const [memoText, setMemoText] = useState('');
    return (
        <>
        <ToastProvider>
           
            <Offset />
            {wallet.publicKey ? (
                <div>
                        <DisconnectButton color='inherit' variant='outlined' />
                        <AccountInfo mySelectedAccount={{
                            address: publicKey.toString(),
                            label: 'Saga Hydra',
                            publicKey,
                        }} /></div>
                    ) : (
                        <ConnectButtonDynamic color="inherit" variant="outlined">
                            Connect
                        </ConnectButtonDynamic>
                    )}
      </ToastProvider>
        </>
    );
};

export default Home;
