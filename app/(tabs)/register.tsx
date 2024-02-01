import { StyleSheet } from "react-native";

import { useState } from "react";
import { Text, View } from "../../components/Themed";
import { Box, Button, HStack, Input } from "native-base";
import * as SecureStore from "expo-secure-store";
import FormComponent from "../../components/Forms/FormComponent";
import ViewContainer from "../../components/ViewContainer";

export default function RegisterScreen() {
  const handleSuccess = (successData: any) => {};

  return (
    <ViewContainer>
      {/* <HStack justifyContent={"center"}> */}
      <FormComponent entity="register" onSuccess={handleSuccess} />
      {/* </HStack> */}
    </ViewContainer>
  );
}
