import { useEffect, useState } from "react";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { WebsiteType } from "../../../interfaces/EntityTypes/WebsiteType";
import { http_methods } from "../../../functions/HTTPMethods";
import { Box, Icon, Link } from "native-base";
import ViewContainer from "../../../components/ViewContainer";
import CommonList from "../../../components/Lists/CommonList";
import { Text } from "../../../components/Themed";
import { Fab } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { setParams } from "expo-router/src/global-state/routing";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../../../components/Loader";

export default function WebsitesList() {
  const isFocused = useIsFocused();
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  // const { addNotification } = useNotificationsContext();
  const [websites, setWebsites] = useState<WebsiteType[]>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetch<WebsiteType[]>(`/websites`)
      .then((data) => {
        console.log(data);
        setWebsites(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        console.log(err.message);
        // addNotification({ text: err.message });
      });
  }, [appData, isFocused]);

  const websiteAdditionalInfo = (website: WebsiteType) => {
    return (
      <Box>
        {/* <FlexboxGridItem> */}
        {/* <FontAwesomeIcon icon={faPerson} /> Client:{" "} */}
        <Text>{website?.client?.name ?? "No client"}</Text>
        {/* </FlexboxGridItem> */}
        {/* <FlexboxGridItem> */}
        {/* <FontAwesomeIcon icon={faBuilding} /> Hosting:{" "} */}
        <Text>{website?.hosting?.name ?? "No hosting"}</Text>
        {/* </FlexboxGridItem> */}
      </Box>
    );
  };

  // console.log(appData.currentUser?.currentAppRole.permissions.websites);
  return (
    <ViewContainer>
      <Loader loaded={loaded}>
        {websites && (
          <CommonList<WebsiteType>
            createHeaderLabel="New website"
            editHeaderLabel="Website options"
            onEmpty="You don't have any websites yet. Add one now!"
            items={websites}
            searchProp="domain"
            label={(website) => (
              <Link
                href={
                  new URL("/", `https://www.${website.domain.toLowerCase()}/`)
                    .href
                }
              >
                {website.domain}{" "}
              </Link>
            )}
            entity="websites"
            onDelete={(item) => {
              let newWebsites = websites.filter(
                (website) => website.id != item.id
              );
              setWebsites(newWebsites);
              // addNotification({
              //   text: `Website ${item.domain} was deleted succesfully`,
              //   notificationProps: { type: "success" },
              // });
            }}
            creatable={true}
            buttons={{
              deleteable:
                appData?.currentUser?.currentAppRole?.permissions?.websites
                  ?.deleteable,
              hasOptions:
                appData?.currentUser?.currentAppRole?.permissions?.websites
                  ?.hasOptions,
              hasView:
                false &&
                appData?.currentUser?.currentAppRole?.permissions?.websites
                  ?.hasView,
            }}
            additionalInfo={websiteAdditionalInfo}
          />
        )}
      </Loader>
    </ViewContainer>
  );
}
