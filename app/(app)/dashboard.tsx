import { useEffect, useState } from "react";
import ViewContainer from "../../components/ViewContainer";
import { http_methods } from "../../functions/HTTPMethods";
import ThemedBox from "../../components/ThemedBox";
import { TaskType } from "../../interfaces/EntityTypes/TaskType";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import Loader from "../../components/Loader";
import CommonList from "../../components/Lists/CommonList";
import { Link } from "expo-router";
import { Button } from "native-base";
import { H3, Text } from "../../components/Themed";

type DashboardData = {
  tasks: TaskType[];
  projects: ProjectType[];
  projectsCount: number;
  tasksCount: number;
  usersCount: number;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    http_methods.fetch<DashboardData>("/dashboardData").then((res) => {
      setDashboardData(res);
      setLoaded(true);
    });
  }, []);

  return (
    <ViewContainer>
      <Loader loaded={loaded}>
        <ThemedBox
          bg={"primary.600"}
          title="Co-workers"
          value={(dashboardData?.usersCount ?? "") as string}
        />
        <ThemedBox
          bg={"green.600"}
          title="Shared Projects"
          value={(dashboardData?.projectsCount ?? "") as string}
        />

        <ThemedBox
          bg={"yellow.500"}
          title="Shared tasks"
          value={(dashboardData?.tasksCount ?? "") as string}
        />
        {(dashboardData?.projects?.length ?? 0) > 0 && (
          <>
            <H3>Leaded projects</H3>
            <CommonList<ProjectType>
              entity="projects"
              label={(p) => <Text>{p.name}</Text>}
              /** @ts-ignore */
              items={dashboardData?.projects}
              onDelete={() => {}}
              additionalInfo={(p) => (
                <Text>
                  {/* Space: {t.} */}
                  Days left:{" "}
                  {Math.floor(
                    (new Date(p.endDate.date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </Text>
              )}
              sortingDefaults={{ direction: "asc", field: "endDate" }}
              onEmpty="You don't have any assigned and uncompleted tasks!"
              buttons={{
                deleteable: false,
                hasOptions: false,
                hasView: true,
              }}
            />
          </>
        )}
        <H3>Most urgent Tasks</H3>
        <CommonList<TaskType>
          entity="projects"
          ownButtons={(t) => (
            <Link
              asChild={true}
              href={{
                pathname: `/(app)/projects/project`,
                params: {
                  id: t.id,
                  entity: "tasks",
                  // prependURI: prependURI,
                  // editHeaderLabel: editHeaderLabel,
                },
              }}
            >
              <Button size={"sm"}>Show</Button>
            </Link>
          )}
          label={(t) => <Text>{t.name}</Text>}
          /** @ts-ignore */
          items={dashboardData?.tasks}
          onDelete={() => {}}
          additionalInfo={(t) => (
            <Text>
              {/* Space: {t.} */}
              Days left:{" "}
              {Math.floor(
                (new Date(t.endDate.date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </Text>
          )}
          sortingDefaults={{ direction: "asc", field: "endDate" }}
          onEmpty="You don't have any assigned and uncompleted tasks!"
          buttons={{
            deleteable: false,
            hasOptions: false,
            hasView: true,
          }}
        />
      </Loader>
    </ViewContainer>
  );
}
