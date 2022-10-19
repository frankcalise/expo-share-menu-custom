import React, { useState, useEffect, useCallback } from "react";
import { AppRegistry, Text, View, Image, Button } from "react-native";
import ShareMenu, { ShareMenuReactView } from "react-native-share-menu";

const App = () => {
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
    // You can receive extra data from your custom Share View
    console.log(extraData);
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

  if (!sharedMimeType && !sharedData) {
    // The user hasn't shared anything yet
    return null;
  }

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
      <Text>Shared mime type: {sharedMimeType}</Text>
      <Text>Shared file location: {JSON.stringify(sharedData)}</Text>
    </View>
  );
};



export default App;