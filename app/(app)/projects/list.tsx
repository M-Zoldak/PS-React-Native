import { useEffect, useState } from "react";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { ProjectType } from "../../../interfaces/EntityTypes/ProjectType";
import { http_methods } from "../../../functions/HTTPMethods";
import ViewContainer from "../../../components/ViewContainer";
import CommonList from "../../../components/Lists/CommonList";
import { H2, Text } from "../../../components/Themed";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FontAwesome } from "@expo/vector-icons";
import Loader from "../../../components/Loader";

export default function ProjectsList() {
  const isFocused = useIsFocused();
  const { appData, refreshAppData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  // const { addNotification } = useNotificationsContext();
  const [projects, setProjects] = useState<Array<ProjectType>>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetch<ProjectType[]>(`/projects`)
      .then((data) => {
        setProjects(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        // addNotification({ text: err.message });
      });

    refreshAppData();
  }, [appData?.currentUser?.userOptions.selectedAppId, isFocused]);

  const projectAdditionalInfo = (project: ProjectType) => {
    return (
      <>
        <Text>State: {project?.projectState?.name ?? "Unset"}</Text>
        {project?.startDate.date && (
          <Text>Start date: {project.startDate.date.slice(0, 10)}</Text>
        )}
        {project?.endDate.date && (
          <Text>End date: {project.endDate.date.slice(0, 10)}</Text>
        )}
        {project?.client?.name && <Text>Client: {project?.client?.name}</Text>}
        {project?.website?.domain && (
          <Text>Website: {project?.website?.domain}</Text>
        )}
      </>
    );
  };

  return (
    <ViewContainer>
      <Loader loaded={loaded}>
        {projects && (
          <CommonList<ProjectType>
            onEmpty="You don't have any projects yet. Create one now!"
            createHeaderLabel="New project"
            items={projects}
            label={(project) => project.name}
            entity="projects"
            editHeaderLabel="Project options"
            sortingItems={[
              { label: "Project name", value: "name" },
              { label: "Project state", value: ["projectState", "position"] },
              { label: "Client", value: ["client", "name"] },
              { label: "Start date", value: ["startDate", "date"] },
              { label: "End date", value: ["endDate", "date"] },
            ]}
            sortingDefaults={{
              direction: "asc",
              field: "name",
            }}
            onDelete={(item) => {
              let newProjects = projects.filter(
                (project) => project.id != item.id
              );
              setProjects(newProjects);
            }}
            creatable
            buttons={{
              deleteable:
                appData?.currentUser?.currentAppRole?.permissions?.projects
                  ?.deleteable,
              hasOptions:
                appData?.currentUser?.currentAppRole?.permissions?.projects
                  ?.hasOptions,
              hasView:
                appData?.currentUser?.currentAppRole?.permissions?.projects
                  ?.hasView,
            }}
            filters={[
              { label: "Project state", value: "projectState" },
              { label: "Client", value: "client" },
            ]}
            additionalInfo={projectAdditionalInfo}
          />
        )}
        {/* <h3>Projects to delete</h3> */}

        {/* <h3>Archivized projects</h3> */}
      </Loader>
    </ViewContainer>
  );
}
