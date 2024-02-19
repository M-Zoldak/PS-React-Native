import { useEffect, useState } from "react";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { AppType } from "../../../interfaces/EntityTypes/AppType";
import { ProjectType } from "../../../interfaces/EntityTypes/ProjectType";
import { TaskType } from "../../../interfaces/EntityTypes/TaskType";
import { SelectDataType } from "../../../interfaces/DefaultTypes";
import { http_methods } from "../../../functions/HTTPMethods";
import ViewContainer from "../../../components/ViewContainer";
import { H1, H2, H3, Text } from "../../../components/Themed";
import { Box, Pressable } from "native-base";
import CommonList from "../../../components/Lists/CommonList";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../../../components/Loader";
import Notes from "../../../components/Notes";
import { ProjectStateType } from "../../../interfaces/EntityTypes/ProjectStateType";
import { Ionicons } from "@expo/vector-icons";

export default function Project() {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const [loaded, setLoaded] = useState(false);
  // const [cookies] = useCookies();
  const { appData } = useAppDataContext();
  // const { addNotification } = useNotificationsContext();
  const [app, setApp] = useState<AppType>();
  // const [stepsWidth, setStepsWitdh] = useState(500);
  const [project, setProject] = useState<ProjectType>();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [clientsSelect, setClientsSelect] = useState<SelectDataType[]>([]);
  const [websitesSelect, setWebsitesSelect] = useState<SelectDataType[]>([]);

  useEffect(() => {
    http_methods
      .fetch<ProjectType>(`/projects/${params.id}`)
      .then(({ project, clientsSelect, websitesSelect }) => {
        setProject(project);
        setTasks(project.tasks);
        setClientsSelect(clientsSelect);
        setWebsitesSelect(websitesSelect);
        let app = appData?.apps?.find(
          (app) => app.id == appData?.currentUser?.userOptions.selectedAppId
        );
        setApp(app);
      })
      .then(() => setLoaded(true));
  }, [isFocused]);

  const updateProjectClient = (clientId: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project?.id}/updateClient`, {
        clientId,
      })
      .then((proj) => setProject({ ...proj }));
  };

  const updateProjectWebsite = (websiteId: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project?.id}/updateWebsite`, {
        websiteId,
      })
      .then((proj) => setProject({ ...proj }));
  };

  const setProjectState = (id: string) => {
    http_methods
      .put<ProjectType>(`/projects/${project?.id}/updateState/${id}`, [])
      .then((project) => setProject(project));
  };

  return (
    <ViewContainer style={{ backgroundColor: "blue" }}>
      <Loader loaded={loaded}></Loader>
      <Stack.Screen options={{ title: project?.name ?? "project" }} />
      {/* <Grid fluid={true} style={{ width: "100%" }}>
        <Row>
          <Box style={{ width: "100%" }}>
            <ButtonToolbar style={{ marginBottom: "20px" }}>
              <SimpleCreateModal<TaskType>
                entity="tasks"
                prependURI={`/projects/${params.id}`}
                buttonText="Create new Task"
                title="Create new task"
                onSuccess={(task) => {
                  setTasks([...tasks, task]);
                  addNotification({
                    text: `Task ${task.name} was created succesfully!`,
                    notificationProps: { type: "success" },
                  });
                }}
              /> */}
      {/* <Button
                appearance="ghost"
                color="red"
                startIcon={<FontAwesomeIcon icon={faFilePdf} />}
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  let token = cookies.token;
                  if (!token) return;
                  fetch(`/api/projects/${params.id}/toPDF`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then((res) => res.blob())
                    .then((blob) => {
                      var url = window.URL.createObjectURL(blob);
                      var a = document.createElement("a");
                      a.href = url;
                      a.download = `${project.name}`;
                      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                      a.click();
                      a.remove();
                    });
                }}
              >
                Generate PDF
              </Button> */}
      {/* </ButtonToolbar> */}
      {/* {app?.projectStates.length > 0 && (
              <Steps
                // TODO make steps horizontal on smaller screens
                // vertical={stepsWidth < 700}
                style={{
                  cursor: "pointer",
                  // marginTop: "20px",
                  padding: "20px 0",
                  // border: "1px solid grey",
                  minWidth: `700px`,

                  width: "90%",
                }}
                current={project?.projectState?.position ?? 0}
              >
                {app?.projectStates
                  ?.sort((i, i2) => (i.position > i2.position ? 1 : 0))
                  .map((state, index) => {
                    return (
                      <Steps.Item
                        key={index}
                        title={state.name}
                        onClick={() => setProjectState(state.id)}
                      />
                    );
                  })}
              </Steps>
            )} */}
      {/* </Col> */}
      {/* </Row> */}
      {/* <Row gutter={30}> */}
      {/* <Box style={{ width: "70%" }}> */}
      <Box mb={8}>
        <H3>{project ? "Project informations" : ""}</H3>
        <Text>
          {project?.startDate
            ? `Start date: ${new Date(
                project?.startDate.date
              ).toLocaleDateString("pl")}`
            : ""}
        </Text>
        <Text>
          {project?.endDate
            ? `End date: ${new Date(project?.endDate.date).toLocaleDateString(
                "pl"
              )}`
            : ""}
        </Text>
        <Text>{project?.client ? `Client: ${project?.client.name}` : ""}</Text>
        {project?.website && (
          <Text>
            Website:
            <Link
              href={{
                pathname: "/(app)/website/options",

                params: {
                  id: project.website.id,
                },
              }}
            >
              {project?.website.domain}
            </Link>
          </Text>
        )}
        {/* {project && (
          <div style={{ marginBlock: "10px" }}>
            <SelectPicker
              label={"Client: "}
              data={clientsSelect}
              value={project?.client?.id}
              onChange={updateProjectClient}
              readOnly={
                !appData?.currentUser?.currentAppRole?.permissions?.projects
                  .hasOptions
              }
            />
            {project?.client?.id && (
              <Button
                style={{ marginLeft: "15px" }}
                as={Link}
                appearance="ghost"
                color="cyan"
                to={`/clients/${project.client.id}`}
              >
                To client
              </Button>
            )}
          </div>
        )} */}
        {console.log(app?.projectStates)}
        {
          project &&
            app?.projectStates.map((state: ProjectStateType, index: number) => {
              <Box key={index}>
                <H2>Project state</H2>
                <Pressable
                  px={4}
                  py={4}
                  bg={"white"}
                  borderBottomWidth={1}
                  borderBottomColor={"gray.400"}
                  display={"flex"}
                  flexDirection={"row"}
                  alignContent={"space-between"}
                  justifyContent={"space-between"}
                  onPress={() => {
                    setProjectState(state.id);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                    }}
                  >
                    {app.name}
                  </Text>
                </Pressable>
              </Box>;
            })
          // <div style={{ marginBottom: "10px" }}>
          //   <SelectPicker
          //     label={"Website: "}
          //     data={websitesSelect}
          //     value={project?.website?.id}
          //     onChange={updateProjectWebsite}
          //     readOnly={
          //       !appData?.currentUser?.currentAppRole?.permissions?.projects
          //         .hasOptions
          //     }
          //   />
          //   {project?.website?.id && (
          //     <Button
          //       style={{ marginLeft: "15px" }}
          //       as={Link}
          //       appearance="ghost"
          //       color="cyan"
          //       to={`/websites/${project.website.id}`}
          //     >
          //       To website
          //     </Button>
          //   )}
          // </div>
        }
      </Box>
      <H2>Project tasks</H2>
      {tasks && (
        <CommonList<TaskType>
          createHeaderLabel="New task"
          editHeaderLabel="Task options"
          onEmpty="This project don't have any tasks yet. Create one!"
          label={(task) => task.name}
          entity="tasks"
          items={tasks.filter((t) => !t.completed)}
          creatable
          checkable
          prependURI={`/projects/${params.id}`}
          sortingItems={[{ label: "Name", value: "name" }]}
          sortingDefaults={{ field: "name" }}
          onDelete={(task) => {
            let newTasks = tasks.filter((t) => t.id != task.id);
            setTasks(newTasks);
          }}
          buttons={{
            deleteable:
              appData.currentUser?.currentAppRole.permissions.projects
                ?.deleteable,
            hasView:
              false &&
              appData.currentUser?.currentAppRole.permissions.projects
                ?.deleteable,
            hasOptions:
              appData.currentUser?.currentAppRole.permissions.projects
                ?.hasOptions,
          }}
          onCheck={(task: TaskType) => {
            let nTasks = tasks.map((t) => {
              if (task.id == t.id) {
                t.completed = task.completed;
              }
              return t;
            });
            setTasks(nTasks);
          }}
        />
      )}
      {tasks?.filter((t) => t.completed).length > 0 && (
        <>
          <H2>Finished tasks</H2>
          <CommonList<TaskType>
            createHeaderLabel=""
            editHeaderLabel=""
            onEmpty="This project don't have any tasks yet. Create one!"
            label={(task) => task.name}
            entity="tasks"
            items={tasks.filter((t) => t.completed)}
            prependURI={`/projects/${params.id}`}
            // sortingItems={[{ label: "Name", value: "name" }]}
            // sortingDefaults={{ field: "name" }}
            checkable
            onCheck={(task: TaskType) => {
              let nTasks = tasks.map((t) => {
                if (task.id == t.id) {
                  t.completed = task.completed;
                }
                return t;
              });
              setTasks(nTasks);
            }}
            onDelete={(task) => {
              // addNotification({
              //   text: `Task ${task.name} was deleted`,
              //   notificationProps: { type: "success" },
              // });
              let nTasks = tasks.filter((t) => t.id != task.id);
              setTasks(nTasks);
            }}
            buttons={{
              hasView: false,
              hasOptions: false,
              deleteable:
                appData?.currentUser?.currentAppRole?.permissions?.projects
                  ?.deleteable,
            }}
          />
        </>
      )}
      {/* </Box> */}

      {project?.notes && (
        <Notes
          notes={project?.notes}
          postUrl={`/projects/${project?.id}/addNote`}
        />
      )}
      {/* </Row>
      </Grid> */}
    </ViewContainer>
  );
}
