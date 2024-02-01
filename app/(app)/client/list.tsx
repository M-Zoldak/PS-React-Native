import { useEffect, useState } from "react";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { ClientType } from "../../../interfaces/EntityTypes/ClientType";
import { http_methods } from "../../../functions/HTTPMethods";
import ViewContainer from "../../../components/ViewContainer";
import CommonList from "../../../components/Lists/CommonList";
import { H2, Text } from "../../../components/Themed";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../../../components/Loader";

export default function ClientsList() {
  const isFocused = useIsFocused();
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  // const { addNotification } = useNotificationsContext();
  const [clients, setClients] = useState<ClientType[]>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetch<ClientType[]>(`/clients`)
      .then((data) => {
        setClients(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        // addNotification({ text: err.message });
      });
  }, [appData, isFocused]);

  return (
    <ViewContainer>
      <Loader loaded={loaded}>
        {clients && (
          <CommonList<ClientType>
            createHeaderLabel="New contact"
            editHeaderLabel="Contact options"
            creatable
            onEmpty="You don't have any clients yet. Create one now!"
            items={clients}
            label={(client) => client.name}
            entity="clients"
            search={{
              value: "name",
              label: "Client name",
            }}
            onDelete={(item) => {
              let newClients = clients.filter((client) => client.id != item.id);
              setClients(newClients);
            }}
            buttons={{
              deleteable:
                appData?.currentUser?.currentAppRole?.permissions?.clients
                  ?.deleteable,
              hasOptions:
                appData?.currentUser?.currentAppRole?.permissions?.clients
                  ?.hasOptions,
              hasView:
                appData?.currentUser?.currentAppRole?.permissions?.clients
                  ?.hasView,
            }}
            additionalInfo={(client) => (
              <>
                <Text>Mobile: {client.mobile}</Text>
                <Text>Phone: {client.phone}</Text>
                <Text>Fax: {client.fax}</Text>
              </>
            )}
          />
        )}
      </Loader>
    </ViewContainer>
  );
}
