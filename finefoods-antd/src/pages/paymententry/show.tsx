import { useEffect, useRef, useState } from "react";
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
  HomeOutlined,
  InfoOutlined,
  LeftOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useFrappeGetDoc } from "frappe-react-sdk";

export const PaymentEntryEdit = () => {
  const titleInputRef = useRef<InputRef>(null);
  const { id } = useParams<{ id: string }>();
  const [isBackbtnVisible,setIsBackbtnVisible] = useState(false);
  const { formProps, saveButtonProps } = useForm<any>();


  const [form] = Form.useForm(); // Correctly destructuring form instance

  const { data, error, isLoading, isValidating, mutate } = useFrappeGetDoc<any>('Payment Entry', id);

  form.setFieldsValue(data);


  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const t = useTranslate();

  return (
    <>
    {isLoading?(
        <></>
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
          <ListButton hidden={isBackbtnVisible} icon={<LeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
            {"Payment Entry"}
          </ListButton>
          <Button type="primary"  style={{marginLeft: "auto",}} onClick={() => {
            setIsBackbtnVisible(false);
            setIsFormDisabled(true)
            }}>
            {"Cancel"}
          </Button>          

        </Flex>
      <Divider />

      <Form
        {...formProps}
        form={form}
        layout="horizontal"
        disabled={isFormDisabled}
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
                  placeholder={t("Payment Entry")}
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
                name="party_type"
                label="Party Type"
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
                name="mode_of_payment"
                label="Mode of Payment"
                labelStyle={{fontWeight:'bold'}}
                style={{fontWeight: "bold" , width:"100%"}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                icon={<UnorderedListOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <Input />
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
                <Input />
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
                <Input />
              </FormItemHorizontal>

              <Divider style={{ margin: "0" }} />

              <FormItemHorizontal
                name="payment_type"
                label="Payment Type"
                labelStyle={{fontWeight:'bold'}}
                style={{fontWeight: "bold" , width:"100%"}}
                rules={[
                  {
                    required: true,
                  },
                ]}
                icon={<CalendarOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <Input />
              </FormItemHorizontal>

            </Card>
            </Col>
            </Row>

            <Divider orientation="left" >
              Payment Reference
            </Divider>

            <Table<ISOChildTable>
              style={{ marginTop: '20px' }}
              dataSource={(data?.references as unknown as ISOChildTable[]) || []}
              pagination={false}
              rowKey="name"
            >
              <Table.Column title="Type" dataIndex="reference_doctype" key="reference_doctype" />
              <Table.Column title="Name" dataIndex="reference_name" key="reference_name" />
              <Table.Column title="Grand Total(INR)" dataIndex="total_amount" key="total_amount" />
              <Table.Column title="Allocated(INR)" dataIndex="allocated_amount" key="allocated_amount" />
            </Table>

            <Divider orientation="left" >
              Writeoff
            </Divider>

            <Row gutter={18} align="middle">
                  <Col span={8}>
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
                      name="total_allocated_amount"
                      label="Allocated Amount"
                      labelStyle={{fontWeight:'bold',width: "500%"}}
                      style={{ width: "100%" }}
                      icon={<ShoppingCartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </FormItemHorizontal>
                    </Card>
                  </Col>
                  <Col span={8}>
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
                      name="unallocated_amount"
                      label="Unallocated Amount"
                      labelStyle={{fontWeight:'bold'}}
                      style={{ width: "100%" }}
                      icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      <InputNumber style={{ textAlign: 'right',width: "100%"}} />
                    </FormItemHorizontal>
                  </Card>
                  </Col>
                  <Col span={8}  >
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
                      name="difference_amount"
                      label="Difference Amount"
                      labelStyle={{fontWeight:'bold'}}
                      style={{ width: "100%" }}
                      icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      <InputNumber style={{ textAlign: 'right',width: "100%"}} />
                    </FormItemHorizontal>
                  </Card>
                  </Col>
                </Row>
          </Form>

      </>
    )
    }
    </>
  );
};