import { Stack, useLocalSearchParams } from "expo-router";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { useEffect, useState } from "react";
import {
  AppOptionsType,
  AppType,
} from "../../../interfaces/EntityTypes/AppType";
import { HostingType } from "../../../interfaces/EntityTypes/WebsiteOptionsType";
import { ProjectStateType } from "../../../interfaces/EntityTypes/ProjectStateType";
import { http_methods } from "../../../functions/HTTPMethods";
import { AppRoleType } from "../../../interfaces/EntityTypes/AppRoleType";
import { DynamicallyFilledObject } from "../../../interfaces/DefaultTypes";
import {
  Alert,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "native-base";
import ViewContainer from "../../../components/ViewContainer";
import Loader from "../../../components/Loader";
import { UserType } from "../../../interfaces/EntityTypes/UserType";
import { H2, H3, Text } from "../../../components/Themed";
import CommonList from "../../../components/Lists/CommonList";
import { filterOutItem } from "../../../functions/Collections";
import ActionAlert from "../../../components/Alerts/Alert";
// import { useNotificationsContext } from "../../../contexts/NotificationsContext";

export default function App() {
  const { appData } = useAppDataContext();
  // const { addNotification } = useNotificationsContext();
  const params = useLocalSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [app, setApp] = useState<AppType>();
  const [users, setUsers] = useState<UserType[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<UserType[]>([]);
  const [defaultRoleId, setDefaultRoleId] = useState("");
  const [appName, setAppName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");
  const [appRolesList, setAppRolesList] = useState<AppRoleType[]>([]);
  const [emailInvitationPopup, setEmailInvitationPopup] =
    useState<boolean>(false);
  const [hostingsList, setHostingsList] = useState<HostingType[]>([]);
  const [newHosting, setNewHosting] = useState<string>("");
  const [projectStatesList, setProjectStatesList] = useState<
    ProjectStateType[]
  >([]);
  const [newProjectState, setNewProjectState] = useState<string>("");

  useEffect(() => {
    http_methods
      .fetch<AppOptionsType>(`/apps/${params.id}/options`)
      .then((data) => {
        setAppRolesList(data.roles);
        setUsers(data.users);
        setInvitedUsers(data.invitedUsers);
        setApp(data.app);
        setHostingsList(data.app.websiteOptions.hostings);
        setDefaultRoleId(data.app.defaultRoleId);
        setProjectStatesList(
          data.app.projectStates.sort((el1, el2) =>
            el1.position > el2.position ? 1 : 0
          )
        );
        setAppName(data.app.name);
        setLoaded(true);
      })
      .catch((err: Error) => {
        //   addNotification({ text: "test" });
      });
  }, []);

  const createNewRole = () => {
    http_methods
      .post<AppRoleType>(`/app-roles`, {
        name: newRole,
        appId: params.id as string,
      })
      .then((role) => {
        setAppRolesList([...appRolesList, role]);
        setNewRole("");
      })
      .catch((err: Error) => {
        // addNotification({ text: JSON.parse(err.message).name });
      });
  };

  const sendInvitation = async () => {
    await http_methods
      .post<DynamicallyFilledObject<string>>(`/apps/${params.id}/invite`, {
        userEmail: newUser,
      })
      .then((res) => {
        //   addNotification({
        //     text: res.message,
        //     notificationProps: { type: "success" },
        //   });
        setInvitedUsers([...invitedUsers, res.user] as UserType[]);
      })
      .catch((res) => {
        setEmailInvitationPopup(true);
      });
  };

  // const updateAppName = (newAppName: string) => {
  //   http_methods
  //     .put<AppType>(`/apps/${app.id}`, { name: newAppName })
  //     .then((appData) => {
  //       setApp(appData);
  //     });
  // };

  // const updateUserAppRole = (appRoleId: number, user: UserType) => {
  //   http_methods
  //     .put<UserType>(`/apps/${params.id}/updateUserRole`, {
  //       appRoleId: appRoleId.toString(),
  //       userId: user.id,
  //     })
  //     .then((user) => {
  //       let newUsers = users.filter((u) => u.id != user.id);
  //       setUsers([...newUsers, user]);
  //     });
  // };

  const userAdditionalInfo = (user: UserType) => {
    const userIsActive = users.find((u: UserType) => u.id == user.id)
      ? true
      : false;

    return userIsActive ? (
      <Text>Role: {user.appRole.name}</Text>
    ) : (
      <Text>Invitation pending...</Text>
    );

    // <Box>
    //   {userIsActive ? (
    //         <SelectPicker
    //           size="sm"
    //           searchable={false}
    //           value={user.appRole.id}
    //           cleanable={false}
    //           data={appRolesList.map((appRole) => {
    //             return { value: appRole.id, label: appRole.name };
    //           })}
    //           disabled={
    //             (user.appRole.isOwnerRole && user.id == app?.ownerId) ||
    //             !app?.currentUserRole.permissions.apps.hasOptions
    //           }
    //           label={
    //             <>
    //               <FontAwesomeIcon icon={faUserTie} /> User role
    //             </>
    //           }
    //           onChange={(val) => updateUserAppRole(val, user)}
    //         />
    //       ) : (
    //         <>
    //           <FontAwesomeIcon icon={faClockFour} /> Pending...
    //         </>
    //       )}
    // </Box>
  };

  const appRoleAdditionalInfo = (item: AppRoleType) => {
    return (
      <Box>
        {/* <HoverTooltip text="Check to set as default role for new users">
              <FontAwesomeIcon icon={faCreativeCommonsBy} />{" "}
              <Radio
                checked={item.id == defaultRoleId}
                disabled={!app?.currentUserRole?.permissions?.apps?.hasOptions}
                onClick={() => {
                  if (app?.currentUserRole?.permissions?.apps?.hasOptions) {
                    http_methods
                      .put<AppType>(`/apps/${params.id}/updateDefaultRole`, {
                        defaultRoleId: item.id,
                      })
                      .then((data) => {
                        setDefaultRoleId(data.defaultRoleId);
                      });
                  }
                }}
              />
            </HoverTooltip> */}
      </Box>
    );
  };

  const addHosting = (name: string) => {
    //   http_methods
    //     .post<HostingType>(`/apps/hostings`, {
    //       name,
    //       appId: app.id,
    //     })
    //     .then((hoster) => setHostingsList([...hostingsList, hoster]));
  };

  const addProjectState = (name: string) => {
    //   http_methods
    //     .post<ProjectStateType>(`/apps/${app.id}/projectState`, {
    //       name,
    //     })
    //     .then((projectState) => {
    //       setProjectStatesList(
    //         [...projectStatesList, projectState].sort((el1, el2) =>
    //           el1.position > el2.position ? 1 : 0
    //         )
    //       );
    //     })
    //     .then(() => {
    //       updateProjectStatePositions();
    //     });
  };

  const updateProjectStatePositions = () => {
    //   http_methods
    //     .put<ProjectStateType[]>(
    //       `/apps/${app.id}/updateProjectStatesPosition`,
    //       projectStatesList.map((el, index) => ({ ...el, position: index }))
    //     )
    //     .then((res) =>
    //       setProjectStatesList(
    //         res.sort((el1, el2) => (el1.position > el2.position ? 1 : 0))
    //       )
    //     );
  };

  const handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) =>
    setProjectStatesList((prvData) => {
      const moveData = prvData.splice(oldIndex, 1);
      const newData = [...prvData];
      newData.splice(newIndex, 0, moveData[0]);
      return newData;
    });

  return (
    <ViewContainer>
      <Stack.Screen options={{ title: app?.name ?? "App" }} />
      <Loader loaded={loaded}>
        <H2>{app?.name} options</H2>
        {/* <InputButtonGroup
            buttonText="Update app name"
            label="App name: "
            value={appName}
            onSubmit={updateAppName}
            onChange={setAppName}
          /> */}
        <H3>Users</H3>
        <CommonList<UserType>
          entity="user"
          onEmpty=""
          sortingItems={[
            { label: "Name", value: "name" },
            { label: "Role", value: ["appRole", "name"] },
          ]}
          sortingDefaults={{ field: "name" }}
          label={(user) => user.name}
          items={[...users, ...invitedUsers]}
          // inViewBacklink={`/apps/${params.id}/options`}
          createHeaderLabel=""
          editHeaderLabel=""
          prependURI={`/apps/${params.id}`}
          buttons={{
            deleteable: (item: UserType) => app?.ownerId != item.id,
            // hasOptions: (item: UserType) =>
            //   !invitedUsers.find((u) => u.id == item.id),
            hasOptions: false,
            hasView: false,
          }}
          onDelete={(item) => {
            if (users.find((u) => u.id == item.id)) {
              let newUsers = filterOutItem(users, item);
              setUsers(newUsers);
              // addNotification({
              //   text: `User ${item.name} was removed from App.`,
              //   notificationProps: { type: "success" },
              // });
            } else {
              let newUsers = filterOutItem(invitedUsers, item);
              setInvitedUsers(newUsers);
              // addNotification({
              //   text: `Invitation for ${item.name} was revoked.`,
              //   notificationProps: { type: "success" },
              // });
            }
          }}
          additionalInfo={userAdditionalInfo}
        />
        {app?.currentUserRole?.permissions?.apps?.hasOptions && (
          // <InputButtonGroup
          //   label="Invite user: "
          //   value={newUser}
          //   buttonText="Send Invitation"
          //   onSubmit={sendInvitation}
          //   onChange={setNewUser}
          // />
          <Box display={"flex"} w={"100%"} mx={"auto"} my={4}>
            <InputGroup flexGrow={1} flex={1}>
              {/* <InputLeftAddon children={"New User:"} /> */}
              <Input
                display={"flex"}
                flexGrow={1}
                value={newUser}
                onChangeText={setNewUser}
                placeholder="user@email.com"
              />
              <InputRightAddon>
                <Button onPress={sendInvitation}>Invite</Button>
              </InputRightAddon>
            </InputGroup>
          </Box>
        )}
        <ActionAlert
          setIsOpen={() => {
            setEmailInvitationPopup(false);
          }}
          isOpen={emailInvitationPopup}
          status={"warning"}
        >
          E-Mail not found. Please enter correct E-Mail.
        </ActionAlert>
        {/*
          <h3>Webite options</h3>
          <FluidText>Possible hostings for websites:</FluidText>
          <CommonList<HostingType>
            // emptyCollectiontext="There are no hostings specified for websites"
            // itemsList={hostingsList}
            onEmpty="There are no hostings, you can add one."
            onDelete={(hosting) => {
              let newPS = projectStatesList.filter((h) => h.id != hosting.id);
              addNotification({
                text: `Project state ${hosting.name} was deleted.`,
                notificationProps: {
                  type: "success",
                },
              });
              setProjectStatesList(newPS);
            }}
            entity="hostings"
            editableLabel
            linkPrepend={`/apps/${app?.id}/`}
            items={hostingsList}
            label={(item) => item.name}
            buttons={{
              hasView: false,
              hasOptions: false,
              deleteable: app?.currentUserRole?.permissions.apps.deleteable,
            }}
          />
          {app?.currentUserRole?.permissions?.apps?.hasOptions && (
            <InputButtonGroup
              buttonText="Add"
              label="New hosting name"
              onSubmit={addHosting}
              value={newHosting}
              onChange={setNewHosting}
            />
          )}
  
          <h3>Project options</h3>
          <FluidText>Project states:</FluidText>
          <CommonList<ProjectStateType>
            sortable={!!app?.currentUserRole?.permissions?.apps?.hasOptions}
            onSort={handleSortEnd}
            onEmpty="There are no project states yet. Create one."
            editableLabel
            onDelete={(projectState) => {
              let newPS = projectStatesList.filter(
                (ps) => ps.id != projectState.id
              );
              addNotification({
                text: `Project state ${projectState.name} was deleted.`,
                notificationProps: {
                  type: "success",
                },
              });
              setProjectStatesList(newPS);
            }}
            entity="projectStates"
            linkPrepend={`/apps/${app?.id}/`}
            items={projectStatesList}
            label={(item) => item.name}
            buttons={{
              hasView: false,
              hasOptions: false,
              deleteable: app?.currentUserRole?.permissions.apps.deleteable,
            }}
          />
  
          {app?.currentUserRole?.permissions?.apps?.hasOptions && (
            <>
              {projectStatesList && (
                <Button
                  onClick={updateProjectStatePositions}
                  disabled={projectStatesList.length == 0}
                >
                  Update positions
                </Button>
              )}
              <InputButtonGroup
                buttonText="Add"
                label="New project state"
                onSubmit={addProjectState}
                value={newProjectState}
                onChange={setNewProjectState}
              />
            </>
          )}*/}
      </Loader>
    </ViewContainer>
  );
}
