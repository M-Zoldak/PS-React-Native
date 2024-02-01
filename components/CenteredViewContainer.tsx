import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import { ScrollView } from "native-base";

export default function CenteredViewContainer({ children }: PropsWithChildren) {
  return (
    <ScrollView contentContainerStyle={styles.container}>{children}</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
    flex: 1,
  },
});
