import { Image, StyleSheet, Platform, SafeAreaView, View,StatusBar, Text, TouchableOpacity} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ABIndicator } from './AppBluetoothIndicator';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
export default function HomeScreen() {
  const [prueba, setPrueba] = useState<string>("HOLA")
  const onPressTest = () => setPrueba("Probando")
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Hola mundo! Estoy en react native</Text>
      </View>

      <View style={styles.centerView}>
        <ABIndicator></ABIndicator>
        <FontAwesome name="microphone" size={24} color="black" />

        <Text>
          {prueba}
        </Text>
      </View>

      <TouchableOpacity onPress={onPressTest}>
        <Text>Tocame corazon.</Text>
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
