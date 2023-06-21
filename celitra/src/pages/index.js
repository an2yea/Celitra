import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import Web3 from "web3";
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

   const [walletConnected, setWalletConnected] = useState(false);
   const [walletAddress, setWalletAddress] = useState("");

   const particle = new ParticleNetwork({
    projectId: "1854b250-df82-4805-a1cc-1f7701c782a0",
    clientKey: "cDTUsP8LOC3CeOLH98FRvNrxkgNyYt6GWb0kcuSg",
    appId: "802a8c74-940c-418d-b027-7d1eb9b6b32a",
    chainName: "Ethereum", //optional: current chain name, default Ethereum.
    chainId: 1, //optional: current chain id, default 1.
    wallet: {   //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
      displayWalletEntry: true,  //show wallet entry when connect particle.
      defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
      uiMode: "dark",  //optional: light or dark, if not set, the default is the same as web auth.
      supportChains: [{ id: 1, name: "Ethereum"}, { id: 5, name: "Ethereum"}, {id:137, name:"Polygon"}, {id:80001, name:"Polygon"}], // optional: web wallet support chains.
      customStyle: {}, 
    },
    securityAccount: { 
      promptSettingWhenSign: 1,
      promptMasterPasswordSettingWhenLogin: 1
    },
  });

  const login = async () => {
    
    const particleProvider = new ParticleProvider(particle.auth);
  
    window.web3 = new Web3(particleProvider);
    window.web3.currentProvider.isParticleNetwork

    const userInfo = await particle.auth.login();
    console.log(userInfo);
    setWalletConnected(true);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setWalletAddress(accounts[0]);
  }

  const openWallet = () => {
    particle.openWallet();
  }

  const renderConnectWallet = () => {
    if(walletConnected) {
      return <button onClick={openWallet}> Open wallet </button>
    }
    else return <button onClick={login}> Log In </button>
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
          {renderConnectWallet()};
        </div>
        </main>
    </>
  )
}
