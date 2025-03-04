import { PermissionsAndroid, Platform, Alert, Linking, PermissionStatus} from "react-native";
import * as ExpoDevice from "expo-device";

async function mediaPermissions(): Promise<boolean>{

  const writeStoragePermissionCheck : PermissionStatus = "granted"
  const readStoragePermissionCheck : PermissionStatus = "granted"
  

    const microphonePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Permiso de microfono",
        message: "Need microphone in order to record",
        buttonPositive: "OK",
      }
    )

    console.log("Microphone Permission:", microphonePermission);
    console.log("Read Storage Permission:", readStoragePermissionCheck);

    console.log("Write Storage Permission:", writeStoragePermissionCheck);

    if(((ExpoDevice.platformApiLevel ?? -1) >= 33)){
      return (microphonePermission === "granted" && 
        writeStoragePermissionCheck === "granted" && 
        readStoragePermissionCheck === "granted")
    }

    const readStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permiso de microfono",
          message: "Need permissions for reading storage",
          buttonPositive: "OK",
        }
  
    )

    const writeStorage = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permiso de microfono",
        message: "Need permissions for writing in storage",
        buttonPositive: "OK",
      }
    )

  

    console.log("Microphone Permission:", microphonePermission);
    console.log("Read Storage Permission:", readStorage);

    console.log("Write Storage Permission:", writeStorage);

    return (microphonePermission === "granted" && 
            readStorage === "granted" && 
            writeStorage === "granted")
  }
async function requestMediaPermissions(): Promise<boolean>{
  if (Platform.OS === "android") {
    if (!((ExpoDevice.platformApiLevel ?? -1) < 31)) {
      const mediaPermission = await mediaPermissions()
      return mediaPermission
      } else {
        return true
      }
    }
      return true;
  
};


export default requestMediaPermissions