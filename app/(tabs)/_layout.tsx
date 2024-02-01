import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Drawer } from "expo-router/drawer";

import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Home",
            title: "Projects Space",
          }}
        />
        {/* <Drawer.Screen
          name="two"
          options={{
            title: "Tab One",
            // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        /> */}
        <Drawer.Screen
          name="login" // This is the name of the page and must match the url from root
          options={{
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="log-in"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
            drawerLabel: "Log in",
            title: "Log in",
          }}
        />
        <Drawer.Screen
          name="register" // This is the name of the page and must match the url from root
          options={{
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="person-add"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
            drawerLabel: "Register",
            title: "Register",
          }}
        />
      </Drawer>
    </>
  );
}
