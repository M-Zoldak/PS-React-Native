import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { Box, Select } from "native-base";
import FormComponent from "../components/Forms/FormComponent";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useAppDataContext } from "../contexts/AppDataContext";
import { http_methods } from "../functions/HTTPMethods";
import { CurrentUserType } from "../interfaces/EntityTypes/UserType";
import { AppType } from "../interfaces/EntityTypes/AppType";

export default function CreateModalScreen() {
  const { appData, updateCurrentUser } = useAppDataContext();
  const navigator = useNavigation();
  const params = useLocalSearchParams();

  const handleChange = (appId: string) => {
    http_methods
      .post<CurrentUserType>("/user/updateSelectedApp", {
        appId: appId,
      })
      .then((res) => {
        updateCurrentUser(res);
      })
      .catch((err) => err);
  };

  const provideSelectData = (apps: Array<AppType>) => {
    return apps.map((app, index) => (
      <Select.Item key={index} label={app.name} value={app.id.toString()} />
    ));
  };

  return appData?.apps?.length ? (
    <Select
      onValueChange={handleChange}
      selectedValue={appData?.currentUser?.userOptions?.selectedAppId?.toString()}
    >
      {provideSelectData(appData.apps)}
    </Select>
  ) : (
    <Text>Create your first App!</Text>
  );
}
