import { useMemo, useState } from "react";
import { Platform } from "react-native";

import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
   } from 'react-native-audio-recorder-player';

import ReactNativeBlobUtil from 'react-native-blob-util'

import requestMediaPermissions from "@/utils"

interface audioRecordAPI {

    onStartRecord() : Promise<void>,
    onStopRecord() : Promise<void>,
    onStartPlay(): Promise<void>,
    onPausePlay() : Promise<void>,
    onStopPlay(): Promise<void>,
    isLogginIn: boolean,
    recordSecs: number,
    currentPositionSec:number,
    currentDurationSec:number,

    playTime:string,
    recordTime: string,
    duration:string

}

function useAudioRecorder() : audioRecordAPI {
    const audioRecorderPlayer = useMemo(() => new AudioRecorderPlayer(), [])
    const [isLogginIn, setIsLogginIn] = useState<boolean>(false)

    const [recordSecs, setRecordSecs] = useState<number>(0)
    const [currentPositionSec, setCurrentPositionSec] = useState<number>(0)
    const [currentDurationSec, setCurrentDurationSec] = useState<number>(0)

    const [recordTime, setRecordTime] = useState<string>("00:00:00")
    const [playTime, setPlayTime] = useState<string>("00:00:00")
    const [duration, setDuration] = useState<string>("00:00:00")

    const [permissionsEnabled, setPermissionsEnabled] = useState<boolean>(false)

    const onStartRecord = async () => {

        const getPermissions = await requestMediaPermissions()

        if(!getPermissions){
            setPermissionsEnabled(false)
            return
        }
        
        setPermissionsEnabled(true)
        
        
        const audioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        console.log('audioSet', audioSet);

        const dirs = ReactNativeBlobUtil.fs.dirs;
        const path = Platform.select({
          ios: 'hello.m4a',
          android: `${dirs.DownloadDir}/hello.mp3`,
        });

        try {
            const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
            console.log(uri)
             audioRecorderPlayer.addRecordBackListener((e) => {
            setRecordSecs(e.currentPosition)
            setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
            });
        } catch(error){
            console.log(error)
        }
        console.log(recordTime)
      };

    const onStopRecord = async () => {

        if(!permissionsEnabled){
            return
        }

        const result = audioRecorderPlayer.stopRecorder();
        console.log(recordTime)
        audioRecorderPlayer.removeRecordBackListener();
        
        setRecordSecs(0)
        console.log(result);
      };

    const onStartPlay = async () => {

        if(!permissionsEnabled){
            return
        }

        console.log('onStartPlay');

        const dirs = ReactNativeBlobUtil.fs.dirs;
        const path = Platform.select({
          ios: 'hello.m4a',
          android: `${dirs.DownloadDir}/hello.mp3`,
        });
        
        const msg = await audioRecorderPlayer.startPlayer(path);
        audioRecorderPlayer.setVolume(1.0);
        console.log(msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.currentPosition === e.duration) {
            console.log('finished');
            audioRecorderPlayer.stopPlayer();
          }

          setCurrentPositionSec(e.currentPosition)
          setCurrentDurationSec(e.duration)
          setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
          setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)))
          /*this.setState({
            currentPositionSec: e.current_position,
            currentDurationSec: e.duration,
            playTime: this.audioRecorderPlayer.mmssss(
              Math.floor(e.current_position),
            ),
            duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
          });*/
        });
      };
    
    const onPausePlay = async () => {

        if(!permissionsEnabled){
            return
        }

        await audioRecorderPlayer.pausePlayer();
       };
    
    const onStopPlay = async () => {

        if(!permissionsEnabled){
            return
        }

        console.log('onStopPlay');
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
    };

    return {
        onStartRecord,
        onStopRecord,
        onStartPlay,
        onPausePlay,
        onStopPlay,
        isLogginIn,
        recordSecs,
        currentPositionSec,
        currentDurationSec,
        playTime,
        recordTime,
        duration
    }
}

export default useAudioRecorder