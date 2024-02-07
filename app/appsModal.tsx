import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { Box, Pressable, Select } from "native-base";
import FormComponent from "../components/Forms/FormComponent";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useAppDataContext } from "../contexts/AppDataContext";
import { http_methods } from "../functions/HTTPMethods";
import { CurrentUserType } from "../interfaces/EntityTypes/UserType";
import { AppType } from "../interfaces/EntityTypes/AppType";
import ViewContainer from "../components/ViewContainer";
import { Ionicons } from "@expo/vector-icons";

export default function AppsModalScreen() {
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
      <Box key={index}>
        <Pressable
          px={4}
          py={4}
          bg={"white"}
          borderBottomWidth={1}
          borderBottomColor={"gray.400"}
          display={"flex"}
          flexDirection={"row"}
          alignContent={"space-between"}
          justifyContent={"space-between"}
          onPress={() => {
            handleChange(app.id);
          }}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            {app.name}
          </Text>
          {appData.currentUser?.userOptions.selectedAppId == app.id ? (
            <Ionicons
              style={{ marginLeft: "auto" }}
              size={22}
              name={"checkmark"}
            />
          ) : (
            ""
          )}
        </Pressable>
      </Box>
    ));
  };

  return appData?.apps?.length ? (
    <ViewContainer>
      {/* // <Select
    //   onValueChange={handleChange}
    //   selectedValue={appData?.currentUser?.userOptions?.selectedAppId?.toString()}
    // > */}
      {provideSelectData(appData.apps)}
    </ViewContainer>
  ) : (
    // </Select>
    <Text>Create your first App!</Text>
  );
}
