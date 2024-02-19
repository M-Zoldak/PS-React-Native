import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { ILinearGradientProps } from "native-base/lib/typescript/components/primitives/Box/types";
import {
  ColorType,
  ResponsiveValue,
} from "native-base/lib/typescript/components/types";

export default function ThemedBox({
  title,
  value,
  bg,
}: {
  title: string;
  value: string;
  bg: ResponsiveValue<ColorType | ILinearGradientProps>;
}) {
  return (
    <Box
      bg={bg}
      py="4"
      px="3"
      borderRadius="5"
      rounded="md"
      width={"100%"}
      maxWidth="100%"
      marginBottom={"2"}
    >
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text fontSize="sm" color="white">
              {title}
            </Text>
            <Text color="white" fontSize="xl">
              {value}
            </Text>
          </VStack>
          {/* <Pressable
            rounded="xs"
            bg="primary.400"
            alignSelf="flex-start"
            py="1"
            px="3"
          >
            <Text
              textTransform="uppercase"
              fontSize="sm"
              fontWeight="bold"
              color="white"
            >
              Remind me
            </Text>
          </Pressable> */}
        </Box>
        {/* <Image
          source={{
            uri: "https://media.vanityfair.com/photos/5ba12e6d42b9d16f4545aa19/3:2/w_1998,h_1332,c_limit/t-Avatar-The-Last-Airbender-Live-Action.jpg",
          }}
          alt="Aang flying and surrounded by clouds"
          height="100"
          rounded="full"
          width="100"
        /> */}
      </HStack>
    </Box>
  );
}
