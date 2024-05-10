import {
    Card,
    Col,
    Divider,
    Flex,
    Form,
    Row,
    Skeleton,
  } from "antd";
  
  import {
    FormItemEditable,
    FormItemHorizontal,
  } from "../../components";
  import {
    CalendarOutlined,
    DollarCircleOutlined,
    FontColorsOutlined,
    HomeOutlined,
    InfoOutlined,
    UnorderedListOutlined,
    UserOutlined,
  } from "@ant-design/icons";
  
  export const SkeletonSales = () => {
    const isFormDisabled = true; 
  
    return (
      <>
        <Form layout="horizontal" disabled={isFormDisabled}>
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
              <Skeleton.Input
                active
                size="large"
                
              />
            </FormItemEditable>
          </Flex>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                style={{
                  marginTop: "16px",
                }}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <FormItemHorizontal
                  icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  name="customer"
                  label="Customer"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Skeleton.Input active />
                </FormItemHorizontal>
                <Divider style={{ margin: "0" }} />
                <FormItemHorizontal
                  name="status"
                  label="Status"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  icon={<InfoOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                >
                  <Skeleton.Input active />
                </FormItemHorizontal>
                <Divider style={{ margin: "0" }} />
  
                <FormItemHorizontal
                  name="due_date"
                  label="Due Date"
                  style={{ fontWeight: "bold", width: "100%" }}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  icon={<CalendarOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                >
                  <Skeleton.Input active style={{ width: "100%" }} />
                </FormItemHorizontal>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  marginTop: "16px",
                }}
   
              >
                <FormItemHorizontal
                  name="company"
                  label="Company"
                  style={{ fontWeight: "bold", width: "100%" }}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  icon={<HomeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                >
                  <Skeleton.Input active style={{ width: "100%" }} />
                </FormItemHorizontal>
                <Divider style={{ margin: "0" }} />
                <FormItemHorizontal
                  name="posting_date"
                  label="Posting Date"
                  style={{ fontWeight: "bold", width: "100%" }}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  icon={<CalendarOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                >
                  <Skeleton.Input active style={{ width: "100%" }} />
                </FormItemHorizontal>
                <Divider style={{ margin: "0" }} />
              </Card>
            </Col>
          </Row>
  
          <Skeleton />
  
  
          <Row gutter={18}>
            <Col span={16}>
              <FormItemHorizontal
                label="Grand Total"
                style={{ fontWeight: "bold", width: "100%" }}
                icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <Skeleton.Input active style={{ width: "100%" }} />
              </FormItemHorizontal>
            </Col>
            <Col span={6}>
              <FormItemHorizontal
                label="In Words"
                style={{  width: "100%" }}
                icon={<FontColorsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              >
                <Skeleton.Input active style={{ width: "100%" }} />
                </FormItemHorizontal>
            </Col>
            </Row>
            </Form>
  
  
      </>
    );
  }
  
  export { Skeleton };
  