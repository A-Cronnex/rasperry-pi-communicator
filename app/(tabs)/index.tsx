import { Image, StyleSheet, Platform, SafeAreaView, View,StatusBar, Text, TouchableOpacity} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ABIndicator } from './AppBluetoothIndicator';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect, useRef } from 'react';
import DeviceModal from '@/DeviceConnectionModel'
import useBLE from '@/useBLE';
import useAudioRecorder from '@/useAudioRecorder'
import {useAudioPlayer} from 'expo-audio'
import {useDebounce} from 'use-debounce'

import {PaperProvider, Card, MD3Colors, Icon, ActivityIndicator, Button} from 'react-native-paper'

const audioSource = require("@/assets/bay_play.mp3")

export default function HomeScreen() {

  const [connected, setConnected] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false)

  const [currentCommand, setCurrentCommand] = useState<string>("")

  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [bouncedCommand] = useDebounce(currentCommand, 500)

  //APIs
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    command,
    disconnectFromDevice,
  } = useBLE();

  const {
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
  } = useAudioRecorder();

  const player = useAudioPlayer(audioSource)

  useEffect(() => {
    if (command != "d" && connectedDevice){
      setCurrentCommand(command)
    }
    if (connectedDevice){

      if (bouncedCommand == "a"){
        player.play()
      }

      if (bouncedCommand === "c"){
        onStartRecord()
      } 
    }
      return () => {
        if (connectedDevice){
        if (bouncedCommand != "a"){
          player.pause()
          player.remove()
          if (bouncedCommand === "b"){
            onStopRecord()
          }
        }

      }
    }
  }, [bouncedCommand, connectedDevice, currentCommand,command])

  const scanForDevices = async () => {
    setIsScanning(true)
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
    setTimeout(() => setIsScanning(false), 10000);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  const onPressTest = () => {
    if(connectedDevice){
      setConnected(true)
      disconnectFromDevice()
    } else {
      openModal()
      setConnected(false)
    }
  }



  const afterScan =() => {
    if(!isScanning && allDevices.length === 0){
        return (<Text>No devices found</Text>)
     } else if (!isScanning && allDevices.length > 0) {
      return (
        <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />  
      )
     }
  }

  
  return (
    <PaperProvider>

    <SafeAreaProvider>
      <SafeAreaView>
      <View style={styles.centerView}>
        <ABIndicator></ABIndicator>
        <FontAwesome name="microphone" size={200} color="lightblue" style={{position:"absolute"}}/>
      </View>


      <View style={styles.contentWrapper}>
     { /*<TouchableOpacity onPress={onPressTest} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center", height:40}}>
        <Text style={{color:"white"}}>{connectedDevice? "Dispositivo Conectado" : "Desconectado"}</Text>
      </TouchableOpacity> */}

      {isScanning && <Text>Scanning...</Text>}
      {afterScan()}
      <Text>{recordTime}</Text>

      {/*<TouchableOpacity onPress={onStartRecord} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center"}}>
        <Text>Grabar</Text>
      </TouchableOpacity>*/}

      {/*<TouchableOpacity onPress={onStopRecord} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center"}}>
        <Text>Parar</Text>
      </TouchableOpacity>*/}
      </View>
    
      </SafeAreaView>
    </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  firstView: {
    color:"white"
  },
  centerView:{
    display:"flex",
    position:"relative",
    flexDirection:"column",
    alignItems: "center",
    justifyContent:"center",
    padding:30
  },

  contentWrapper:{
    flex:1,
    flexDirection:"column",
    padding:10,
    gap:10,
    alignContent:"center",
    alignSelf:"center"
  }
});
