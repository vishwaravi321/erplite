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

import { IItemPriceEdit } from "../../interfaces";
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
  import { useFrappeGetDoc } from "frappe-react-sdk";

export const ItemPriceEdit = () => {
  const titleInputRef = useRef<InputRef>(null);
  const { id } = useParams<{ id: string }>();

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState<any>(null);
  const [orderData, setOrderData] = useState<IItemPriceEdit | null>(null);
  const [isBackbtnVisible,setIsBackbtnVisible] = useState(false);

  const [form] = Form.useForm(); 

  const { formProps, saveButtonProps } = useForm<any>();

  const { data, mutate }  = useFrappeGetDoc('Item Price', id);

  useEffect(() => {
    setOrderData(data)
    console.log(id);
    
    if (orderData) {
      form.setFieldsValue(orderData);
    }
  }, [orderData, form]);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const t = useTranslate();

  const handleSave = async (values: IItemPriceEdit) => {
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
          {isFormDisabled ? (
                    <><ListButton hidden={isBackbtnVisible} icon={<LeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
            {t("orders.orders")}
          </ListButton><Button
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
                  placeholder={t("Item Price")}
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
                name="item_name"
                label="Item Name"
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
                name="item_code"
                label="item_code"
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
                name="uom"
                label="UOM"
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
                name="price_list"
                label="Price List"
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
                name="buying"
                label="Buying"
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
                name="selling"
                label="Selling"
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

          </Form>

      </>
    )
    }
    </>
  );
};