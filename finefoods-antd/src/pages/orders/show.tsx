import { useEffect, useRef, useState } from "react";
import { useTranslate, useUpdate } from "@refinedev/core";
import {
  DeleteButton,
  ListButton,
  SaveButton,
  useForm,
  useSelect,
} from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  InputRef,
  Row,
  Select,
  Table,
} from "antd";
import { useParams } from "react-router-dom";

import { ISalesOrderEdit, ISOChildTable } from "../../interfaces";
import {
  FormItemEditable,
  FormItemHorizontal,
} from "../../components";
import {
  CalendarOutlined,
  DollarCircleOutlined,
  EditOutlined,
  FontColorsOutlined,
  HomeOutlined,
  InfoOutlined,
  LeftOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FrappeApp } from "frappe-js-sdk";
import {SkeletonSales} from "./skeleton";

export const SalesOrderShow = () => {
  const titleInputRef = useRef<InputRef>(null);
  const { id } = useParams<{ id: string }>();

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState<any>(null);
  const [orderData, setOrderData] = useState<ISalesOrderEdit | null>(null);
  const [isBackbtnVisible,setIsBackbtnVisible] = useState(false);

  const [form] = Form.useForm(); // Correctly destructuring form instance

  const { formProps, saveButtonProps } = useForm<ISalesOrderEdit>();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingOrder(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const doc = await db.getDoc('Sales Order', id);
        setOrderData(doc);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (orderData) {
      form.setFieldsValue(orderData);
    }
  }, [orderData, form]);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const t = useTranslate();

  const handleSave = async (values: ISalesOrderEdit) => {
    // await mutate({
    //   resource: "orders",
    //   id: id,
    //   values,
    // });
    // setIsFormDisabled(true);
  };

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  return (
    <>
    {loadingOrder?(
      <SkeletonSales />
    ):error?(
    <>
    {error}
    </>
    ):(
      <>
           <Flex
          align="center"
          justify="space-between"
          style={{
            padding: "16px 16px 0px 16px",
          }}
        >
          {isFormDisabled ? (
          <>
            <ListButton hidden={isBackbtnVisible} icon={<LeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
              {t("orders.orders")}
            </ListButton>
            <Button
              style={{
                marginLeft: "auto",
              }}
              disabled={false}
              icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => {
                setIsBackbtnVisible(true);
                setIsFormDisabled(false);
              } }
            >
              {t("actions.edit")}
            </Button></>
          ) : (
          <>
          <Button onClick={() => {
            setIsBackbtnVisible(false);
            setIsFormDisabled(true)
            }}>
            {t("actions.cancel")}
          </Button>
          
          <SaveButton
            {...saveButtonProps}
            disabled={isFormDisabled}
            style={{
              marginLeft: "auto",
            }}
            htmlType="submit"
            type="primary"
            icon={null}
          >
            Save
          </SaveButton>
          </>
        )}
        </Flex>
      <Divider />

      <Form
        {...formProps}
        form={form}
        layout="horizontal"
        disabled={isFormDisabled}
        onFinish={handleSave}
      >

        <Flex align="center" gap={24}>
              <FormItemEditable
                formItemProps={{
                  name: "name",
                  style: {
                    width: "100%",
                    marginBottom: "0",
                  },
                  rules: [
                    {
                      required: true,
                    },
                  ],
                }}
              >
                <Input
                  ref={titleInputRef}
                  size="large"
                  placeholder={t("Sales Order")}
                />
              </FormItemEditable>
            </Flex>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              style={{
                marginTop: "16px",
              }}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <FormItemHorizontal
                icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                name="customer"
                label="Customer"
                labelStyle={{fontWeight:'bold'}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                
              >
                <Input />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="status"
                label="Status"
                labelStyle={{fontWeight:'bold'}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                icon={<InfoOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <Input />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />

              <FormItemHorizontal
                name="order_type"
                label="Order Type"
                labelStyle={{fontWeight:'bold'}}
                style={{fontWeight: "bold" , width:"100%"}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                icon={<UnorderedListOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </FormItemHorizontal>
              </Card>
              </Col>
              <Col span={12}>
              <Card
              style={{
                marginTop: "16px",
              }}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <FormItemHorizontal
                name="company"
                label="Company"
                labelStyle={{fontWeight:'bold'}}
                style={{fontWeight: "bold" , width:"100%"}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                icon={<HomeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="delivery_date"
                label="Date"
                labelStyle={{fontWeight:'bold'}}
                style={{fontWeight: "bold" , width:"100%"}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                icon={<CalendarOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
            </Card>
            </Col>
            </Row>

            {/* child table */}
            <Table<ISOChildTable>
              style={{ marginTop: '20px' }}
              dataSource={(orderData?.items as unknown as ISOChildTable[]) || []}
              pagination={false}
              rowKey="name"
              footer={() => (
                <Row gutter={18} align="middle">
                  <Col span={18}>
                    <FormItemHorizontal
                      name="total_qty"
                      label="Total Quantity"
                      style={{ fontWeight: "bold", width: "100%" }}
                      rules={[{ required: true }]}
                      icon={<ShoppingCartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </FormItemHorizontal>
                  </Col>
                  <Col span={6}  >
                    <FormItemHorizontal
                      name="total"
                      label="Total Amount"
                      style={{ width: "100%" }}
                      rules={[{ required: true }]}
                      icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      <InputNumber style={{ textAlign: 'right',width: "100%"}} />
                    </FormItemHorizontal>
                  </Col>
                </Row>
                      )}
                    >
                      <Table.Column title="Item Code" dataIndex="item_code" key="item_code" />
                      <Table.Column title="Item Name" dataIndex="item_name" key="item_name" />
                      <Table.Column title="Delivery Date" dataIndex="delivery_date" key="delivery_date" />
                      <Table.Column title="Rate" dataIndex="rate" key="rate" />
                      <Table.Column title="Quantity" dataIndex="qty" key="qty" />
                      <Table.Column title="Amount" dataIndex="amount" key="amount" />
                    </Table>

        <Row gutter={18}>
          <Col span={14}>
            <FormItemHorizontal
              name="grand_total"
              label="Grand Total"
              labelStyle={{fontWeight:'bold'}}
              style={{ fontWeight: "bold", width: "100%" }}
              rules={[{ required: true }]}
              icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            >
              <InputNumber style={{ width: "100%" }} />
            </FormItemHorizontal>
          </Col>
          <Col span={8}>
            <FormItemHorizontal
              name="in_words"
              label="In Words"              
              labelStyle={{fontWeight:'bold'}}
              style={{fontWeight:"large", display: 'flex', float: 'right', width: "100%" }}
              rules={[{ required: true }]}
              icon={<FontColorsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            >
              <Input style={{ width: "130%" }} />
            </FormItemHorizontal>
          </Col>
        </Row>


          </Form>

      </>
    )
    }
    </>
  );
};