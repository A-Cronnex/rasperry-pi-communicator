import { Image, StyleSheet, Platform, SafeAreaView, View,StatusBar, Text, TouchableOpacity} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ABIndicator } from './AppBluetoothIndicator';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect, useRef } from 'react';
import DeviceModal from '@/DeviceConnectionModel'
import useBLE from '@/useBLE';
import useAudioRecorder from '@/useAudioRecorder'


export default function HomeScreen() {

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

  const [connected, setConnected] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false)

  const [currentCommand, setCurrentCommand] = useState<string>("")

  useEffect(() => {
    if (command != "d" && connectedDevice){
      setCurrentCommand(command)
    }
    if (connectedDevice){
      if (currentCommand === "c"){
        onStartRecord()
      } else if (currentCommand === "b"){
        onStopRecord()
      }
    }
  }, [command, connectedDevice,currentCommand])

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
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Hola mundo! Estoy en react native</Text>
      </View>

      <View style={styles.centerView}>
        <ABIndicator></ABIndicator>
        <FontAwesome name="microphone" size={24} color="black" />

        <Text> El comando es:
          {currentCommand}
        </Text>
      </View>

      <TouchableOpacity onPress={onPressTest} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center"}}>
        <Text style={{color:"white"}}>{connectedDevice? "Dispositivo Conectado" : "Desconectado"}</Text>
      </TouchableOpacity>

      {isScanning && <Text>Scanning...</Text>}
      {afterScan()}
      <Text>{recordTime}</Text>

      <TouchableOpacity onPress={onStartRecord} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center"}}>
        <Text>Grabar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onStopRecord} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center"}}>
        <Text>Parar</Text>
      </TouchableOpacity>

    </SafeAreaView>
    </SafeAreaProvider>
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
    backgroundColor:"purple",
    alignItems: "center",
    justifyContent:"center"
  }
});
