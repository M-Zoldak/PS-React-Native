import ViewContainer from "../components/ViewContainer";
import { useLocalSearchParams } from "expo-router";
import Project from "./(app)/projects/project";
import Client from "./(app)/client/client";
import App from "./(app)/app/app";

export default function ModalScreen() {
  const params = useLocalSearchParams();

  const loadEntityPage = (entity: string) => {
    switch (entity) {
      case Project.name.toLowerCase() + "s": {
        return (
          <ViewContainer>
            <Project />
          </ViewContainer>
        );
      }
      case Client.name.toLowerCase() + "s": {
        return (
          <ViewContainer>
            <Client />
          </ViewContainer>
        );
      }
      case App.name.toLowerCase() + "s": {
        return (
          <ViewContainer>
            <App />
          </ViewContainer>
        );
      }
      default: {
        console.log("none");
      }
    }
  };

  return loadEntityPage(params.entity as string);
}
