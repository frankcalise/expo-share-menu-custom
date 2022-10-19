import React, { useState, useEffect, useCallback } from "react";
import { AppRegistry, Text, View, Image, Button } from "react-native";
import { ShareMenuReactView } from "react-native-share-menu";
import SharedGroupPreferences from "react-native-shared-group-preferences";

const APP_GROUP_ID = "group.com.frankcalise.exposharemenucustom";

async function storeData(key, data) {
  try {
    console.log("storing data...");
    await SharedGroupPreferences.setItem(key, data, APP_GROUP_ID);
  } catch (errorCode) {
    // errorCode 0 = There is no suite with that name
    console.log(errorCode);
  }
}

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
        title="Cancel"
        onPress={() => {
          ShareMenuReactView.dismissExtension();
        }}
      />
      <Button
        title="Send"
        onPress={() => {
          // Share something before dismissing
          storeData("share-key", sharedData);
          ShareMenuReactView.dismissExtension();
        }}
      />
      {/* <Button
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
      /> */}
      {sharedMimeType === "text/plain" && <Text>{sharedData}</Text>}
      {sharedMimeType?.startsWith("image/") && (
        <Image source={{ uri: sharedData }} />
      )}
    </View>
  );
};

AppRegistry.registerComponent("ShareMenuModuleComponent", () => Share);
