import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Button } from "react-native";
import SharedGroupPreferences from "react-native-shared-group-preferences";

const APP_GROUP_ID = "group.com.frankcalise.exposharemenucustom";

async function getData(key) {
  try {
    const loadedData = await SharedGroupPreferences.getItem(key, APP_GROUP_ID);
    console.log("shared prefs data", loadedData);
    return loadedData;
  } catch (errorCode) {
    // errorCode 0 = no group name exists. You probably need to setup your Xcode Project properly.
    // errorCode 1 = there is no value for that key
    console.log(errorCode);
  }
}

const App = () => {
  const [sharedData, setSharedData] = useState(null);

  const doLookup = useCallback(async () => {
    console.log("checking for data...");
    const data = await getData("share-key");
    if (data) {
      console.log("retrieved data", data);
      setSharedData(data);
    } else {
      console.log("no data");
    }
  }, []);

  // The user shared a file in general
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>Shared mime type: {sharedMimeType}</Text> */}
      <Button onPress={doLookup} title="Refresh" />
      <Text>Shared file location: {JSON.stringify(sharedData)}</Text>
    </View>
  );
};

export default App;
