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

const Share = () => {
  const [sharedData, setSharedData] = useState("");
  const [sharedMimeType, setSharedMimeType] = useState("");

  useEffect(() => {
    ShareMenuReactView.data().then(({ mimeType, data }) => {
      setSharedData(data);
      setSharedMimeType(mimeType);
      console.log("from share", { data });
    });
  }, []);

  return (
    <View>
      <Button
        title="Dismiss"
        onPress={() => {
          ShareMenuReactView.dismissExtension();
        }}
      />
      <Button
        title="Send"
        onPress={() => {
          // Share something before dismissing
          ShareMenuReactView.dismissExtension();
        }}
      />
      <Button
        title="Dismiss with Error"
        onPress={() => {
          ShareMenuReactView.dismissExtension("Something went wrong!");
        }}
      />
      <Button
        title="Continue In App"
        onPress={() => {
          ShareMenuReactView.continueInApp();
        }}
      />
      <Button
        title="Continue In App With Extra Data"
        onPress={() => {
          ShareMenuReactView.continueInApp({ hello: "from the other side" });
        }}
      />
      {sharedMimeType === "text/plain" && <Text>{sharedData}</Text>}
      {sharedMimeType.startsWith("image/") && (
        <Image source={{ uri: sharedData }} />
      )}
    </View>
  );
};

export default App;
// AppRegistry.registerComponent("Test", () => Test);
// AppRegistry.registerComponent("ShareMenuModuleComponent", () => Share);
