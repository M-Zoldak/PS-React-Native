import { useLocalSearchParams } from "expo-router";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { useEffect, useState } from "react";
import { ContactPersonType } from "../../../interfaces/EntityTypes/ContactPersonType";
import { http_methods } from "../../../functions/HTTPMethods";
import ViewContainer from "../../../components/ViewContainer";
import FormComponent from "../../../components/Forms/FormComponent";

export default function ContactOptions() {
  const { appData } = useAppDataContext();
  // const { addNotification } = useNotificationsContext();
  const params = useLocalSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [contact, setContact] = useState<ContactPersonType>();

  useEffect(() => {
    http_methods
      .fetch<ContactPersonType>(
        `/clients/${params.id}/contacts/${params.contactId}`
      )
      .then((data) => {
        setContact(data);
      })
      .catch((err: Error) => {
        // addNotification({ text: "test" });
      });
    setLoaded(true);
  }, []);

  //   const updateClientName = () => {
  // http_methods
  //   .put<ContactPersonType>(
  //     `/clients/${client.id}`,
  //     { name: clientName }
  //   )
  //   .then((clientData) => {
  //     setClient(clientData);
  //   });
  //   };

  // const userAdditionalInfo = (user: UserType) => {
  //   const userIsActive = users.find((i) => i.id == user.id) ? true : false;

  //   return (
  //     <FlexboxGrid>
  //       <FlexboxGridItem>
  //         {userIsActive ? (
  //           <HoverTooltip text="User role">
  //             <FontAwesomeIcon icon={faUserTie} /> {user.clientRole.name}
  //           </HoverTooltip>
  //         ) : (
  //           <>
  //             <FontAwesomeIcon icon={faClockFour} /> Pending...
  //           </>
  //         )}
  //       </FlexboxGridItem>
  //     </FlexboxGrid>
  //   );
  // };

  // const clientRoleAdditionalInfo = (item: ClientRoleType) => {
  //   return (
  //     <FlexboxGrid align="middle">
  //       <FlexboxGridItem>
  //         <HoverTooltip text="Check to set as default role for new users">
  //           <FontAwesomeIcon icon={faCreativeCommonsBy} />{" "}
  //           <Radio
  //             checked={item.id == defaultRoleId}
  //             onClick={() => {
  //               http_methods
  //                 .put<ContactPersonType>(
  //                   `/clients/${params.id}/updateDefaultRole`,
  //                   {
  //                     defaultRoleId: item.id,
  //                   },
  //                   clientData.token
  //                 )
  //                 .then((data) => {
  //                   setDefaultRoleId(data.defaultRoleId);
  //                 });
  //             }}
  //           />
  //         </HoverTooltip>
  //       </FlexboxGridItem>
  //     </FlexboxGrid>
  //   );
  // };

  return (
    <ViewContainer
    // title={contact ? `Contact options` : "Loading..."}
    // activePage="Clients"
    >
      {/* <Backlink link={`/clients/${params.id}/options`} /> */}

      {/* <ContentLoader loaded={loaded}> */}
      {/* <MainTitle>
          {contact && `${contact?.firstName} ${contact?.lastName} options`}
        </MainTitle> */}

      <FormComponent<ContactPersonType>
        entity="contacts"
        prependURI={`/clients/${params.id}`}
        updatePath={{ id: params.contactId as string }}
        onSuccess={(contact) => {
          setContact(contact);
          // addNotification({
          //   text: `Customer was succesfully updated.`,
          //   notificationProps: { type: "success" },
          // });
        }}
      />
      {/* </ContentLoader> */}
    </ViewContainer>
  );
}
