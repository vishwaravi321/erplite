import {
    BaseKey,
    HttpError,
    useGetToPath,
    useGo,
    useNavigation,
    useOne,
    useShow,
    useTranslate,
  } from "@refinedev/core";
  import {
    Avatar,
    Button,
    Divider,
    Drawer,
    Flex,
    Grid,
    List,
    Spin,
    Typography,
    theme,
  } from "antd";
  import { useSearchParams } from "react-router-dom";
//   import { Drawer } from "../../drawer";
  import { DeleteButton, NumberField } from "@refinedev/antd";
//   import { ProductStatus } from "../status";
  import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useFrappeGetDoc } from "frappe-react-sdk";
  
  type Props = {
    id?: BaseKey;
    onClose?: () => void;
    onEdit?: () => void;
  };
  
  export const ProductDrawerShow = (props: Props) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const { editUrl } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();
    const breakpoint = Grid.useBreakpoint();


    const [itemData, setItemData] = useState<any>(null);
    const { data, isLoading } = useFrappeGetDoc<any>("Item", id, {
      fields: ["item_code", "item_group", "stock_uom", "valuation_rate"],
    });
  
    useEffect(() => {
      if (data) {
        setItemData(data);
      }
    }, [data]);
  
    if (isLoading || !itemData) {
      return <Spin spinning={true} />;
    }
  
    const { queryResult } = useShow<any>({
      resource: "products",
      id: props?.id, // when undefined, id will be read from the URL.
    });
    const product = queryResult.data?.data;
  
    const { data: categoryData } = useOne<any>({
      resource: "categories",
      id: product?.category?.id,
      queryOptions: {
        enabled: !!product?.category?.id,
      },
    });
    const category = categoryData?.data;
  
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
            src={product?.images?.[0].url}
            alt={product?.images?.[0].name}
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
                label: (
                  <Typography.Text type="secondary">
                    {"Item Code"}
                  </Typography.Text>
                ),
                value: (
                  <NumberField
                    value={product?.price || 0}
                    options={{
                      style: "currency",
                      currency: "USD",
                    }}
                  />
                ),
              },
              {
                label: (
                  <Typography.Text type="secondary">
                    {t("products.fields.category")}
                  </Typography.Text>
                ),
                value: <Typography.Text>{category?.title}</Typography.Text>,
              },
              {
                label: (
                  <Typography.Text type="secondary">
                    {t("products.fields.isActive.label")}
                  </Typography.Text>
                ),
                value: <ProductStatus value={!!product?.isActive} />,
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
            recordItemId={product?.id}
            resource="products"
            onSuccess={() => {
              handleDrawerClose();
            }}
          />
          <Button
            icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={() => {
              if (props?.onEdit) {
                return props.onEdit();
              }
  
              return go({
                to: `${editUrl("products", product?.id || "")}`,
                query: {
                  to: "/products",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          >
            {t("actions.edit")}
          </Button>
        </Flex>
      </Drawer>
    );
  };
  