import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { BaseKey, useGetToPath, useGo, useTranslate } from "@refinedev/core";
import { getValueFromEvent, useSelect } from "@refinedev/antd";
import { Avatar, Button, Flex, Form, Input, InputNumber, Select, Spin, Upload } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { FrappeApp } from "frappe-js-sdk";
import { message } from 'antd';
import { useItemList } from '../item-list/item-group';
import { useUOMList } from '../item-list/uom';
import { useStyles } from "./styled";
import { UploadOutlined } from "@ant-design/icons";
import { useFrappeGetDoc } from "frappe-react-sdk";
import { useEffect, useState } from "react";


type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onFinish?: any;
  onMutationSuccess?: () => void;
};

export const ItemDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const { id } = useParams<{id:string}>();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const [entryData, setEntryData] = useState<any>([]);


  const { data, error, isValidating, mutate } = useFrappeGetDoc<any>(
    'Item',
    id,
  );

  useEffect(() => {
    if (data) {
      setEntryData(data);
    }
  }, [data]);




  const itemList = useItemList();
  const uomList = useUOMList();

  const { styles, theme } = useStyles();
  

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>({
    resource: "items",
    id: props?.id,
    action: props.action,
    redirect: false,
    initialValues: data || {},
  });

  useEffect(() => {
    formProps.form.setFieldsValue(data || {}); // Update the form fields with the latest data
  }, [data, formProps.form]);

  const createItem = async (values: any) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    try {
      console.log("Form Values:", values);
      const doc = await db.createDoc('Item', {
        item_code: values.item_code,
        item_group: values.item_group,
        stock_uom: values.stock_uom,
        valuation_rate: '1',
      });
      message.success('Item created successfully!');
      onDrawerCLose();
    } catch (error) {
      console.error(error);
      const m = JSON.parse(error._server_messages)
      const d = JSON.parse(m[0])
      
      message.error(d.message);

    }
  };

  const updateItem = async (values: any) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    try {
      console.log("Form Values:", values);
      const doc = await db.updateDoc('Item', id, {
        item_name: values.item_code,
        item_group: values.item_group,
        stock_uom: values.stock_uom,
        valuation_rate: '1',
      });
      message.success('Item updated successfully!');
      onDrawerCLose();
    } catch (error) {
      console.error(error);
      const m = JSON.parse(error._server_messages)
      const d = JSON.parse(m[0])
      message.error(d.message);

    }
  };

  const onDrawerCLose = () => {
    close();
    if (props?.onClose) {
      props.onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const images = Form.useWatch("images", formProps.form);
  const image = images?.[0] || null;
  const previewImageURL = image?.url || image?.response?.url;
  const title = props.action === "edit" ? `Item Code - ${entryData.name}` : "Create new Item";
  const onfinish = props.action === "edit" ? updateItem:createItem;
  const endButton = props.action === "edit" ? "Update":"Save"


  return (
    <Drawer open={true} title={title} onClose={onDrawerCLose}>
      <Spin spinning={false}>
        <Form          
          layout="vertical"
          form={formProps.form}
          onFinish={onfinish}
          onFinishFailed={(error) => {
            console.log("Form Validation Failed:", error);
          }}
        >
          <Form.Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Upload.Dragger
              name="file"
              // action={`${apiUrl}/media/upload`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              showUploadList={false}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{
                  position: "relative",
                  height: "100%",
                }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImageURL ? "100%" : "48px",
                    height: previewImageURL ? "100%" : "48px",
                    marginTop: previewImageURL ? undefined : "auto",
                    transform: previewImageURL ? undefined : "translateY(50%)",
                  }}
                  src={previewImageURL || "/images/product-default-img.png"}
                  alt="Product Image"
                />
                <Button
                  icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,

                  }}
                >
                  {t("products.fields.images.description")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
          <Form.Item
            label="Item"
            className={styles.formItem}
            name="item_code"
            rules={[{ required: true }]}
            initialValue={entryData?.item_name}
          >
            <Input style={{ width: "300px" }} />
          </Form.Item>
          <Form.Item
            label="Item Group"
            className={styles.formItem}
            name="item_group"
            rules={[{ required: true }]}
            initialValue={entryData?.item_group}
          >
            <Select 
            style={{ width: "300px" }}
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            >
              {itemList?.map((item: any) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Stock UOM"
            name="stock_uom"
            className={styles.formItem}
            rules={[{ required: true }]}
            initialValue={entryData?.stock_uom}
          >
            <Select
            style={{ width: "300px" }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            >
              {uomList?.map((item: any) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          </Flex>
          <Flex
              align="center"
              justify="space-between"
              style={{
                padding: "16px 16px 0px 16px",
              }}
            >
          <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
            {endButton}
          </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};

export { useItemList };
