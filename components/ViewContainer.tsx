import { PropsWithChildren } from "react";
import {
  RefreshControl,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Colors from "../constants/Colors";
import { ScrollView } from "native-base";

export default function ViewContainer({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  // const [refreshing, setRefreshing] = useState(false);
  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, []);

  return (
    // <SafeAreaView>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      flex={1}
      // flexGrow={1}
      style={style}
    >
      {/* <RefreshControl refreshing={refreshing}> */}
      {children}
      {/* </RefreshControl> */}
    </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    // flex: 1,
  },
});
