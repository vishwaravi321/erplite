import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { BaseKey, useApiUrl, useGetToPath, useGo, useTranslate } from "@refinedev/core";
import { getValueFromEvent, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { FrappeApp } from "frappe-js-sdk";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ItemDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>({
    resource: "items",
    id: props?.id,
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  const createItem = async (values: any) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    try {
      console.log("Form Values:", values);
      const doc = await db.createDoc('Item', {
        item_code: values.item_code,
        item_group: values.item_group,
        stock_uom: values.stock_uom,
        valuation_rate: values.valuation_rate,
      });
      console.log(doc);
    } catch (error) {
      console.error(error);
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

  return (
    <Drawer open={true} title={"Create new Item"} onClose={onDrawerCLose}>
      <Spin spinning={false}>
        <Form
          {...formProps}
          layout="vertical"
          onFinish={createItem}
          onFinishFailed={(error) => {
            console.log("Form Validation Failed:", error);
          }}
        >
          <Form.Item
            label="Item"
            name="item_code"
            rules={[{ required: true }]}
          >
            <Input style={{ width: "300px" }} />
          </Form.Item>
          <Form.Item
            label="Item Group"
            name="item_group"
            rules={[{ required: true }]}
          >
            <Input style={{ width: "300px" }} />
          </Form.Item>
          <Form.Item
            label="Stock UOM"
            name="stock_uom"
            rules={[{ required: true }]}
          >
            <Input style={{ width: "300px" }} />
          </Form.Item>
          <Form.Item
            label="Valuation Rate"
            name="valuation_rate"
            rules={[{ required: true }]}
          >
            <InputNumber prefix="₹" style={{ width: "150px" }} />
          </Form.Item>
          <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
            Save
          </SaveButton>
        </Form>
      </Spin>
    </Drawer>
  );
};