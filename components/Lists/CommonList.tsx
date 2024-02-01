import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActionButtonsType } from "../../interfaces/DefaultTypes";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { http_methods } from "../../functions/HTTPMethods";
import {
  AlertDialog,
  Box,
  Button,
  Fab,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
} from "native-base";
import { H3, Text } from "../Themed";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export type CommonListItemProps = {
  id: string;
  name: string;
  // props?: ListItemProps;
};

type CommonListProps<T> = {
  items: Array<CommonListItemProps>;
  entity: string;
  onDelete: (item: T) => void;
  buttons?: ActionButtonsType;
  additionalInfo?: (item: T) => ReactElement;
  prependURI?: string;
  ownButtons?: (item: T) => ReactNode;
  label: (item: T) => string | ReactNode;
  sortingItems?: Array<{ value: string | string[]; label: string }>;
  sortingDefaults?: {
    direction?: "asc" | "desc";
    field?: string | string[];
  };
  onEmpty: string;
  sortable?: boolean;
  onSort?: (data: any) => void;
  editableLabel?: boolean;
  onEditLabel?: (name: string, item: T) => void;
  filters?: Array<{ value: string; label: string }>;
  creatable?: boolean;
  creatableAsButton?: boolean;
  createHeaderLabel: string;
  editHeaderLabel: string;
  search?: { label: string; value: string };
};

export default function CommonList<T>({
  items,
  prependURI = "",
  buttons = {
    deleteable: true,
    hasOptions: true,
    hasView: true,
  },
  entity,
  onDelete,
  additionalInfo,
  ownButtons,
  label,
  sortingItems,
  sortingDefaults = {
    direction: "asc",
    field: "",
  },
  onEmpty,
  sortable = false,
  onSort,
  editableLabel,
  onEditLabel,
  filters,
  creatable = false,
  creatableAsButton = false,
  createHeaderLabel,
  editHeaderLabel,
  search,
}: CommonListProps<T>) {
  // const navigation = useNavigation();
  const { appData } = useAppDataContext();
  // const { addNotification } = useNotificationsContext();
  const [chosenObjectId, setChosenObjectId] = useState("");
  const [destroyOpen, setDestroyOpen] = useState(false);
  const [sortingType, setSortingType] = useState("alphabetically");
  const cancelRef = useRef(null);
  const [sortBy, setSortBy] = useState<string>(sortingDefaults.field as string);
  const [sortDirection, setSortDirection] = useState(sortingDefaults.direction);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [filteredValue, setFilteredValue] = useState("none");
  const [searchValue, setSearchValue] = useState("");

  const destroyObject = () => {
    http_methods
      .delete<T>(`${prependURI}/${entity}/${chosenObjectId}`.replace("//", "/"))
      .then((data) => {
        onDelete(data);
        setDestroyOpen(false);
      })
      .catch(
        (err: Error) => () => {}
        // addNotification({ text: err.message })
      );
  };

  const renderActionButtons = (item: CommonListItemProps) => {
    let isViewable =
      typeof buttons.hasView == "function"
        ? buttons.hasView(item)
        : buttons.hasView;
    let overview = isViewable ? (
      <Link
        asChild={true}
        href={{
          pathname: `/entityView`,
          params: {
            id: item.id,
            entity: entity,
            prependURI: prependURI,
            editHeaderLabel: editHeaderLabel,
          },
        }}
      >
        <Button size={"sm"}>Show</Button>
      </Link>
    ) : (
      <></>
    );

    let isOptionable =
      typeof buttons.hasOptions == "function"
        ? buttons.hasOptions(item)
        : buttons.hasOptions;
    let options = isOptionable ? (
      <Link
        href={{
          pathname: `/createModal`,
          params: {
            entity: `${entity}`,
            prependURI: prependURI,
            entityId: item.id,
            editHeaderLabel: editHeaderLabel,
          },
        }}
        asChild={true}
      >
        <Button size={"sm"} colorScheme={"amber"}>
          Options
        </Button>
      </Link>
    ) : (
      <></>
    );

    let isDestroyable =
      typeof buttons.deleteable == "function"
        ? buttons.deleteable(item)
        : buttons.deleteable;
    let destroy = isDestroyable ? (
      <Button
        colorScheme={"error"}
        onPress={() => {
          setChosenObjectId(item.id);
          setDestroyOpen(true);
        }}
        size={"sm"}
      >
        Delete
      </Button>
    ) : (
      <></>
    );

    return (
      <Button.Group display={"flex"} flexDir="row">
        {overview}
        {options}
        {destroy}
      </Button.Group>
    );
  };

  const officialSort = (item1: any, item2: any) => {
    if (Array.isArray(sortBy)) {
      if (sortDirection == "asc") {
        if (
          !item1 ||
          !item1[sortBy[0]] ||
          item1[sortBy[0]][sortBy[1]] == undefined
        ) {
          return 1;
        } else if (
          !item2 ||
          !item2[sortBy[0]] ||
          item2[sortBy[0]][sortBy[1]] == undefined
        )
          return -1;
        else {
          return item1[sortBy[0]][sortBy[1]] > item2[sortBy[0]][sortBy[1]]
            ? 1
            : -1;
        }
      } else {
        if (
          !item1 ||
          !item1[sortBy[0]] ||
          item1[sortBy[0]][sortBy[1]] == undefined
        ) {
          return 1;
        } else if (
          !item2 ||
          !item2[sortBy[0]] ||
          item2[sortBy[0]][sortBy[1]] == undefined
        ) {
          return -1;
        } else {
          return item1[sortBy[0]][sortBy[1]] < item2[sortBy[0]][sortBy[1]]
            ? 1
            : -1;
        }
      }
    } else {
      if (sortDirection == "asc") {
        // @ts-ignore
        return item1[sortBy] > item2[sortBy] ? 1 : -1;
      } else {
        // @ts-ignore
        return item1[sortBy] < item2[sortBy] ? 1 : -1;
      }
    }
  };

  const renderSorting = () => {
    return (
      <Box display={"flex"} w={"100%"} my={5} mx={"auto"}>
        <H3>Sorting</H3>
        <Text>Sorting type</Text>
        <Select
          mb={"1"}
          size="sm"
          onValueChange={setSortingType}
          selectedValue={sortingType}
        >
          <Select.Item label="Alphabetically" value="alphabetically" />
        </Select>

        <Text>Sort by</Text>
        <Select
          mb={"1"}
          size="sm"
          onValueChange={(val: string) => setSortBy(val)}
          selectedValue={sortBy}
        >
          {sortingItems?.map((item, index) => (
            <Select.Item
              key={index}
              value={item.value as string}
              label={item.label}
            />
          ))}
        </Select>
        <Text>Sorting direction</Text>
        <Select
          onValueChange={(val) => setSortDirection(val as "asc" | "desc")}
          selectedValue={sortDirection}
        >
          <Select.Item label="Ascending" value="asc" />
          <Select.Item label="Descending" value="desc" />
        </Select>
      </Box>
    );
  };

  const renderFilter = () => {
    let keys: string[] = [];
    return (
      <Box display={"flex"} w={"100%"} mx={"auto"}>
        <Text>Filter</Text>
        <Select
          // placeholder="sort by"
          onValueChange={setCurrentFilter}
          selectedValue={currentFilter}
          defaultValue={"none"}
        >
          {[{ label: "None", value: "none" }, ...(filters ?? [])]
            .filter((el) => el)
            .map((filter) => (
              <Select.Item label={filter.label} value={filter.value} />
            ))}
          {/* <Select.Item label="None" value="none"/> */}
        </Select>

        {currentFilter != "none" && (
          <Select onValueChange={setFilteredValue} defaultValue={"none"}>
            {[
              { label: "None", value: "none" },
              ...items
                .map((i: any) => {
                  if (
                    i &&
                    i.hasOwnProperty(currentFilter) &&
                    i[currentFilter] == undefined
                  ) {
                    if (!keys.includes("unset")) {
                      keys.push("unset");
                      return {
                        label: "Unset",
                        value: "unset",
                      };
                    }
                  } else if (
                    i &&
                    i.hasOwnProperty(currentFilter) &&
                    i[currentFilter] != undefined &&
                    i[currentFilter]?.name != undefined &&
                    i[currentFilter] != null
                  ) {
                    if (!keys.includes(i[currentFilter]?.name)) {
                      keys.push(i[currentFilter]?.name);
                      return {
                        label: i[currentFilter]?.name ?? ("" as string),
                        value: i[currentFilter]?.name ?? ("" as string),
                      };
                    }
                  }
                })
                .filter((i) => i)
                .sort((a, b) =>
                  b?.label == "Unset" || a?.label > b?.label ? 1 : 0
                ),
            ].map((el) => (
              <Select.Item value={el?.value} label={el?.label} />
            ))}
          </Select>
        )}
      </Box>
    );
  };

  const searchFilter = (item: CommonListItemProps) => {
    if (item == undefined) return false;
    return item.name.toLowerCase().includes(searchValue.toLowerCase());
  };

  const renderSearch = () => {
    if (!search?.value) return;

    return (
      <Box display={"flex"} w={"100%"} mx={"auto"}>
        <InputGroup flexGrow={1} flex={1}>
          <InputLeftAddon children={"Search:"} />
          <Input
            display={"flex"}
            flexGrow={1}
            value={searchValue}
            onChangeText={setSearchValue}
          />
        </InputGroup>
      </Box>
    );
  };

  return (
    <>
      <Box
      // sortable={sortable}
      // onSort={onSort}
      // w={"100%"}
      // margin={1}
      // shadow={1}
      // h={"100%"}
      >
        {sortingItems && items.length > 0 && renderSorting()}
        {filters && items.length > 0 && renderFilter()}
        {search && items.length > 0 && renderSearch()}
        {items?.length > 0 ? (
          items
            .filter((i: any) => {
              if (filteredValue == "none" || currentFilter == "none")
                return true;
              else if (
                filteredValue == "unset" &&
                i[currentFilter] == undefined
              ) {
                return true;
              } else if (
                i.hasOwnProperty(currentFilter) &&
                i[currentFilter] != undefined &&
                i[currentFilter] != null
              )
                return i[currentFilter].name == filteredValue;
              else return false;
            })
            .sort(officialSort)
            .filter(searchFilter)
            .map((item: CommonListItemProps, index: number) => (
              <Box
                marginTop={2}
                padding={3}
                key={item.id.toString()}
                display={"flex"}
                flexDir={"row"}
                // h={70}
                borderWidth={1}
                borderColor={"gray.200"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
              >
                {/* <Box> */}
                <Text style={styles.titleText}>
                  {label(item as T)}
                  {/* {editableLabel ? (
                      <Button>
                        <FontAwesomeIcon icon={faEdit} size="sm" />
                      </Button>
                    ) : (
                      <></>
                    )} */}
                </Text>
                {/* </Box> */}
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  alignContent={"space-between"}
                >
                  {ownButtons ? (
                    <>{ownButtons(item as T)}</>
                  ) : (
                    // </Box>
                    renderActionButtons(item)
                  )}
                </Box>
                {additionalInfo ? (
                  <Box w={"100%"} marginTop={4}>
                    {additionalInfo(item as T)}
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            ))
        ) : (
          <Text>{onEmpty}</Text>
        )}
      </Box>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        // size="sm"
        isOpen={destroyOpen}
        // onClose={() => setDestroyOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Delete</AlertDialog.Header>
          <AlertDialog.Body>Are you sure about deleting this?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group>
              <Button size={"sm"} onPress={() => setDestroyOpen(false)}>
                Cancel
              </Button>
              <Button size={"sm"} onPress={destroyObject}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {(appData?.currentUser?.currentAppRole?.permissions?.websites
        ?.hasOptions ||
        entity == "apps") &&
        entity &&
        creatable &&
        (creatableAsButton ? (
          <Link
            style={{ marginTop: 8 }}
            href={{
              pathname: `/createModal`,
              params: {
                entity: `${entity}`,
                prependURI: prependURI,
                headerLabel: createHeaderLabel,
                editHeaderLabel: editHeaderLabel,
                // entityId: item.id,
              },
            }}
            asChild={true}
          >
            <Button size={"sm"}>Add new</Button>
          </Link>
        ) : (
          <Link
            href={{
              pathname: `/createModal`,
              params: {
                entity: entity,
                prependURI: prependURI,
                headerLabel: createHeaderLabel,
                editHeaderLabel: editHeaderLabel,
              },
            }}
            asChild
          >
            <Fab
              renderInPortal={false}
              right={15}
              bottom={15}
              // onPress={() => {}}
              // placement="bottom-right"
              // onPress={showCreateModal}
              size={"md"}
              icon={<Ionicons color={"white"} name={"add"} size={22} />}
            >
              {/* <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={(Colors as any)["light"].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  )}
                </Pressable> */}
            </Fab>
          </Link>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
  },
});
