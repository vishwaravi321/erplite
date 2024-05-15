import {
  useGetToPath,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Typography,
  message,
  theme,
} from "antd";
import { useSearchParams, useParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { useFrappeDocTypeEventListener ,useFrappeGetDoc } from "frappe-react-sdk";
import { useEffect, useState } from "react";
import { ItemStatus } from "../status/index";
import { FrappeApp } from "frappe-js-sdk";

export const ItemDrawerShow = (props:any) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{id:string}>();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();
  const [itemData, setItemData] = useState<any>([])


  const DeleteItem = async (values: any) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    try {
      console.log("Form Values:", values);
      const doc = await db.deleteDoc('Item', id);
      message.success('Item deleted successfully!');
      handleDrawerClose();
    } catch (error) {
      console.error(error);
      const m = JSON.parse(error._server_messages)
      const d = JSON.parse(m[0])
      
      message.error(d.message);

    }
  };



    const { data, error, isValidating, mutate } = useFrappeGetDoc<any>(
      "Item",
      id
    );

    useEffect(() => {
      if (data !== itemData) {
        setItemData(data);
      }
    }, [data, itemData]);

    useFrappeDocTypeEventListener('Item',(d)=>{
      if (d.doctype === "Item") {
        mutate()
      }
    })

    

  
    const handleDrawerClose = () => {
      if (props?.onClose) {
        props.onClose();
        return;
      }
  
      go({
        to:
          searchParams.get("to") ??
          getToPath({
            action: "list",
          }) ??
          "",
        query: {
          to: undefined,
        },
        options: {
          keepQuery: true,
        },
        type: "replace",
      });
    };
  
    return (
      <Drawer
        open={true}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={handleDrawerClose}
      >
        <Flex vertical align="center" justify="center">
          <Avatar
            shape="square"
            style={{
              aspectRatio: 1,
              objectFit: "contain",
              width: "240px",
              height: "240px",
              margin: "16px auto",
              borderRadius: "8px",
            }}
            // src={product?.images?.[0].url}
            // alt={product?.images?.[0].name}
          />
        </Flex>
        <Flex
          vertical
          style={{
            backgroundColor: token.colorBgContainer,
          }}
        >
          <Divider
            style={{
              margin: 0,
              padding: 0,
            }}
          />
          <List
            dataSource={[
              {
                value: <Typography.Text type="secondary">{itemData?.name}</Typography.Text>,
              },
              {
                label: (
                  <Typography.Text type="secondary">Item Name</Typography.Text>
                ),
                value: <Typography.Text>{itemData?.item_name}</Typography.Text>,
              },
              {
                label: (
                  <Typography.Text type="secondary">{"Item Code"}</Typography.Text>
                ),
                value: <Typography.Text>{itemData?.item_group}</Typography.Text>,
              },
              {
                label: (
                  <Typography.Text type="secondary">
                    {"uom"}
                  </Typography.Text>
                ),
                value: <Typography.Text>{itemData?.stock_uom}</Typography.Text>,
              },
              {
                label: (
                  <Typography.Text type="secondary">
                    {"Status"}
                  </Typography.Text>
                ),
                value: <ItemStatus value={itemData?.disabled} />,
              },
            ]}
            renderItem={(item) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    style={{
                      padding: "0 16px",
                    }}
                    avatar={item.label}
                    title={item.value}
                  />
                </List.Item>
              );
            }}
          />
        </Flex>
        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: "16px 16px 16px 0",
          }}
        >
          <DeleteButton
            type="text"
            recordItemId={itemData?.name}
            resource="item"
            onClick={DeleteItem}
            // onSuccess={() => {
            //   handleDrawerClose();
            // }}
          />
          <Button
            icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={() => {
              if (props?.onEdit) {
                return props.onEdit();
              }
  
              return go({
                to: `${editUrl("item", itemData?.name || "")}`,
                query: {
                  to: "/item",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          >
            {"Edit"}
          </Button>
        </Flex>
      </Drawer>
    );
  };
  