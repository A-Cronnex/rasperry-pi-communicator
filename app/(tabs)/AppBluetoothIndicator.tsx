import { useEffect, useState } from 'react'
import {Canvas, useCanvasRef, Circle, vec} from "@shopify/react-native-skia"


const width = 300
const height = 300

export const ABIndicator = () => {

    const circleCenter = vec(width/2,height/2)
    const radius = width/2

    return (
        <Canvas style={{height:width,width:height,position:"relative",backgroundColor:"red", display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Circle c={circleCenter} r={radius} color={"blue"}>
            </Circle>
        </Canvas>
    )
}