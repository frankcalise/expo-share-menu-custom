import React, { useState, useRef, useEffect, useCallback } from "react";
import { AppState, Text, View } from "react-native";
import ShareMenu from "react-native-share-menu";
import { getData } from "./utils";

// FYI two patches needed for iOS
// https://github.com/meedan/react-native-share-menu/issues/135
// https://github.com/meedan/react-native-share-menu/issues/209

const App = () => {
  const appState = useRef(AppState.currentState);

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
    } else {
      // initial launch
      console.log("initial launch", appState.currentState, nextAppState);
      doLookup();
    }

    appState.current = nextAppState;
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

const AndroidApp = () => {
  const [sharedData, setSharedData] = useState(null);
  const [sharedMimeType, setSharedMimeType] = useState(null);

  const handleShare = useCallback((item) => {
    if (!item) {
      return;
    }

    console.log(item);

    const { mimeType, data, extraData } = item;

    setSharedData(data);
    setSharedMimeType(mimeType);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

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

export default Platform.select({ ios: App, android: AndroidApp });
