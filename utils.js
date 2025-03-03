function create16BitUUID(shortUUID) {
    // Ensure shortUUID is a 4-character hex string
    const uuid16 = ('0000' + shortUUID.toString(16)).slice(-4);
    return `0000${uuid16}-0000-1000-8000-00805f9b34fb`;
  }

  async function mediaPermissions(){
       const microphonePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Permiso de microfono",
        message: "Need microphone in order to record",
        buttonPositive: "OK",
      }
    )

    const readStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permiso de microfono",
          message: "Need permissions for reading storage",
          buttonPositive: "OK",
        }
  
    )

    const writeStorge = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permiso de microfono",
        message: "Need permissions for writing in storage",
        buttonPositive: "OK",
      }
    )

    return (microphonePermission === "granted" && 
            readStorage === "granted" && 
            writeStorge === "granted")
  }

  


export {create16BitUUID}