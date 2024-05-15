import { Key, useState } from "react";
import {
    Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
} from "antd";

import {
  DeleteOutlined,
  DollarCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { ItemList } from "../../components/masterData/item";
import { FormItemHorizontal } from "../form";

export const ItemTable = () => {

    const [items, setItems] = useState([{ key: 1, item_code: '', item_name: '', delivery_date:'' , qty:0, rate: 0, uom: '', amount: 0 }]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [dataSource, setDataSource] = useState<any>([
        {
          key: 1,
          item_code: "",
          item_name: "",
          delivery_date: "",
          qty: 0,
          rate: 0,
          uom: "",
          amount: 0,
        },
      ]);
  
    const itemList = ItemList();

    const handleItemChange = (index: any, field: any, value: any) => {
        const updatedDataSource = [...dataSource];
        // updatedDataSource[index][field] = value;
        if (field === "qty") {
            updatedDataSource[index].qty = value;
          } else {
            updatedDataSource[index][field] = value;
          }
      
        if (field === "qty" || field === "rate") {
          updatedDataSource[index].amount = updatedDataSource[index].qty * updatedDataSource[index].rate;
        }
      
        setDataSource(updatedDataSource);
      
        const totalQty = updatedDataSource.reduce((acc, row) => acc + row.qty, 0);
        const totalAmt = updatedDataSource.reduce((acc, row) => acc + row.amount, 0);
      
        setTotalQuantity(totalQty);
        setTotalAmount(totalAmt);
      };
  
    const tableColumns = [
      {
        title: "Item Code",
        dataIndex: "item_code",
        key: "item_code",
        render: (_: any, record: { quantity: any; }, index: any) => (
          <Form.Item
            name={['items', index, 'item_code']}
            rules={[{ required: true, message: 'Please select an item!' }]}
          >
            <Select
              style={{ width: "300px" }}
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
                {itemList?.map((item: any) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
          </Form.Item>
        )
      },
      {
        title: "Delivery Date",
        dataIndex: "delivery_date",
        key: "delivery_date",
        render: (_: any, record: { quantity: any; }, index: any) => (
          <Form.Item
            name={['items', index, 'delivery_date']}
            rules={[{ required: true, message: 'Please select an item!' }]}
          >
            <DatePicker 
            // onChange={(value) => handleItemChange(index, 'deliverydate', value)}
            />
          </Form.Item>
        )
      },
      {
        title: "Quantity",
        dataIndex: "qty",
        key: "qty",
        render: (_: any, record: {
            qty: any; quantity: any; 
}, index: any) => (
          <Form.Item
            name={['items', index, 'qty']}
            rules={[{ required: true, message: 'Please select an item!' }]}
          >
                <InputNumber
                min={0}
                value={record.qty}
                onChange={(value) => handleItemChange(index, "qty", value)}
                />
          </Form.Item>
        )
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        render: (_: any, record: {
            rate: any; quantity: any; 
}, index: any) => (
          <Form.Item
            name={['items', index, 'rate']}
            rules={[{ required: true, message: 'Please select an item!' }]}
          >
                <InputNumber
                min={0}
                value={record.rate}
                onChange={(value) => handleItemChange(index, "rate", value)}
                />
          </Form.Item>
        )
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (_: any, record: { qty: number; rate: number }, index: any) => (
          <Form.Item
            name={["items", index, "amount"]}
            rules={[{ required: true, message: "Please select an item!" }]}
          >
            <InputNumber
              min={0}
              value={record.qty * record.rate}
              onChange={(value) => handleItemChange(index, "amount", value)}
            />
          </Form.Item>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_: any, record: { key: Key; }) => (
          <Space size="middle">
            <DeleteOutlined onClick={()=>handleDeleteRow(record.key)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </Space>
        ),
      },
    ];
  
    const handleAddRow = () => {
        const newRow = {
          key: dataSource.length === 0 ? 1 : dataSource[dataSource.length - 1].key + 1,
          item_code: "",
          item_name: "",
          delivery_date: "",
          qty: 0,
          rate: 0,
          uom: "",
          amount: 0,
        };
        setDataSource([...dataSource, newRow]);
      };
  
    const handleDeleteRow = (key: React.Key) => {
      const updatedDataSource = dataSource.filter((row: { key: Key; }) => row.key !== key);
      setDataSource(updatedDataSource);
    };
  

  
    return (
    <>
        <Table
            dataSource={dataSource}
            style={{ marginTop: '20px' }}
            columns={tableColumns}
            pagination={false}
            rowKey="key"
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
                    <InputNumber value={totalQuantity} disabled />
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
                    <InputNumber value={totalAmount} disabled />
                    </FormItemHorizontal>
                  </Col>
                </Row>
                      )}
        />
        <Button style={{ marginTop:'10px', float:'right' }} type="primary" icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={handleAddRow}>
            Add Row
        </Button>
    </>
    )}
