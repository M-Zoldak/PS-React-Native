import { useLocalSearchParams } from "expo-router";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { useEffect, useState } from "react";
import { AddressType } from "../../../interfaces/EntityTypes/AddressType";
import { http_methods } from "../../../functions/HTTPMethods";
import { ViewComponent } from "react-native";
import FormComponent from "../../../components/Forms/FormComponent";
import Loader from "../../../components/Loader";

export default function AddressOptions() {
  const { appData } = useAppDataContext();
  //   const { addNotification } = useNotificationsContext();
  const params = useLocalSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState<AddressType>();

  useEffect(() => {
    http_methods
      .fetch<AddressType>(`/clients/${params.id}/addresses/${params.addressId}`)
      .then((data) => {
        setAddress(data);
      })
      .catch((err: Error) => {
        // addNotification({ text: "test" });
      });
    setLoaded(true);
  }, []);

  return (
    <ViewComponent>
      <Loader loaded={loaded}>
        {/* <MainTitle>
          {address &&
            `[${address.postal}] ${address.city} ${address.street} options`}
        </MainTitle> */}

        <FormComponent<AddressType>
          entity="addresses"
          prependURI={`/clients/${params.id}`}
          updatePath={{ id: params.addressId as string }}
          onSuccess={(address) => {
            setAddress(address);
            // addNotification({
            //   text: `Address was succesfully updated.`,
            //   notificationProps: { type: "success" },
            // });
          }}
        />
      </Loader>
    </ViewComponent>
  );
}
