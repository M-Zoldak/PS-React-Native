import { useEffect, useLayoutEffect, useState } from "react";
import { http_methods } from "../../functions/HTTPMethods";
import { FormDataType } from "../../interfaces/FormDataType";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Box,
  Button,
  Container,
  FormControl,
  Hidden,
  Input,
  Select,
  WarningOutlineIcon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useLocalSearchParams } from "expo-router";
import Loader from "../Loader";
import { Text } from "../Themed";

type FormComponentProps<T> = {
  onSuccess: (data: T) => void;
  entity: string;
  updatePath?: {
    id?: string | number;
  };
  prependURI?: string;
};

export default function FormComponent<T>({
  onSuccess,
  entity,
  updatePath,
  prependURI = "",
}: FormComponentProps<T>) {
  const { appData } = useAppDataContext();
  const params = useLocalSearchParams();
  const [formFields, setFormFields] = useState<FormDataType[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);

  if (prependURI.endsWith("/")) {
    prependURI = prependURI.slice(0, prependURI.length - 1);
  }

  var loadFormPath = updatePath?.id ? `${updatePath.id}/options` : "create";
  var sendDataPath = updatePath?.id ? `/${updatePath.id}` : "";

  useEffect(() => {
    http_methods
      .fetch<FormDataType[]>(
        `${params.prependURI ?? ""}/${entity}/${loadFormPath}`
      )
      .then((data) => {
        data = data.map((field) => {
          if (field.name == "appId") {
            field.value = appData.currentUser?.userOptions.selectedAppId;
          }

          if (field.type == "date") {
            field.value = field.value ? new Date(field.value) : new Date();
          }
          return field;
        });
        setFormFields(data);
        setLoaded(true);
      })
      .catch((err) => alert(err.message));
  }, []);

  const validateData = async () => {
    setLoaded(false);
    let formValues = formFields.reduce(
      (data: DynamicallyFilledObject<string>, field: FormDataType) => {
        if (field.type == "date") {
          let date = new Date(field.value);
          data[field.name] = date.getTime().toString();
        } else {
          data[field.name] = field.value;
        }
        return data;
      },
      {}
    );

    updatePath?.id
      ? await http_methods
          .put<T>(
            `${params.prependURI ?? ""}/${entity}${sendDataPath}`,
            formValues
          )
          .then((data) => onSuccess(data))
          .catch((err: Error) => {
            let errors = JSON.parse(err.message);
            let updatedFormFields: FormDataType[] = [];
            Object.keys(errors).forEach((key: string) => {
              updatedFormFields = formFields.map((field: FormDataType) => {
                if (field.name == key) field.error = errors[key];
                return field;
              });
            });
            setFormFields(updatedFormFields);
          })
      : await http_methods
          .post<T>(
            `${params.prependURI ?? ""}/${entity}${sendDataPath}`,
            formValues
          )
          .then((data) => onSuccess(data))
          .catch((err: Error) => {
            let errors = JSON.parse(err.message);
            let updatedFormFields: FormDataType[] = [];
            Object.keys(errors).forEach((key: string) => {
              updatedFormFields = formFields.map((field: FormDataType) => {
                if (field.name == key) field.error = errors[key];
                return field;
              });
            });
            setFormFields(updatedFormFields);
          });
    setLoaded(true);
  };

  const updateInput = (value: string, fieldName: string) => {
    let form = formFields.map((field) => {
      if (field.name == fieldName && value != field.value) {
        if (field.type == "date") {
          field.value = new Date(Number.parseInt(value));
          field.error = "";
        } else {
          field.value = value;
          field.error = "";
        }
      }
      return field;
    });
    setFormFields(form);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const renderField = (field: FormDataType, key: number) => {
    switch (field.type) {
      case "text": {
        return (
          <FormControl key={key}>
            <FormControl.Label>{field.label} </FormControl.Label>
            <Input
              onChangeText={(val: any) => updateInput(val, field.name)}
              // error={field.error}
              value={field.value}
              // {...field}
            />
            {field.error && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {field.error}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        );
      }
      case "hidden": {
        return (
          <Hidden
            key={key}
            // value={field.value as string}
            children={<></>}
          />
        );
      }
      case "select": {
        console.log(field.value);
        console.log(field.options);
        return (
          // <Form.Group controlId={field.name} key={key}>
          <FormControl key={key}>
            <FormControl.Label>{field.label} </FormControl.Label>
            <Select
              // placeholder={
              //   field.options?.length < 1 ? "Nothing to choose from" : ""
              // }

              selectedValue={field.value.toString() ?? ""}
              // defaultValue={field.value ?? ""}
              onValueChange={(val) => updateInput(val, field.name)}
            >
              {field.options?.map((item, key2) => (
                <Select.Item
                  label={item.label}
                  value={item.value.toString()}
                  key={key + "-" + key2}
                />
              ))}
            </Select>
            {field.error && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {field.error}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          // </Form.Group>
        );
      }
      case "date": {
        return (
          <FormControl key={key}>
            <FormControl.Label>{field.label}</FormControl.Label>
            {/* <Button onPress={showDatepicker}>Show date picker!</Button> */}
            {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
            <Input
              value={field.value.toLocaleDateString()}
              onPressIn={showDatepicker}
              InputRightElement={
                <Ionicons
                  name={"calendar"}
                  size={16}
                  // color={colors.blue[700]}
                  style={{ padding: 15 }}
                />
              }
            />
            {field.error && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {field.error}
              </FormControl.ErrorMessage>
            )}
            {show && (
              <DateTimePicker
                // onCancel={() => ""}
                // onConfirm={() => ""}
                value={field.value}
                mode={"date"}
                onChange={(e) => {
                  setShow(false);
                  updateInput(
                    e.nativeEvent.timestamp?.toString() ?? "",
                    field.name
                  );
                }}
              />
            )}
          </FormControl>
        );
      }
      case "password": {
        return (
          <FormControl key={key}>
            <FormControl.Label>{field.label}</FormControl.Label>
            <Input
              type="password"
              // key={key}
              onChange={(val: any) => updateInput(val, field.name)}
              // error={field.error}
              value={field.value}
              // {...field}
            />
            {field.error && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {field.error}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        );
      }
      default:
        return (
          <Text>
            {field.name} does not match any option - Field type not implemented
          </Text>
        );
    }
  };

  return (
    // <ViewContainer >
    <Loader loaded={loaded}>
      <Box width="90%" marginX={"auto"}>
        {formFields &&
          formFields.map((field, index) => renderField(field, index))}

        <Button mt={3} onPress={validateData}>
          Submit
        </Button>
      </Box>
    </Loader>
    // </ViewContainer>
  );
}
