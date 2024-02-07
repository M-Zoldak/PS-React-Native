import {
  Alert,
  CloseIcon,
  HStack,
  IconButton,
  Text,
  VStack,
} from "native-base";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

export default function ActionAlert({
  status,
  isOpen,
  setIsOpen,
  children,
}: PropsWithChildren<{
  status: (string & {}) | "error" | "success" | "warning" | "info" | undefined;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>) {
  return (
    <Alert
      //   w="100%"
      display={isOpen ? "flex" : "none"}
      status={status}
      position={"absolute"}
      bottom={0}
      right={0}
      left={0}
    >
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="sm" color="coolGray.800">
              {children}
            </Text>
          </HStack>
          <IconButton
            onPress={() => setIsOpen(false)}
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" />}
            _icon={{
              color: "coolGray.600",
            }}
          />
        </HStack>
      </VStack>
    </Alert>
  );
}
