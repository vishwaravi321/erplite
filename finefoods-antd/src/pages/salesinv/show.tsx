import { useEffect, useRef, useState } from "react";
import { useTranslate} from "@refinedev/core";
import {
  ListButton,
  SaveButton,
  useForm,
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
  UserOutlined,
} from "@ant-design/icons";
import {SkeletonSales} from "./skeleton";
import { useFrappeGetDoc } from "frappe-react-sdk";

export const SalesInvEdit = () => {
  const titleInputRef = useRef<InputRef>(null);
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm(); // Correctly destructuring form instance


  const { formProps, saveButtonProps } = useForm<any>();

  const { data, error, isLoading, isValidating, mutate } = useFrappeGetDoc<any>('Sales Invoice', id);

  form.setFieldsValue(data);

  const t = useTranslate();


  return (
    <>
    {isLoading?(
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
          <>
          <ListButton hidden={false} icon={<LeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
            {"Sales Invoice"}
          </ListButton>
          </>
          <>
          <SaveButton
            {...saveButtonProps}
            disabled={false}
            style={{
              marginLeft: "auto",
            }}
            htmlType="submit"
            type="primary"
            icon={null}
          >
            Cancel
          </SaveButton>
          </>
        </Flex>
      <Divider />

      <Form
        {...formProps}
        form={form}
        layout="horizontal"
        disabled={true}
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
                name="due_date"
                label="Due Date"
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
                name="posting_date"
                label="Posting Date"
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

            <Divider orientation="left" >
              Items
            </Divider>

            {/* child table */}
            <Table<ISOChildTable>
              style={{ marginTop: '20px' }}
              dataSource={(data?.items as unknown as ISOChildTable[]) || []}
              pagination={false}
              rowKey="name"
              footer={() => (
                <Row gutter={18} align="middle">
                  <Col span={18}>
                    <FormItemHorizontal
                      name="total_qty"
                      label="Total Quantity"
                      style={{ width: "100%" }}
                      rules={[{ required: true }]}
                      icon={<ShoppingCartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      <InputNumber style={{ width: "50%" }} />
                    </FormItemHorizontal>
                  </Col>
                  <Col span={6}  >
                    <FormItemHorizontal
                      name="total"
                      label="Total Amount"
                      style={{ fontWeight: "bold", width: "100%" }}
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
                      <Table.Column title="UOM" dataIndex="uom" key="delivery_date" />
                      <Table.Column title="Rate" dataIndex="rate" key="rate" />
                      <Table.Column title="Quantity" dataIndex="qty" key="qty" />
                      <Table.Column title="Amount" dataIndex="amount" key="amount" />
                    </Table>


            <Divider orientation="left" >
            Sales Taxes and Charges
            </Divider>


                            {/*Tax child table */}
            <Table<any>
              style={{ marginTop: '20px' }}
              dataSource={(data?.taxes as unknown as ISOChildTable[]) || []}
              pagination={false}
              rowKey="name"
              footer={() => (
                <Row gutter={18} align="middle">
                  <Col span={18}>
                  </Col>
                  <Col span={6}  >
                    <FormItemHorizontal
                      name="total_taxes_and_charges"
                      label="Total Taxes and Charges"
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
                      <Table.Column title="Type" dataIndex="charge_type" key="charge_type" />
                      <Table.Column title="Account Head" dataIndex="account_head" key="account_head" />
                      <Table.Column title="Tax Rate" dataIndex="rate" key="rate" />
                      <Table.Column title="Amount(INR)" dataIndex="tax_amount" key="tax_amount" />
                      <Table.Column title="Total(INR)" dataIndex="total" key="total" />
            </Table>

            <Divider orientation="left" >
            Totals
            </Divider>

        <Row gutter={18}>
          <Col span={14}>
          </Col>
          <Col span={8}>
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
            <FormItemHorizontal
              name="rounded_total"
              label="Rounded Total"
              labelStyle={{fontWeight:'bold'}}
              style={{ fontWeight: "bold", width: "100%" }}
              rules={[{ required: true }]}
              icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            >
              <InputNumber style={{ width: "100%" }} />
            </FormItemHorizontal>

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