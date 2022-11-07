import React, { useState, useEffect } from "react";
import { AppRegistry, Text, View, Image, Button } from "react-native";
import { ShareMenuReactView } from "react-native-share-menu";
import { storeData } from "./utils";

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
    <View style={{ alignItems: "center" }}>
      <Text>Custom Share UI</Text>
      <Text>Cancel - dismisses this modal</Text>
      <Button
        title="Cancel"
        onPress={() => {
          ShareMenuReactView.dismissExtension();
        }}
      />
      <Text>Send - sends payload data to shared group prefs (see App.js)</Text>
      <Button
        title="Send"
        onPress={() => {
          // Share something before dismissing
          storeData("share-key", sharedData);
          ShareMenuReactView.dismissExtension();
        }}
      />
      {sharedMimeType === "text/plain" && <Text>{sharedData}</Text>}
      {sharedMimeType?.startsWith("image/") && (
        <Image source={{ uri: sharedData }} />
      )}
    </View>
  );
};

AppRegistry.registerComponent("ShareMenuModuleComponent", () => Share);
