import FormComponent from "../components/Forms/FormComponent";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import ViewContainer from "../components/ViewContainer";

export default function CreateModalScreen<T>() {
  const navigator = useNavigation();
  const params = useLocalSearchParams();

  return (
    <ViewContainer>
      <Stack.Screen
        options={{
          title: (params.headerLabel ?? params.editHeaderLabel) as string,
        }}
      />
      <FormComponent<T>
        prependURI={params.prependURI as string}
        onSuccess={(data) => {
          navigator.goBack();
        }}
        updatePath={{ id: (params.entityId ?? "") as string }}
        entity={params.entity as string}
      />
    </ViewContainer>
  );
}
