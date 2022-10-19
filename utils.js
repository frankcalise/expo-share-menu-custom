import SharedGroupPreferences from "react-native-shared-group-preferences";

const APP_GROUP_ID = "group.com.frankcalise.exposharemenucustom";

export async function storeData(key, data) {
  try {
    console.log("storing data...");
    await SharedGroupPreferences.setItem(key, data, APP_GROUP_ID);
  } catch (errorCode) {
    // errorCode 0 = There is no suite with that name
    console.log(errorCode);
  }
}

export async function getData(key) {
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
