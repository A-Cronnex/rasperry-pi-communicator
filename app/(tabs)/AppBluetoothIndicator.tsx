import { useEffect, useState } from 'react'
import {Canvas, useCanvasRef, Circle, vec} from "@shopify/react-native-skia"


const width = 250
const height = 250

export const ABIndicator = () => {

    const circleCenter = vec(width/2,height/2)
    const radius = width/2

    return (
        <Canvas style={{height:width,width:height,position:"relative", display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Circle c={circleCenter} r={radius} color={"white"}>
            </Circle>
        </Canvas>
    )
}