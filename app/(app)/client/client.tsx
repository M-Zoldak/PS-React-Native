import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ClientType } from "../../../interfaces/EntityTypes/ClientType";
import { http_methods } from "../../../functions/HTTPMethods";
import ViewContainer from "../../../components/ViewContainer";
import EntityStandardSublist from "../../../components/Lists/EntitySubList";
import { useIsFocused } from "@react-navigation/native";
import { Box, Divider } from "native-base";
import CommonList from "../../../components/Lists/CommonList";
import { AddressType } from "../../../interfaces/EntityTypes/AddressType";
import AppDataProvider, {
  useAppDataContext,
} from "../../../contexts/AppDataContext";
import { H2, Text } from "../../../components/Themed";
import { ContactPersonType } from "../../../interfaces/EntityTypes/ContactPersonType";
import Loader from "../../../components/Loader";

export default function Client() {
  const params = useLocalSearchParams();
  const [client, setClient] = useState<ClientType>();
  const isFocused = useIsFocused();
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    http_methods
      .fetch<ClientType>(`/clients/${params.id}`)
      .then(setClient)
      .then(() => setLoaded(true));
  }, [isFocused]);
  // console.log(client);

  return (
    <Loader loaded={loaded}>
      <Box>
        <Stack.Screen options={{ title: client?.name ?? "loading..." }} />
        {client && (
          <EntityStandardSublist
            mainTitle={`${client.name}`}
            items={[
              {
                items: client,
                subtitle: "Quick contact",
                textBlocks: [
                  {
                    name: "Mobile number",
                    value: client?.mobile ?? "No mobile number",
                  },
                  {
                    name: "Phone number",
                    value: client?.phone ?? "No phone number",
                  },
                  {
                    name: "Fax",
                    value: client?.fax ?? "No Fax number set",
                  },
                ],
              },
            ]}
          />
        )}

        <Divider style={{ marginTop: 8 }} />
        <H2>Addresses</H2>
        <CommonList<AddressType>
          entity="addresses"
          editHeaderLabel="Address options"
          items={client?.addresses ?? []}
          label={(address) => address.city}
          onDelete={() => {}}
          onEmpty="No items"
          creatable={true}
          creatableAsButton={true}
          createHeaderLabel="New address"
          prependURI={`/clients/${client?.id}`}
          buttons={{
            deleteable:
              appData.currentUser?.currentAppRole.permissions.clients
                ?.hasOptions,
            hasOptions:
              appData.currentUser?.currentAppRole.permissions.clients
                ?.hasOptions,
            // hasView:
            //   appData.currentUser?.currentAppRole.permissions.clients?.hasView,
          }}
          additionalInfo={(address) => (
            <>
              <Text>Country: {address.country}</Text>
              <Text>City: {address.city}</Text>
              <Text>Postal: {address.postal}</Text>
              <Text>Street: {address.street}</Text>
            </>
          )}
        />

        <Divider style={{ marginTop: 8 }} />
        <H2>Employees</H2>
        <CommonList<ContactPersonType>
          entity="contacts"
          editHeaderLabel="Contact options"
          items={client?.employees ?? []}
          label={(client) => client.firstName + " " + client.lastName}
          onDelete={() => {}}
          onEmpty="No items"
          additionalInfo={(client) => (
            <>
              <Text>Role: {client.role}</Text>
              <Text>Phone: {client.phone}</Text>
              <Text>Mobile: {client.mobile}</Text>
            </>
          )}
          creatable={true}
          creatableAsButton={true}
          createHeaderLabel={"New contact"}
          prependURI={`/clients/${client?.id}`}
          buttons={{
            deleteable:
              appData.currentUser?.currentAppRole.permissions.clients
                ?.hasOptions,
            hasOptions:
              appData.currentUser?.currentAppRole.permissions.clients
                ?.hasOptions,
            // hasView:
            //   appData.currentUser?.currentAppRole.permissions.clients?.hasView,
          }}
        />
      </Box>
    </Loader>
  );
}
