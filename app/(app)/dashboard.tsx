import { Button, StyleSheet } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import EditScreenInfo from "../../components/EditScreenInfo";
import { Text } from "../../components/Themed";
import ViewContainer from "../../components/ViewContainer";
import { host } from "../../constants/Host";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { http_methods } from "../../functions/HTTPMethods";
import { CurrentUserType } from "../../interfaces/EntityTypes/UserType";
import { AppType } from "../../interfaces/EntityTypes/AppType";
import { Select } from "native-base";

export default function Dashboard() {
  const [data, setData] = useState("");

  const loadData = async () => {};

  return (
    <ViewContainer>
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}

      {/* <Text>{data}</Text> */}

      {/* <Button onPress={loadData} title="Load data" /> */}
    </ViewContainer>
  );
}
