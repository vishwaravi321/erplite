import {
    ListButton,
    SaveButton,
    useForm,
  } from "@refinedev/antd";
  import {
    Card,
    Col,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    Row,
    Select,
    message,
  } from "antd";
  import {FormItemHorizontal} from "../../components";
  import {
    CalendarOutlined,
    DollarCircleOutlined,
    FontColorsOutlined,
    HomeOutlined,
    LeftOutlined,
    UnorderedListOutlined,
    UserOutlined,
  } from "@ant-design/icons";
  import { CustomerList } from "../../components/masterData/customer";
  import { CompanyList } from "../../components/masterData/company"; 
  import { ItemTable } from "../../components/salesTable/itemTable";
  import { useFrappeCreateDoc } from "frappe-react-sdk";
  import { TaxTable } from "../../components/salesTable/taxesTable";
  import { useCallback, useState } from "react";
  import NumberToWords from "number-to-words";
  
  
  export const SalesInvoiceCreate = () => {
    const [form] = Form.useForm();
    const { formProps, saveButtonProps } = useForm<any>();
    const [totalAmount, setTotalAmount] = useState(0);
    const [roundedTotal, setRoundedTotal] = useState(0);
    const [amountInWords, setAmountInWords] = useState("");
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [name, setName] = useState('');
    const [formState, setFormState] = useState('create'); 


  
    const customerList = CustomerList();
    const companyList = CompanyList();
    const { createDoc } = useFrappeCreateDoc()
  
    const handleSave = (values: any) => {
      console.log(values);
      const items = values.items.map((child: any ) => ({
        item_code: child.item_code,
        // delivery_warehouse:child.delivery_warehouse,
        qty: child.qty,
        // delivery_date: `${child.delivery_date.$y}-${child.delivery_date.$M + 1}-${child.delivery_date.$D}`,
        rate: child.rate,
        // warehouse:child.delivery_warehouse
      }));
      
      createDoc('Sales Invoice', {
        customer: values.customer,
        posting_date:`${values.posting_date.$y}-${values.posting_date.$M + 1}-${values.posting_date.$D}`,
        due_date:`${values.due_date.$y}-${values.due_date.$M + 1}-${values.due_date.$D}`,
        company:values.company,
        items:items
      })
        .then((doc) =>{
          setName(doc.name)
          message.success('Successfully Created Sales Invoice')
          // setDisableSave(false);
          // setIsEditMode(false);
          setFormState('submit'); 
        })
        .catch((error) =>{
          const m = JSON.parse(error._server_messages)
          const d = JSON.parse(m[0])
          message.error(d.message);
          console.error(error)
        });
    };

    const handleSubmit = () =>{

    }

    const handleUpdate = () =>{

    }
    const handleFormChange = () => {
      setFormState('edit'); 
    };
  
    const updateTotals = useCallback((items: any[]) => {
      const total = items.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0);
      setTotalAmount(total);
      setRoundedTotal(Math.round(total));
      setAmountInWords(NumberToWords.toWords(Math.round(total)));
    }, []);
  
  
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
        </Flex>
        
        <Divider />
  
        {/* Form View */}
        <Form
          disabled={isFormDisabled}
          {...formProps}
          form={form}
          layout="horizontal"
          onFinish={handleSave}
          onValuesChange={handleFormChange}

        >
            <Flex style={{fontWeight:'bold',fontSize:'20px'}} align="center" gap={24}>
               {name}
            </Flex>
            
            {formState === 'create' && (
            <SaveButton
            {...saveButtonProps}
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginBottom: '100px',
              marginTop: '-110px',
            }}
            htmlType="submit"
            type="primary"
            icon={null}
            >
              Save
            </SaveButton>
            )}
            
            {formState === 'submit' && (
            <SaveButton
              {...saveButtonProps}
              style={{
                display: 'flex',
                marginLeft: 'auto',
                marginBottom: '100px',
                marginTop: '-110px',
              }}
              htmlType="button"
              type="primary"
              icon={null}
              onClick={handleSubmit}
            >
              Submit
            </SaveButton>
            )}
            {formState === 'edit' && (
            <SaveButton
              {...saveButtonProps}
              style={{
                display: 'flex',
                marginLeft: 'auto',
                marginBottom: '100px',
                marginTop: '-110px',
              }}
              htmlType="submit"
              type="primary"
              icon={null}
            >
              Update
            </SaveButton>
          )}

  
          <Row gutter={16} style={{marginBottom:'30px'}}>
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
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                  />
                </FormItemHorizontal>

                <Divider style={{ margin: "0" }} />

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
              <Divider orientation="left" >
                Items
              </Divider>
              <ItemTable disabled={isFormDisabled} doc='SalesInvoice' updateTotals={updateTotals}  />
              <Divider orientation="left" >
                Sales Taxes and Charges
              </Divider>
  
              <TaxTable />
  
              <Divider  orientation="left" >
                Totals
              </Divider>
              
              <Row gutter={18}>
                <Col span={16}>
  
                </Col>
                <Col span={8}>
                  <FormItemHorizontal
                    name="grand_total"
                    label="Grand Total"
                    labelStyle={{fontWeight:'bold'}}
                    style={{ fontWeight: "bold", width: "100%" }}
                    icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  >
                    : &nbsp; {totalAmount}
                  </FormItemHorizontal>
  
                  <FormItemHorizontal
                    name="rounded_total"
                    label="Rounded Total"
                    labelStyle={{fontWeight:'bold'}}
                    style={{ fontWeight: "bold", width: "100%" }}
                    icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  >
                    : &nbsp; {roundedTotal}
                  </FormItemHorizontal>
                  
                  <FormItemHorizontal
                    name="in_words"
                    label="In Words"              
                    labelStyle={{fontWeight:'bold'}}
                    style={{fontWeight:"large", display: 'flex', float: 'right', width: "100%" }}
                    icon={<FontColorsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  >
                    : &nbsp; {amountInWords}
                  </FormItemHorizontal>
                </Col>
              </Row>
        </Form>
    </>
      )}
  