import { Spinner } from "native-base";
import { PropsWithChildren } from "react";
import { View } from "./Themed";

type LoaderOptions = PropsWithChildren<{
  loaded: boolean;
}>;

export default function Loader({ children, loaded }: LoaderOptions) {
  return loaded ? (
    children
  ) : (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        display: "flex",
        alignContent: "center",
      }}
    >
      <Spinner accessibilityLabel="Loading..." size={"lg"} />
    </View>
  );
}
