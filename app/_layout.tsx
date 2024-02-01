import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Heading, NativeBaseProvider, extendTheme } from "native-base";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Text } from "../components/Themed";
import "react-native-gesture-handler";
import AppDataProvider from "../contexts/AppDataContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AppDataProvider>
      <NativeBaseProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {/* <Heading>Some heading</Heading> */}
          <Stack>
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
                header: () => <Text>Projects-space</Text>,
                title: "Projects-space",
              }}
            />

            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                header: () => <Text>Projects-space</Text>,
                title: "Projects-space",
              }}
            />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />

            <Stack.Screen
              name="createModal"
              options={{ presentation: "modal" }}
            />

            <Stack.Screen
              name="appsModal"
              options={{
                presentation: "modal",
                headerTitle: "Choose Space",
              }}
            />
          </Stack>
        </ThemeProvider>
      </NativeBaseProvider>
    </AppDataProvider>
  );
}
