import { useState } from "react"
import { Grid, Slide, Card, Stack } from "@mui/material";
import gsap from "gsap"
import { MOLE_SCORE, TIME_LIMIT } from "@/constants";
import { Timer } from "./Timer";
import { Mole } from "./Mole";

const Moles = ({children}) => <div> {children} </div>

const MOLES= 5


const Score = ({value}) => <div> {`Score: ${value} `}</div>

const hello = Boolean(true);

export const Game = () => {
    const [playing, setPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    
    const generateMoles = () => new Array(MOLES).fill().map(() => ({
        speed: gsap.utils.random(0.5, 1),
        delay: gsap.utils.random(0.5, 4),
        points: MOLE_SCORE
      }))

      const [moles, setMoles] = useState(generateMoles())
    const onWhack = points => {
        setScore(score + points);
    }

    const endGame = () => {
        setPlaying(false);
        setFinished(true);
    }

    const startGame = () => {
        setScore(0);
        setPlaying(true);
        setMoles(generateMoles());
        setFinished(false);
    }
    return (
    <Slide direction="up" in={hello} mountOnEnter unmountOnExit><Grid item xs={12} md={6}>
      <Card sx={{mt:2, mb:4, flexDirection:'col'}} position="fixed" styles={{Color:"black"}}>
        {!playing && !finished && <> <h1> Whac-A-Mole </h1> 
        <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Stop' : 'Start'}
        </button>
        </>}
        {playing && (
        <>
            <button className="endGame" onClick={endGame}> End Game </button>
            <Score value={score} /> 
            <Timer time={TIME_LIMIT} onEnd={endGame}></Timer>
            <div className="moles">
          {moles.map(({ speed, delay, points }, id) => (
            <Mole
              key={id}
              onWhack={onWhack}
              speed={speed}
              delay={delay}
              points={points}
            />
          ))}
        </div>
        </>
        )}
        {finished && 
        <>
            <Score value={score} />
            <button onClick={startGame}> Play Again</button>
        </>}
        </Card>
      </Grid>
      </Slide>
    
    )
}