import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Button, Input } from "native-base";
import * as SecureStore from "expo-secure-store";
import { host } from "../../constants/Host";
import ViewContainer from "../../components/ViewContainer";
import { router } from "expo-router";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function LoginScreen() {
  const { refreshAppData } = useAppDataContext();
  const [username, setUsername] = useState("fakeemail4@fake.com");
  const [password, setPassword] = useState("a123456789.");
  const [loggingIn, setLoggingIn] = useState(false);

  const login = async () => {
    setLoggingIn(true);
    await axios
      .post(`${host}/api/login`, {
        username,
        password,
      })
      .then(async (res) => {
        await SecureStore.setItemAsync("token", res.data.token);
      })
      .then(() => refreshAppData())
      .then(() => router.replace("/(app)/dashboard"))
      .catch((err: AxiosError) => {
        setLoggingIn(false);
      });
    setLoggingIn(false);
  };

  return (
    <ViewContainer>
      <Input
        // style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="E-Mail"
        mx="5"
        mb={3}
      />
      <Input
        // style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        mx="5"
        mb={3}
      />
      <Button
        isLoading={loggingIn}
        isLoadingText="Logging in..."
        onPress={login}
      >
        Login
      </Button>
    </ViewContainer>
  );
}
