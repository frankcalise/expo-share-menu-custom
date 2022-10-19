import React, { useState, useRef, useEffect, useCallback } from "react";
import { AppState, Text, View, Button } from "react-native";
import { getData } from "./utils";

const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      doLookup();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  const [sharedData, setSharedData] = useState(null);
  console.log({ sharedData });

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
        paddingHorizontal: 12,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Current Data:</Text>
      <Text style={{ fontSize: 18 }}>{JSON.stringify(sharedData)}</Text>
    </View>
  );
};

export default App;
