import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Colors from "../constants/Colors";
import { ScrollView } from "native-base";

export default function ViewContainer({
  children,
  style,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      flex={1}
      style={style}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 22,
    backgroundColor: Colors.light.background,
  },
});
