function create16BitUUID(shortUUID) {
    // Ensure shortUUID is a 4-character hex string
    const uuid16 = ('0000' + shortUUID.toString(16)).slice(-4);
    return `0000${uuid16}-0000-1000-8000-00805f9b34fb`;
  }

export {create16BitUUID}