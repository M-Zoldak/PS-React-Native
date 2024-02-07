import { useEffect, useState } from "react";
import { http_methods } from "../../../functions/HTTPMethods";
import { AppType } from "../../../interfaces/EntityTypes/AppType";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import ViewContainer from "../../../components/ViewContainer";
import CommonList from "../../../components/Lists/CommonList";
import { Button } from "native-base";
import { H2, Text } from "../../../components/Themed";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../../../components/Loader";
import { Ionicons } from "@expo/vector-icons";

export default function AppsList() {
  const isFocused = useIsFocused();
  const { appData, updateApps, refreshAppData } = useAppDataContext();
  // const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  // const { addNotification } = useNotificationsContext();
  const [appsInvitations, setAppsInvitations] = useState<AppType[]>([]);

  useEffect(() => {
    setLoaded(false);

    http_methods
      .fetch<{ apps: AppType[]; appsInvitations: AppType[] }>("/apps")
      .then(async (data) => {
        setLoaded(true);
        setAppsInvitations(
          data.appsInvitations.length ? data.appsInvitations : []
        );
      })
      .catch((err: Error) => {
        // addNotification({ text: err.message });
      });

    refreshAppData();
  }, [isFocused]);

  const handleDelete = (item: AppType) => {
    let apps = appData?.apps?.filter((app) => app.id != item.id);
    updateApps(apps ?? []);
  };

  const appAdditionalInfo = (item: AppType) => {
    return (
      <>
        <Text>Users count: {item.statistics.usersCount}</Text>
      </>
    );
  };

  const acceptInvitation = (item: AppType) => {
    http_methods
      .post<AppType>(`/apps/${item.id}/invite/accept`, null)
      .then(async (res) => {
        setAppsInvitations(appsInvitations.filter((inv) => inv.id != item.id));
        updateApps([...(appData?.apps ?? []), res]);
      });
  };

  return (
    <ViewContainer>
      <Loader loaded={loaded}>
        <H2>Active Spaces</H2>
        {appData?.apps && (
          <CommonList<AppType>
            onEmpty="You don't have any apps yet. Create one now or join someone other
            space!"
            createHeaderLabel="New app"
            editHeaderLabel="App options"
            items={appData.apps}
            entity="apps"
            label={(app) => (
              <Text>
                {app.name}
                {appData.currentUser?.userOptions.selectedAppId == app.id ? (
                  <Ionicons
                    style={{ marginLeft: "auto" }}
                    size={22}
                    name={"checkmark"}
                  />
                ) : (
                  ""
                )}
              </Text>
            )}
            onDelete={handleDelete}
            creatable={true}
            buttons={{
              hasView: true,
              deleteable: (item: AppType) =>
                appData?.currentUser?.id.toString() == item.ownerId,
              hasOptions: false,
            }}
            additionalInfo={appAdditionalInfo}
          />
        )}

        {appsInvitations?.length > 0 && (
          <>
            <H2>Invitations to spaces</H2>
            <CommonList<AppType>
              onEmpty="Currently there are no invitations"
              items={appsInvitations}
              createHeaderLabel=""
              editHeaderLabel=""
              entity="apps"
              label={(app) => app.name}
              onDelete={handleDelete}
              ownButtons={(item: AppType) => (
                <Button
                  size="sm"
                  color="cyan"
                  onPress={() => acceptInvitation(item)}
                >
                  Join space
                </Button>
              )}
              additionalInfo={appAdditionalInfo}
            />
          </>
        )}
      </Loader>
    </ViewContainer>
  );
}
