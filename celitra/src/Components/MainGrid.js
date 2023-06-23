import { Grid, Slide, Card, Stack } from "@mui/material";
import { Catalogue } from "./Catalogue";

const hello = true;

export const MainGrid = ({walletAddress}) => {
    return <Slide direction="up" in={hello} mountOnEnter unmountOnExit><Grid item xs={12} md={6}>
      <Card sx={{mt:2, mb:4, flexDirection:'col'}} position="fixed" styles={{Color:"black"}}>

      {!walletAddress &&  <Stack spacing={4} alignItems='center' width='100%' padding='2rem'> 
      <h3> Please Login to start Minting</h3> </Stack>}

      <Stack alignItems='center' spacing={2} width='100%' padding='2rem'>
      <div id = 'stripe-root'></div>
      
      {walletAddress && <h2> NFTs to Check Out! </h2>}
      {walletAddress && <Catalogue />}
      </ Stack>
      </ Card>
      </Grid>
      </Slide>
}