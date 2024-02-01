import { Box, Button, Divider } from "native-base";
import { H2, Text } from "../Themed";
import { Link } from "expo-router";

type ActionButtons = {
  add?: boolean;
  remove?: boolean;
  options?: boolean;
};

type EntityStandardSublistProps = {
  mainTitle: string;
  items: EntitySubListProps[];
};

type EntitySubListProps = {
  subtitle?: string;
  items: any;
  buttons?: ActionButtons;
  textBlocks: TextBlockProps[];
  index?: number;
};

type TextBlockProps =
  | {
      name: string;
      value: string;
      dynamicProp?: boolean;
      title?: boolean;
    }
  | any;

function EntitySubList({
  items,
  textBlocks,
  subtitle,
  index,
  buttons,
}: EntitySubListProps) {
  // console.log(items);
  return (
    <>
      {subtitle && (
        <>
          {index && index > 0 ? <Divider style={{ marginTop: 4 }} /> : ""}
          <H2>{subtitle}</H2>
        </>
      )}
      <Box>
        {Array.isArray(items) ? (
          items.map((item, index) => (
            <TextBlock
              key={index}
              buttons={buttons}
              textBlocks={textBlocks}
              item={item}
            />
          ))
        ) : (
          <TextBlock textBlocks={textBlocks} />
        )}
        {buttons?.add && (
          <Link
            href={{
              pathname: `/createModal`,
              // params: {
              //   entity: `${entity}`,
              //   prependURI: prependURI,
              // },
            }}
            asChild={true}
          >
            <Button size={"sm"}>Add new</Button>
          </Link>
        )}
      </Box>
    </>
  );
}

function TextBlock({
  textBlocks,
  buttons,
  item = null,
}: {
  textBlocks: TextBlockProps[];
  item?: any;
  buttons?: ActionButtons;
}) {
  return (
    <Box>
      {textBlocks &&
        textBlocks.map((i, index: number) =>
          (!i.dynamicProp && i.value) || (i.dynamicProp && item[i.value]) ? (
            <>
              <Text key={index}>
                {i.title ? "" : `${i.name}: `}
                {i.dynamicProp ? item[i.value] : i.value}
                {i.title ? " " : ""}
              </Text>
              {buttons?.options && (
                <Link
                  href={{
                    pathname: `/createModal`,
                    // params: {
                    //   entity: `${entity}`,
                    //   prependURI: prependURI,
                    //   entityId: item.id,
                    // },
                  }}
                  asChild={true}
                >
                  <Button size={"sm"}>Add new</Button>
                </Link>
              )}
              {buttons?.remove && (
                <Link
                  href={{
                    pathname: `/createModal`,
                    // params: {
                    //   entity: `${entity}`,
                    //   prependURI: prependURI,
                    //   entityId: item.id,
                    // },
                  }}
                  asChild={true}
                >
                  <Button size={"sm"}>Add new</Button>
                </Link>
              )}
            </>
          ) : (
            ""
          )
        )}
    </Box>
    // </Col>
  );
}

export default function EntityStandardSublist({
  mainTitle,
  items,
}: EntityStandardSublistProps) {
  return (
    <>
      {items &&
        items.map((item, index) => (
          <EntitySubList {...item} index={index} key={index} />
        ))}
    </>
  );
}
