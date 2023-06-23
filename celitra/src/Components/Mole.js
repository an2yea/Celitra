import gsap from "gsap"
import { useRef, useEffect, useState } from 'react'

import { MOLE_SCORE, POINTS_MULTIPLIER, TIME_MULTIPLIER } from "@/constants"


export const Mole = ({key, onWhack, points, speed, delay, pointsMin = 10}) => {
    const buttonRef = useRef(null);
    const pointsRef = useRef(points);
    const bobRef = useRef(null);
    const [whacked, setWhacked] = useState(false);

    useEffect(() => {
        bobRef.current = gsap.to(buttonRef.current, {
          yPercent: -100,
          duration: speed,
          yoyo: true,
          repeat: -1,
          delay: delay,
          repeatDelay: delay,
          onRepeat: () => {
            pointsRef.current = Math.floor(
              Math.max(pointsRef.current * POINTS_MULTIPLIER, pointsMin)
            )
          },
        })
        return () => {
          bobRef.current.kill()
        }
      }, [delay, pointsMin, speed])

    useEffect(() => {
        gsap.set(buttonRef.current, { yPercent: 100 })
        gsap.to(buttonRef.current, {
          yPercent: 0,
          yoyo: true,
          repeat: -1,
        })
      }, [])

      useEffect(() => {
        if (whacked) {
          pointsRef.current = points
          bobRef.current.pause()
          gsap.to(buttonRef.current, {
            yPercent: 100,
            duration: 0.1,
            onComplete: () => {
              gsap.delayedCall(gsap.utils.random(1, 3), () => {
                setWhacked(false)
                bobRef.current
                  .restart()
                  .timeScale(bobRef.current.timeScale() * TIME_MULTIPLIER)
              })
            },
          })
        }
      }, [whacked])

      const whack = () => {
        setWhacked(true);
        onWhack(pointsRef.current);
      }

      return (
        <div className="mole-hole">
          <button
            className="mole"
            ref={buttonRef}
            onClick={whack}>
            Mole
          </button>
        </div>
      )
}

Mole.defaultProps = {
    pointsMin: 10,
}

