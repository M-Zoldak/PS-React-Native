import { useEffect, useState } from "react";
import FormComponent from "../../../components/Forms/FormComponent";
import ViewContainer from "../../../components/ViewContainer";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { WebsiteType } from "../../../interfaces/EntityTypes/WebsiteType";
import { http_methods } from "../../../functions/HTTPMethods";
import { useLocalSearchParams } from "expo-router";

export default function WebsiteOptions() {
  const params = useLocalSearchParams();
  const { appData } = useAppDataContext();
  const [website, setWebsite] = useState<WebsiteType>();
  // const [tasks, setTasks] = useState<TaskType[]>(null);

  useEffect(() => {
    http_methods.fetch<WebsiteType>(`/websites/${params.id}`).then(setWebsite);
  }, []);

  return (
    <FormComponent<WebsiteType>
      entity="websites"
      updatePath={{ id: params.id as string }}
      onSuccess={(website) => {
        setWebsite(website);
        // addNotification({
        //   text: `Website was succesfully updated.`,
        //   notificationProps: { type: "success" },
        // });
      }}
    />
  );
}
