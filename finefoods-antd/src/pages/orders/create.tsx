import { Key, useState } from "react";
import { useTranslate } from "@refinedev/core";
import {
  ListButton,
  SaveButton,
  useForm,
} from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
} from "antd";

import {FormItemHorizontal} from "../../components";
import {
  CalendarOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  FontColorsOutlined,
  HomeOutlined,
  InfoOutlined,
  LeftOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CustomerList } from "../../components/masterData/customer";
import { CompanyList } from "../../components/masterData/company"; 
import { ItemTable } from "../../components/salesTable/itemTable";

export const SalesOrderCreate = () => {

  const [form] = Form.useForm();
  const { formProps, saveButtonProps } = useForm<any>();

  const customerList = CustomerList();
  const companyList = CompanyList();


  const handleSave = async (values: any) => {
    // await mutate({
    //   resource: "orders",
    //   id: id,
    //   values,
    // });
    // setIsFormDisabled(true);
  };

  return (
    <>
      {/* Save and Cancel button */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 0px 16px",
        }}
      >
        <>
          <ListButton icon={<LeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
            {"Cancel"}
          </ListButton>
        </>
        <>
          <SaveButton
            {...saveButtonProps}
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
      </Flex>
      
      <Divider />

      {/* Form View */}
      <Form
        {...formProps}
        form={form}
        layout="horizontal"
        // disabled={false}
        onFinish={handleSave}
      >
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
                
              <Select
                style={{
                  width: "100%",
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option:any) =>
                  (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                }
                >
                  {customerList?.map((customer: any) => (
                    <Select.Option key={customer.name} value={customer.name}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
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
              <Select
                style={{
                  width: "100%",
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option:any) =>
                  (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                }
                >
                  <Select.Option value={'Sales'}>
                    {'Sales'}
                  </Select.Option>
                  <Select.Option value={'Maintenance'}>
                    {'Maintenance'}
                  </Select.Option>
                  <Select.Option value={'Shopping Cart'}>
                    {'Shopping Cart'}
                  </Select.Option>
                </Select>
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
              <Select
                style={{
                  width: "100%",
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option:any) =>
                  (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                }
                >
                  {companyList?.map((customer: any) => (
                    <Select.Option key={customer.name} value={customer.name}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
                
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
                <DatePicker
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
            <ItemTable />

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
              {/* <InputNumber style={{ width: "100%" }} /> */}
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
              {/* <Input style={{ width: "130%" }} /> */}
            </FormItemHorizontal>
          </Col>
        </Row>
      </Form>
    </>
    )}
