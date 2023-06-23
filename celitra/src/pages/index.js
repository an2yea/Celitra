import Head from 'next/head'
import Image from 'next/image'
import { Engagement, Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import {ethers, Contract} from 'ethers'
import { ParticleProvider } from "@particle-network/provider";
import Web3 from "web3";
import { useState } from 'react';
import { SmartAccount } from '@particle-network/biconomy';
import {CONTRACT_ADDRESS, CONTRACT_ABI, PARTICLE_PROJECT_ID, PARTICLE_CLIENT_KEY, PARTICLE_APP_ID, BICONOMY_API_KEY} from "../constants/index"
import {AppBar, Toolbar, Typography, Stack, Box, Tooltip, Button, Backdrop, CircularProgress, Slide, Grid, Card} from "@mui/material"
import FileCopyIcon from '@mui/icons-material/FileCopy';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MainGrid } from '@/Components/MainGrid';
// import { Game } from '@/Components/Game';
const inter = Inter({ subsets: ['latin'] })


export default function Home() {

   const [walletConnected, setWalletConnected] = useState(false);
   const [walletAddress, setWalletAddress] = useState("");
   const [smartAccountAddress, setSmartAccountAddress] = useState("");
   const [smartAccount, setSmartAccount] = useState("");
   const [provider, setProvider] = useState();
   const isLargerThan600 = useMediaQuery('(min-width: 600px)')


   const particle = new ParticleNetwork({
    projectId: PARTICLE_PROJECT_ID,
    clientKey: PARTICLE_CLIENT_KEY,
    appId: PARTICLE_APP_ID,
    chainName: "Polygon",
    chainId: 80001, 
    wallet: {   
      displayWalletEntry: true, 
      defaultWalletEntryPosition: WalletEntryPosition.BR, 
      uiMode: "dark",  
      supportChains: [{id:80001, name:"Polygon"}], 
      customStyle: {}, 
    },
    securityAccount: { 
      promptSettingWhenSign: 1,
      promptMasterPasswordSettingWhenLogin: 1
    },
  });

  const mintNFT = async() => {
    let tokenURI = `ipfs://bafyreidrt5utdvnwonctnojcese7n2lzi4pkcvvtz7mw2ptijbtnb5sfya/metadata.json`;
    const particleProvider = new ParticleProvider(particle.auth);

    const ethersProvider = new ethers.providers.Web3Provider(particleProvider, "any");
    const signer = ethersProvider.getSigner();

    const msg = [
    {
      type: "string",
      name: "fullName",
      value: "John Doe",
    },
    {
      type: "uint32",
      name: "userId",
      value: "1234",
    },
  ];

    const message = '0x.......';
    const result = await particle.evm.personalSignUniq(message);
    console.log(result);
    // const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // const tx = contract.mintNFT({
    //   to: walletAddress,
    //   tokenURI: tokenURI,
    //   value: utils.parseEther(0.001)
    // })

    // await tx.wait();
    // window.alert("The NFT was succesfully minted");
    // let iface = new ethers.utils.Interface(CONTRACT_ABI);
    // let x = iface.encodeFunctionData("mintNFT", [walletAddress, tokenURI]);
    // console.log(x);

    // const tx = {
    //   from;  
    //   target: walletAddress, 
    //   data: x
    // }

    // const txnHash = await particle.evm.sendTransaction(tx);
    // console.log(txnHash);
  }

  const initialiseSmartAccount = async() => {
    const particleProvider = new ParticleProvider(particle.auth);
    const provider = new ethers.providers.Web3Provider(particleProvider, "any");
    let smartAccount = await new SmartAccount(provider, {
      projectId: PARTICLE_PROJECT_ID,
      clientKey: PARTICLE_CLIENT_KEY,
      appId: PARTICLE_APP_ID,
      networkConfig: [
          { dappAPIKey: BICONOMY_API_KEY, chainId: 80001 },
      ],
    });
    console.log(smartAccount);

    smartAccount = await smartAccount.init();
    // console.log(Object.getPrototypeOf(smartAccount)); 
    // await smartAccount.init();
    // setSmartAccount(smartAccount);
    // const address = smartAccount.getAddress();
    // setSmartAccountAddress(address);
  }
  const login = async () => {
    
    const particleProvider = new ParticleProvider(particle.auth);
    const provider = new ethers.providers.Web3Provider(particleProvider, "any");
    console.log(provider);
    setProvider(provider);
    const userInfo = await particle.auth.login();
    console.log(userInfo);
    setWalletConnected(true);

    const accounts = await provider.listAccounts();
    console.log(accounts[0]);
    setWalletAddress(accounts[0]);
    initialiseSmartAccount();
  }

  const openWallet = () => {
    particle.openWallet();
  }

  const renderConnectWallet = () => {
    if(walletConnected) {
      return <Button variant="link" style={{backgroundColor:"white", color:"#45A29E"}}color="inherit" id="account-button" size="medium"> 
        <p aria-controls="open ? 'account-menu' : undefined" aria-haspopup="true" aria-expanded={open ? 'true':undefined}>{walletAddress} 
        </p> &nbsp; 
        <Tooltip title="Click to Copy wallet address">
        <FileCopyIcon onClick={()=>{
          navigator.clipboard.writeText(`${walletAddress}`);
    }}/></Tooltip> </Button>
    }
    else return<Button style={{backgroundColor:"white", color:"#45A29E"}} variant="contained" color="inherit" size="medium" onClick={login}> Login </Button>
  }


  return (
    <>
      <Head>
        <title> Celitra </title>
        <meta name="description" content="Get into the Web3 Ecosystem with a single click! " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/white_favicon.svg" />
      </Head>
      <Box sx={{mt:3, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
      <AppBar sx={{boxShadow:0}} position="sticky" style={{backgroundColor:"transparent"}}>
        <Toolbar sx={{ml:'2%', padding:'0', justifyContent:'space-around'}} variant="dense" >
          <Image src='/images/white_icon.svg' alt='Logo' height='70' width='50'/>
          {isLargerThan600 && <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            &nbsp; Celitra
        </Typography>}
        <Stack direction='row' spacing={2}>
          {renderConnectWallet()}
        </Stack>
        </Toolbar>
      </AppBar>
      <Grid container flexDirection='column' alignItems='center' spacing={4} paddingLeft='2%' paddingRight='2%' >
      {/* <Game /> */}
      <MainGrid walletAddress={walletAddress}/>
      {/* <Backdrop
        sx={{ color: '#45A29E', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" /></Backdrop> */}
      </Grid >
      </Box>
    </>
  )
}
