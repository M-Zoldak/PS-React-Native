import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import { CurrentUserType } from "../interfaces/EntityTypes/UserType";
import * as SecureStore from "expo-secure-store";
import { http_methods } from "../functions/HTTPMethods";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppDataType {
  currentUser?: CurrentUserType | null;
  apps?: AppType[] | null;
}

type AppDataContextType = {
  appData: AppDataType;
  initializeAppData: (apps: Array<AppType>, user: CurrentUserType) => void;
  refreshAppData: () => void;
  updateApps: (apps: Array<AppType>) => void;
  updateCurrentUser: (user: CurrentUserType) => void;
  clear: () => void;
};

const setLocalItem = async (key: string, item: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

const getLocalItem = async (itemName: string) => {
  return await AsyncStorage.getItem(itemName);
};

const AppDataContext = createContext<AppDataContextType>(
  {} as AppDataContextType
);

export const useAppDataContext = () =>
  useContext(AppDataContext) as AppDataContextType;

export default function AppDataProvider({ children }: PropsWithChildren) {
  const [appData, setAppData] = useState<AppDataType>({});

  useEffect(() => {
    getLocalItem("appData").then((d) =>
      d ? setAppData(JSON.parse(d)) : setAppData({})
    );
  }, []);

  const initializeAppData = (apps: Array<AppType>, user: CurrentUserType) => {
    appData.apps = apps ?? [];
    appData.currentUser = user ?? null;
    setLocalItem("appData", { ...appData });
    setAppData({ ...appData });
  };

  const updateApps = (apps: AppType[]) => {
    appData.apps = apps ?? [];
    setLocalItem("appData", { ...appData });
    setAppData({ ...appData });
  };

  const updateCurrentUser = (user: CurrentUserType) => {
    appData.currentUser = user ?? null;
    setLocalItem("appData", { ...appData });
    setAppData({ ...appData });
  };

  const clear = async () => {
    // localStorage.clear();
    setAppData({} as AppDataType);
    await SecureStore.deleteItemAsync("token");
  };

  const refreshAppData = async () => {
    let token = await SecureStore.getItemAsync("token");
    if (token) {
      await http_methods.post<any>("/userData", {}).then((data: any) => {
        initializeAppData(data.appData.apps, data.appData.user);
      });
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        initializeAppData,
        updateCurrentUser,
        updateApps,
        clear,
        refreshAppData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
