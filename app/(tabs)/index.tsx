import { Image, StyleSheet, Platform, SafeAreaView, View,StatusBar, Text, TouchableOpacity} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ABIndicator } from './AppBluetoothIndicator';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import DeviceModal from '@/DeviceConnectionModel'
import useBLE from '@/useBLE';


export default function HomeScreen() {

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    command,
    disconnectFromDevice,
  } = useBLE()

  const [isModalVisible,setIsModalVisible] = useState<boolean>(false)

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {

    scanForDevices();
    setIsModalVisible(true);
  };

  const [prueba, setPrueba] = useState<string>("HOLA")
  const [connected, setConnected] = useState<boolean>(false)
  const onPressTest = () => {
    if(connectedDevice){
      setConnected(true)
      disconnectFromDevice()
    } else {
      openModal()
      setConnected(false)
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
          {command}
        </Text>
      </View>

      <TouchableOpacity onPress={onPressTest} style={{backgroundColor: connectedDevice ? "green" : "red", padding:10, alignContent:"center"}}>
        <Text style={{color:"white"}}>{connectedDevice? "Dispositivo Conectado" : "Desconectado"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />  
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
