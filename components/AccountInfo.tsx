import { FanoutClient } from '../hydra-sdk/src'
// @ts-ignore
import { ComputeBudgetInstruction, ComputeBudgetProgram, Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { Select, MenuItem, FormControl, InputLabel, TextField, Toolbar, AppBar } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

import { Modal } from '@mui/material'
import {
  getMintNaturalAmountFromDecimal,
  pubKeyUrl,
  shortPubKey,
  tryPublicKey,
} from '../common/utils'
import Typography from '@mui/material/Typography';
import * as anchor from '@coral-xyz/anchor';
import { FanoutData, useFanoutData } from '../hooks/useFanoutData'
import { useFanoutMembershipMintVouchers } from '../hooks/useFanoutMembershipMintVouchers'
import { useFanoutMembershipVouchers } from '../hooks/useFanoutMembershipVouchers'
import { FanoutMintData, useFanoutMints } from '../hooks/useFanoutMints'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { useToast } from './ToastProvider'; // Adjust the import path
import React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';


import { useEffect, useState } from 'react'
import useAuthorization from '../utils/useAuthorization'
// @ts-ignore
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
// @ts-ignore
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Computer, Image } from '@mui/icons-material';
import { asWallet } from '../common/Wallets';

import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { styled } from '@mui/material/styles';

// Define colors and styles for the retro theme
const retroColors = {
  background: '#0b0c10',
  primary: '#00b3ff',
  secondary: '#ff0099',
  text: '#ffffff',
  hover: '#ff66aa',
  borderColor: '#ffffff',
  boxShadowColor: alpha('#00b3ff', 0.75),
};
const RetroSlider = styled(Slider)({
  '& .slick-prev:before': {
    color: retroColors.text,
  },
  '& .slick-next:before': {
    color: retroColors.text,
  },
  '& .slick-dots li button:before': {
    color: retroColors.text,
  },
  '& .slick-dots li.slick-active button:before': {
    color: retroColors.primary,
  },
});

// Custom styled Box that centers its children and adds padding
const CenteredBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: retroColors.background,
});

// Custom styled Box for main content area
const ContentBox = styled(Box)({
  width: '100%',
  maxWidth: '800px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
});

// AppBar customization
const RetroAppBar = styled(AppBar)({
  background: `linear-gradient(90deg, ${retroColors.primary} 0%, ${retroColors.secondary} 100%)`,
  boxShadow: `0 0 10px ${retroColors.boxShadowColor}`,
  marginTop: '48px',
  marginBottom: '16px',
});

// Typography customization
const RetroTypography = styled(Typography)({
  color: retroColors.text,
  textShadow: `0 0 10px ${retroColors.primary}`,
});

// FormControl customization
const RetroFormControl = styled(FormControl)({
  margin: '8px',
});

// InputLabel customization
const RetroInputLabel = styled(InputLabel)({
  color: retroColors.text,
});
const RetroSelect = styled(Select)({
  color: retroColors.text,
  '&:before': {
    borderColor: retroColors.borderColor,
  },
  '&:after': {
    borderColor: retroColors.primary,
  },
  '&:hover': {
    borderColor: retroColors.primary,
  },
});
// TextField customization
const RetroTextField = styled(TextField)({
  input: {
    color: retroColors.text,
  },
  '& label.Mui-focused': {
    color: retroColors.primary,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: retroColors.primary,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: retroColors.borderColor,
    },
    '&:hover fieldset': {
      borderColor: retroColors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: retroColors.primary,
    },
  },
});
// Continue the alpha import
import { alpha } from '@mui/material/styles';
import { Signer } from '@solana/web3.js';
// @ts-ignore
import { createTransferCheckedInstruction } from '@solana/spl-token';

// MenuItem customization
const RetroMenuItem = styled(MenuItem)({
  background: retroColors.background,
  color: retroColors.text,
  '&:hover': {
    backgroundColor: alpha(retroColors.primary, 0.25),
  },
});

// Modal customization
const RetroModal = styled(Modal)({
  '& .MuiRetroBackdrop-root': {
    backgroundColor: alpha(retroColors.background, 0.9),
  },
  '& .MuiBox-root': {
    backgroundColor: retroColors.background,
    borderColor: retroColors.borderColor,
    boxShadow: `0 0 15px ${retroColors.boxShadowColor}`,
  },
});

// Box customization for Modal content
const RetroBox = styled(Box)({
  border: `2px solid ${retroColors.borderColor}`,
  padding: '16px',
  backgroundColor: retroColors.background,
  color: retroColors.text,
});

// RetroBackdrop customization
const RetroBackdrop = styled(Backdrop)({
  color: retroColors.text,
  backgroundColor: alpha(retroColors.background, 0.85),
});

// Fade customization
const RetroFade = styled(Fade)({
  transitionDelay: '500ms', // Customize the delay as needed
});


// Toolbar customization
const RetroToolbar = styled(Toolbar)({
  background: retroColors.background,
  minHeight: '48px',
  margin: '64px 16px 16px 16px',
  '& .MuiTypography-root': {
    flex: 1,
    textAlign: 'center',
  },
});

// Apply custom styles to your MUI components using the `sx` prop or by wrapping them with styled components.

/**
 * Attempt to load our Switchboard Function from the .env file
 */
let func = new PublicKey("BXHY1pQcaqkhBxdjqpBrrbtirXaCuRJdXLSdqnYtDgsw")

type Props = Readonly<{
  mySelectedAccount: { address: string;
    label?: string | undefined;
    publicKey: PublicKey};
}>;

const LAMPORTS_PER_AIRDROP = 100000000;

function AccountInfo({mySelectedAccount}: Props) {
console.log(mySelectedAccount)
const wallet = useWallet();
  const {authorizeSession} = useAuthorization();
  const [mintId, setMintId] = useState<string>("default")
  const { showToast } = useToast();
  const connection = new Connection("https://rpc.ironforge.network/mainnet?apiKey=01HRZ9G6Z2A19FY8PR4RF4J4PW")

  const fanoutMembershipVouchers = useFanoutMembershipVouchers()
  const fanoutMints = useFanoutMints()
  const mintit = (itemValue) => {
    
    console.log(itemValue)
    setMintId(itemValue.target.value)
    setSelectedFanoutMint(
      mintId && assets
        ? assets.find(
            (asset) =>
              asset.token_info.symbol === mintId ||
              asset.id.toString() === mintId
          )
        : undefined)
        
    console.log(selectedFanoutMint)

  }
  const fanoutData = useFanoutData(mySelectedAccount)
  console.log(fanoutData)
  const provider = new AnchorProvider(connection, asWallet(wallet), {
    preflightCommitment: 'confirmed',
  });
  const fanoutMembershipMintVouchers = useFanoutMembershipMintVouchers(mintId)
  const [voucherMapping, setVoucherMapping] = useState<{
    [key: string]: string
  }>({})
  const [windowWidth, setWindowWidth] = useState(300); // Default width

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const anchor = "9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag"
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) =>
        fanoutMint.config.symbol === anchor ||
        fanoutMint.id.toString() === anchor
    )
  }, [

  ])
  const renderItem = ({item, index}) => {
    
    return (
      <ContentBox>

<ContentBox onClick={async () => {
    setItem(item);
    setModalVisible2(true);
}}>
        
        <ContentBox  >
      
        <RetroTypography >{item.token_info? item.token_info.symbol : item.id}</RetroTypography>
            <img 
            
                src={item.content.links.image ? item.content.links.image : /* placeholder image */ 'https://via.placeholder.com/150' }
                style={{ width: 130, height: 130 }}
            />
            {/* Add more item details here if necessary */}
            </ContentBox></ContentBox></ContentBox>
     
    );
};
const MyNfts = ({ myNftsVisible, nfts2 }) => {
    const settings = {
      dots: true, // Show dot indicators
      infinite: true, // Infinite looping
      speed: 500, // Animation speed
      slidesToShow: Math.floor(windowWidth / 300),

      slidesToScroll: 1, // Number of slides to scroll
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  
    if (!myNftsVisible) return null;
  
    return (
      <div style={{ width: '100%' }}>
        <RetroSlider {...settings} >
          {nfts2.map((item, index) => (
            <ContentBox key={index}>
              {renderItem({ item, index })}
            </ContentBox>
          ))}
        </RetroSlider>
      </div>
    );
  };
  
const nftsVisible = () => {
  setMyNftsVisible(true);
}
const assetsVisible = () => {
  setMyAssetsVisible(true);
}
const [myNftsVisible, setMyNftsVisible] = useState(false);
const [myAssetsVisible, setMyAssetsVisible] = useState(false);

const MyAssets = ({ myAssetsVisible, assets2 }) => {
  const settings = {
    dots: true, // Show dot indicators
    infinite: true, // Infinite looping
    speed: 500, // Animation speed
    slidesToShow: Math.floor(windowWidth / 300),

    slidesToScroll: 1, // Number of slides to scroll
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!myAssetsVisible) return null;

  return (
    <div style={{ width: '100%' }}>
      <RetroSlider {...settings} >
        {assets2.map((item, index) => (
          <ContentBox key={index}>
            {renderItem({ item, index })}
          </ContentBox>
        ))}
      </RetroSlider>
    </div>
  );
};
  const findMetadataAccount = (membershipKey: PublicKey) => {
    const md = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    return PublicKey.findProgramAddressSync([
      Buffer.from('metadata', 'utf8'),
      md.toBuffer(),
      membershipKey.toBuffer(),
  ], md);
  }

  const distributeShare = async (
    fanoutData: FanoutData,
    addAllMembers: boolean
  ) => {
      console.log(fanoutMints)
      console.log(mintId)
    let selectedFanoutMint 
    try {
      selectedFanoutMint = new PublicKey(mintId) 
    }
    catch (e){
      selectedFanoutMint = new PublicKey("So11111111111111111111111111111111111111112");
    }
        console.log(1)
        const fanoutSdk = new FanoutClient(connection, wallet);

        console.log(selectedFanoutMint)
        console.log(123)
        let collection, membershipKey 
        // await 1000 ms 
        console.log(nfts2)
        for (const nft of nfts2){
          for (const group of nft.grouping){
            console.log(group)
            if (group.group_key == "collection" && group.group_value == "46pcSL5gmjBrPqGKFaLbbCmR6iVuLJbnQy13hAe7s6CC"){
              membershipKey = new PublicKey(nft.id)
            }
          }
        }

        let distributeForMint = false; 
        let fanoutMint: undefined | PublicKey = undefined 
        if (selectedFanoutMint.toBase58() != "So11111111111111111111111111111111111111112"){
          distributeForMint = true;
          fanoutMint = selectedFanoutMint
        }
      console.log({
        distributeForMint: distributeForMint,
        fanoutMint: fanoutMint,
        member: wallet?.publicKey as PublicKey,
        fanout: fanoutData.fanoutId,
        payer: wallet?.publicKey as PublicKey,
        membershipKey,
        metadata: ( findMetadataAccount(membershipKey))[0]
      })
      let ixs = [
        ComputeBudgetProgram.setComputeUnitPrice(
          {
            microLamports: 1000,
          }
        ),
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey as PublicKey,
          toPubkey: fanoutData.fanoutId as PublicKey,
          lamports: 1001,
        }),
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey as PublicKey,  
          toPubkey: fanoutData.nativeAccount as PublicKey,

          lamports: 1001,
        }),
      ]
          let {instructions,signers} = await fanoutSdk.distributeNftMemberInstructions({
            distributeForMint: distributeForMint,
            fanoutMint: fanoutMint,
            member: wallet?.publicKey as PublicKey,
            fanout: fanoutData.fanoutId,
            payer: wallet?.publicKey as PublicKey,
            membershipKey,
            metadata: ( findMetadataAccount(membershipKey))[0]
          })
          ixs.push(...instructions)
          ixs.map(i=>(console.log(...i.keys)))
          
          const latestBlockhash = await connection.getLatestBlockhash();

          
          // Request to sign the transaction
          // @ts-ignore

         // await executeTransaction(connection, asWallet(wallet), transaction, {
          //  confirmOptions: { commitment: 'confirmed', maxRetries: 3 },
         //   signers: [],
         // })
      
 let transaction = new Transaction().add(...ixs)
 transaction.recentBlockhash = latestBlockhash.blockhash
 transaction.feePayer = wallet.publicKey as PublicKey
 ///transaction = await wallet.signTransaction!(transaction)


 const signature = await provider.sendAndConfirm(transaction, [], {skipPreflight:true});
    console.info('Tx sig:', signature)



    showToast('Claim successful!');

  }
  const [item, setItem] = useState<any>({})
  const [amt, setAmt] = useState<string>("")
  const [assets, setAssets] = useState<any[]>([]);

  const [selectedFanoutMint, setSelectedFanoutMint] = useState<any|undefined>(
    mintId && assets
      ? assets.find(
          (asset) =>
            asset.token_info.symbol === mintId ||
            asset.id.toString() === mintId
        )
      : undefined)

  const [nfts, setNfts] = useState<any[]>([]);
  const [assets2, setAssets2] = useState<any[]>([]);
  const [nfts2, setNfts2] = useState<any[]>([]);
  const [tokenPrices, setTokenPrices] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  function ta(element) {
    setTokenAddress(element.target.value)
  }
  function sa(element) {
    setAmt(element.target.value)
  }
  const showModal = () => {
    console.log("show modal")
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleCancel2 = () => {
    setModalVisible2(false);
  }
  const handleOk2 = async () => {
    
    let amount = 1;
    if (item.token_info && item.token_info.decimals){
    amount = parseInt((parseFloat(amt) * 10 ** item.token_info.decimals).toString())
    }

    try {
      console.log(111111111)
      console.log(1111)
      console.log(amount)
      console.log(33333)
    console.log(item)
    console.log(item.id)
    let ixs: TransactionInstruction[] = []
    let ata = await getAssociatedTokenAddress(
      new PublicKey(item.id),
      new PublicKey("9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag"),
      true
    
    )
    let maybe_account = await connection.getAccountInfo(ata)
    if (!maybe_account){
      ixs.push(createAssociatedTokenAccountInstruction(
        new PublicKey(mySelectedAccount.publicKey),
        new PublicKey("9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag"),
        ata,
        wallet.publicKey as PublicKey,
        new PublicKey(item.id),
      ))
    }
    const arrayEmpty: Signer[] = []
    console.log(
      TOKEN_PROGRAM_ID,
      await getAssociatedTokenAddress(
        new PublicKey(item.id),
        wallet.publicKey as PublicKey,
        false,
      ),
      ata,
      wallet.publicKey as PublicKey,
      arrayEmpty,
      amount)
    let ix = createTransferCheckedInstruction(
      await getAssociatedTokenAddress(
        new PublicKey(item.id),
        wallet.publicKey as PublicKey,
        false,
      ),
      new PublicKey(item.id),
      ata,
      wallet.publicKey as PublicKey,
      BigInt(amount),
      item.token_info?.decimals || 0,
      []
    );
    ixs.push(ix)
    console.log(...ixs)
    // if item.interface != FungibleToken
   

                     // Authorize the wallet session

 // Connect to an RPC endpoint and get the latest blockhash, to include in
 // the transaction.
 const latestBlockhash = await connection.getLatestBlockhash();
 console.log(latestBlockhash);
      
 let transaction = new Transaction().add(...ixs)
 transaction.recentBlockhash = latestBlockhash.blockhash
 transaction.feePayer = wallet.publicKey as PublicKey
 ///transaction = await wallet.signTransaction!(transaction)

 const signature = await provider.sendAndConfirm(transaction);
 console.log(signature)
// await executeTransaction(connection, wallet as Wallet, transaction, {})
showToast('SPL Tokens sent!')

     } catch (e: any) {
       console.log(e)
       showToast(e.message)
     }
   };
 
    const handleOk = async () => {
       console.log("User entered:", tokenAddress);
      try {
      const tokenPK = tryPublicKey(tokenAddress);
      if (!tokenPK) {
        throw 'Invalid SPL token address, please enter a valid address based on your network';
      }
        const fanoutSdk = new FanoutClient(
          connection,
          // @ts-ignore
          wallet
        );
                        // Authorize the wallet session
  
    // Connect to an RPC endpoint and get the latest blockhash, to include in
    // the transaction.
    const latestBlockhash = await connection.getLatestBlockhash();
    console.log(latestBlockhash);
  let {instructions, signers} =  await fanoutSdk.initializeFanoutForMintInstructions({
    fanout: fanoutData.data?.fanoutId as PublicKey,
    mint: tokenPK
  })
  console.log({
    fanout: fanoutData.data?.fanoutId as PublicKey,
    mint: tokenPK
  })
  console.log(...instructions);
      
  let transaction = new Transaction().add(ComputeBudgetProgram.setComputeUnitPrice(
    {
      microLamports: 333333,
    }
  ),...instructions)
  transaction.recentBlockhash = latestBlockhash.blockhash
  transaction.feePayer = wallet.publicKey as PublicKey
  ///transaction = await wallet.signTransaction!(transaction)
  const signature = await provider.sendAndConfirm(transaction, [], {skipPreflight:true});
  // await executeTransaction(connection, wallet as Wallet, transaction, {})
  showToast('SPL Token added!')
  
        } catch (e: any) {
          console.log(e)
          showToast(e.message);
        }
      };
    
  // Function to fetch token prices from Jupiter Price API
  const fetchTokenPrices = async (tokenIds) => {
    try {
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenIds.join(',')}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return {};
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      
      let page = 1;
      let allItems = [];
      let response;
      do {
        response = await fetch("https://mainnet.helius-rpc.com/?api-key=0d4b4fd6-c2fc-4f55-b615-a23bab1ffc85", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'searchAssets',
            params: {
              ownerAddress: "9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag",
              page: page,
              tokenType: "all",
              limit: 10
            },
          }),
        });
        var { result } = await response.json();
        console.log('13123')
        console.log(result)
        allItems = allItems.concat(result.items);
        page++;
        if (result.items.length < 10){
          break
        }
      } while (response.ok);
      // nonNfts are result.items not in nfts 
    let nonNfts = allItems.filter((asset: any) => asset.interface.indexOf("Custom") == -1 && asset.interface.indexOf("NFT") == -1);
    // remove instances of NFTS from nonNfts
    // @ts-ignore
      nonNfts = nonNfts.filter(asset => !nfts.find(nft => nft.id == asset.id));
    nonNfts.forEach(async (nft: any) => {
      try {
          
          if (nft.token_info.symbol == "USDC"){
              nft.content.links.image = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
          }
          else if (nft.token_info.symbol == "bSOL"){
            nft.content.links.image = "https://assets.coingecko.com/coins/images/26636/standard/blazesolana.png?1696525709"
          }
          else {
          const imageResponse = await fetch(nft.content.links.image);
          const imageBlob = await imageResponse.blob();
          
          const reader = new FileReader();
          reader.onloadend = function() {
              const base64data = reader.result;
              nft.content.links.image = base64data;
          }
          reader.readAsDataURL(imageBlob);
      }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    });
    // Fetch prices for the assets
    // @ts-ignore
    const prices = await fetchTokenPrices(nonNfts.map(asset => asset.id));

    // multiply out prices by asset.supply
      Object.keys(prices).forEach((key) => {
          try {
              if (nonNfts.find((asset: any) => asset.id == key)){
                // @ts-ignore
              prices[key].price = prices[key].price * nonNfts.find((asset: any) => asset.id == key).token_info.balance / 10 ** nonNfts.find((asset: any) => asset.id == key).token_info.decimals;
              }
          } catch (error) {
              console.log(error);
          }
          });
      console.log(prices)

    setTokenPrices(prices);
    setAssets(nonNfts);
    };

    fetchAssets();
    
  }, []);

  useEffect(() => {
    const fetchAssets = async (publicKey) => {
      
      let page = 1;
      let allItems = [];
      let response;
      do {
        response = await fetch("https://mainnet.helius-rpc.com/?api-key=0d4b4fd6-c2fc-4f55-b615-a23bab1ffc85", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'searchAssets',
            params: {
            ownerAddress: "9soeXKgrQ3F9NFQ2vemBmb57kQ3Ck2NPsqiFGBZzDyag",
              page: page,
              tokenType: "all",
              limit: 10
            },
          }),
        });
        const { result } = await response.json();
          console.log(result.items)
          console.log('13123')
        allItems = allItems.concat(result.items);
        page++;
        if (result.items.length < 10){
          break
        }
      } while (response.ok);
      const nfts = allItems.filter((asset: any) => asset.interface.indexOf("NFT") != -1 || asset.interface.indexOf("Custom") != -1);
    // the asset.content.links.image is a redirect from ipfs, arweave, or something else
    // we need to fetch the image and store it in the asset object
    // then we can display the image in the app
    // fetch the image
    console.log(nfts)
    nfts.forEach(async (nft: any) => {
        try {

            const imageResponse = await fetch(nft.content.links.image);
            const imageBlob = await imageResponse.blob();
            
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result;
                nft.content.links.image = base64data;
            }
            reader.readAsDataURL(imageBlob);
            
        } catch (error) {
          console.error('Fetch error:', error);
        }
      });
      console.log(nfts)
      console.log(allItems)
    setNfts2(nfts);

    let nonNfts = allItems.filter((asset: any) => asset.interface.indexOf("Custom") == -1&& asset.interface.indexOf("NFT") == -1);
    // @ts-ignore
    nonNfts = nonNfts.filter(asset => !nfts.find(nft => nft.id == asset.id));

    nonNfts.forEach(async (nft: any ) => {
      try {
          
        if (nft.token_info.symbol == "USDC"){
          nft.content.links.image = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
      }
      else if (nft.token_info.symbol == "bSOL"){
        nft.content.links.image = "https://assets.coingecko.com/coins/images/26636/standard/blazesolana.png?1696525709"
      }
      else {
          const imageResponse = await fetch(nft.content.links.image);
          const imageBlob = await imageResponse.blob();
          
          const reader = new FileReader();
          reader.onloadend = function() {
              const base64data = reader.result;
              nft.content.links.image = base64data;
          }
          reader.readAsDataURL(imageBlob);
     
      }
      } catch (error) {
        console.error('Fetch error:', error);
        // not a crypto placeholder
        nft.content.links.image = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
      }
    });
    setAssets2(nonNfts);
    };
    fetchAssets(wallet.publicKey);
  }, []);
  

// AsyncButton Component
const AsyncButton = ({ onClick, children, color }) => (
  <ContentBox onClick={onClick} style={{ backgroundColor: color, padding: 10 }} className='button' >
    <RetroTypography >{children}</RetroTypography>
  </ContentBox>
);

  return (
    <CenteredBox>

      <ContentBox >
        {fanoutData.error && (
          <ContentBox >
            <RetroTypography >Hydra Wallet not found</RetroTypography>
          </ContentBox>
        )}

<ContentBox >
<RetroAppBar position="relative"  >
                <RetroToolbar>
                    <RetroTypography variant="h6"  sx={{ flexGrow: 1 }}>
                        {fanoutData.data?.fanout.name}
                    </RetroTypography>
                
                </RetroToolbar>
            </RetroAppBar>
      <RetroTypography >
        {fanoutData.data?.fanout.name ? (
          fanoutData.data?.fanout.name
        ) : (
          // Placeholder for loading state
          'Loading...'
        )}
      </RetroTypography>
      <ContentBox >
      {myNftsVisible && (
      <MyNfts myNftsVisible={myNftsVisible} nfts2={nfts2} />
    )}
    {myAssetsVisible && (
      <MyAssets myAssetsVisible={myAssetsVisible} assets2={assets2} />
    )}
        <ContentBox >
          <RetroTypography >
            Total Inflow:{' '}
            {fanoutMints && fanoutMints.data && fanoutMints.data.find((mint) => mint.data.mint.toString() === mintId) ? (
              `${Number(
                getMintNaturalAmountFromDecimal( 
                  // @ts-ignore
                  Number(( fanoutMints?.data.find((mint) => mint.data.mint.toString() === mintId)).data.totalInflow),
                  // @ts-ignore
                  fanoutMints?.data.find((mint) => mint.data.mint.toString() === mintId).info.decimals
                )
                // @ts-ignore
              )} ${fanoutMints?.data.find((mint) => mint.data.mint.toString() === mintId).config.symbol}`
            ) : fanoutData.data?.fanout ? (
              `${parseInt(fanoutData.data?.fanout?.totalInflow.toString() ?? '0') / 1e9} ◎`
            ) : (
              // Placeholder for loading state
              'Loading...'
            )}
          </RetroTypography>
          <RetroTypography >
            Balance:{' '}
            {assets && assets.find((asset) => asset.id === mintId) // @ts-ignore
            // @ts-ignore
              ? `${Number(
                getMintNaturalAmountFromDecimal( 
                  // @ts-ignore
                  Number(( assets.find((asset) => asset.id === mintId).token_info.balance)),
                  // @ts-ignore
                  fanoutMints?.data.find((mint) => mint.data.mint.toString() === mintId).info.decimals))} ${assets.find((asset) => asset.id === mintId).token_info.symbol}`
              : `${fanoutData.data?.balance}◎`}
          </RetroTypography>
        </ContentBox>
        <ContentBox>

        <RetroFormControl fullWidth>
      <RetroInputLabel id="mint-select-label">Mint</RetroInputLabel>
      <RetroSelect
        labelId="mint-select-label"
        id="mint-select"
        value={mintId}
        label="Mint"
        onChange={(itemValue) => mintit(itemValue)}
      >
        <RetroMenuItem value="default">SOL</RetroMenuItem>
        {fanoutMints.data && fanoutMints.data.map((asset) => (
          <RetroMenuItem value={asset.data.mint.toBase58()} key={asset.data.mint.toBase58()}>
            {asset.data.mint.toBase58()}
          </RetroMenuItem>
        ))}
      </RetroSelect>
    </RetroFormControl>
    </ContentBox>
        </ContentBox>
      </ContentBox>
    </ContentBox>
    
    <ContentBox >
      <RetroTypography >
        Total Shares: {fanoutData.data?.fanout?.totalShares.toString()}
      </RetroTypography>
      <ContentBox >
        <AsyncButton
          onClick={async () =>
            fanoutData.data && distributeShare(fanoutData.data, false)
          }
          color="rgb(96, 165, 250)"
        >
          Distribute To Self
        </AsyncButton>
    <ContentBox style={{marginTop: 22}}>
    <RetroModal
      open={modalVisible2}
      onClose={handleCancel2}
      closeAfterTransition
      BackdropComponent={RetroBackdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <RetroFade in={modalVisible2}>
        <RetroBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
  <ContentBox >
    <ContentBox >
      <RetroTypography >Enter SPL token address</RetroTypography>
      <RetroTypography >Enter the amount you would like to add to {fanoutData.data?.fanout.name.toString()} .</RetroTypography>
      <RetroTextField 
         
        onChange={text => sa(text)} 
        value={amt} 
      />
      <ContentBox >
        <ContentBox
          
          onClick={handleCancel2}
        >
          <RetroTypography >Cancel</RetroTypography>
        </ContentBox>
        <ContentBox
          
          onClick={handleOk2}
        >
          <RetroTypography >OK</RetroTypography>
        </ContentBox>
      </ContentBox>
    </ContentBox>
  </ContentBox></RetroBox></RetroFade>
</RetroModal>    <RetroModal
      open={modalVisible}
      onClose={handleCancel}
      closeAfterTransition
      BackdropComponent={RetroBackdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <RetroFade in={modalVisible}>
        <RetroBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >

  <ContentBox >
    <ContentBox >
      <RetroTypography >Enter SPL token address</RetroTypography>
      <RetroTypography >Enter the SPL token address you would like to add to {fanoutData.data?.fanout.name}</RetroTypography>
      <RetroTextField 
         
        onChange={text => ta(text)} 
        value={tokenAddress} 
      />
      <ContentBox >
        <ContentBox
          
          onClick={handleCancel}
        >
          <RetroTypography >Cancel</RetroTypography>
        </ContentBox>
        <ContentBox
          
          onClick={handleOk}
        >
          <RetroTypography >OK</RetroTypography>
        </ContentBox>
      </ContentBox>
    </ContentBox>
  </ContentBox></RetroBox></RetroFade>
</RetroModal>
    </ContentBox>
        {fanoutData.data && (
          <ContentBox>
          <AsyncButton
            onClick={async () => showModal()}
            color="rgb(156, 163, 175)"
          >
            Add SPL Token
          </AsyncButton>
          <AsyncButton
            onClick={async () => {setMyNftsVisible(false); assetsVisible()}}
            color="rgb(156, 163, 175)"
          >
            Sned Assets
          </AsyncButton>

          </ContentBox>

        )}
        <ContentBox >
      <RetroTypography >
        Fanout Address:{' '}
        <RetroTypography
          
          onClick={() => window.open(pubKeyUrl(fanoutData.data?.fanoutId, "mainnet-beta"))}
        >
          {shortPubKey(fanoutData.data?.fanoutId.toString())}
        </RetroTypography>
      </RetroTypography>
    
        <RetroTypography >
          Sol Wallet Address:{' '}
          <RetroTypography
            
            onClick={() => window.open(pubKeyUrl(
              fanoutData.data?.nativeAccount,
              "mainnet-beta"
            ))}
          >
            {shortPubKey(fanoutData.data?.nativeAccount)}
          </RetroTypography>
        </RetroTypography>
      <RetroTypography >
        Total Members: {fanoutData.data?.fanout?.totalMembers.toString()}
      </RetroTypography>
    </ContentBox>
      </ContentBox>
    </ContentBox>
</CenteredBox>
)};

  
  // Add CSS for the new element:
  
export default AccountInfo