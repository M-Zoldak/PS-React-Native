import {
  DrawerContentComponentProps,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Dashboard from "./dashboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebsitesList from "./website/list";
import Separator from "../../components/Separator";
import { StyleSheet } from "react-native";
import { useAppDataContext } from "../../contexts/AppDataContext";
import * as SecureStorage from "expo-secure-store";
import AppsList from "./app/list";
import ClientsList from "./client/list";
import ProjectsList from "./projects/list";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { clear, appData } = useAppDataContext();
  const { navigation } = props;
  return (
    <>
      <DrawerItemList {...props} />
      <Separator />
      <DrawerItem
        label={`Current App: ${
          appData.apps?.find(
            (a) => a.id == appData.currentUser?.userOptions.selectedAppId
          )?.name
        }`}
        onPress={() => {
          navigation.navigate("appsModal");
        }}
      />
      {/* <DrawerItem
        label="Choose App"
        onPress={() => {
          navigation.navigate("dashboard");
        }}
      /> */}
      <DrawerItem
        label={"Log out"}
        // title="Go somewhere"
        onPress={async () => {
          clear();
          await SecureStorage.deleteItemAsync("token");
          navigation.navigate("(tabs)");
        }}
      />
    </>
  );
}

export default function TabLayout() {
  const Drawer = createDrawerNavigator();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Drawer.Navigator
        detachInactiveScreens
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShadowVisible: true,
          headerStyle: styles.header,
          drawerContentContainerStyle: { marginTop: insets.top },
          drawerStyle: { paddingTop: insets.top },
        }}
      >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Websites" component={WebsitesList} />
        <Drawer.Screen name="Clients" component={ClientsList} />
        <Drawer.Screen name="Projects" component={ProjectsList} />
        <Drawer.Screen name="My apps" component={AppsList} />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    boxShadow: "22 22 1px black",
    shadowRadius: 16,
  },
});
