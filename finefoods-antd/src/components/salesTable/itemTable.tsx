import { useEffect, useState } from "react";
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
import { WarehouseList } from "../masterData/warehouse";
import { FormItemHorizontal } from "../form";


export const ItemTable = ({disabled,doc,updateTotals}) => {
  interface ItemType {
    key: React.Key;
    item_code: string;
    delivery_date: string;
    delivery_warehouse:string,
    qty: number;
    rate: number;
    amount: number;
  }
  
  const [items, setItems] = useState<ItemType[]>([
    { key: 1, item_code: "", delivery_date: "",delivery_warehouse:"", qty: 0, rate: 0, amount: 0 },
  ]);
  const [deliveryWarehouse,setDeliveryWarehouse] = useState(false)

  useEffect(() => {
    if (doc === "SalesInvoice") {
      setDeliveryWarehouse(true)
    }else{
      setDeliveryWarehouse(false)
    }
  }, [])
  

  const itemList = ItemList();
  const warehouseList = WarehouseList();

  useEffect(() => {
    updateTotals(items);
  }, [items, updateTotals]);

  
  const handleItemChange = (index: number, field: keyof ItemType, value: any) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'qty' || field === 'rate') {
        newItems[index].amount = newItems[index].qty * newItems[index].rate;
      }
      return newItems;
    });
  };
  
  const handleAddRow = () => {
    setItems([
      ...items,
      {
        key: items.length + 1,
        item_code: "",
        delivery_date: "",
        delivery_warehouse:"",
        qty: 0,
        rate: 0,
        amount: 0,
      },
    ]);
  };
  
  const handleDeleteRow = (key: React.Key) => {
    if (!disabled) {
      const newItems = items.filter((item) => item.key !== key);
      setItems(newItems);  
    }
  };
  
  const tableColumns = [
    {
      title: "Item Code",
      dataIndex: "item_code",
      key: "item_code",
      render: (_: any, record:any,index:any) => (
      <Form.Item
        name={['items', index, 'item_code']}
        rules={[{ message: 'Please select an item!' }]}
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
          onChange={(value) => handleItemChange(index, 'item_code', value)}
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
        title: 'Delivery Date',
        dataIndex: 'delivery_date',
        key: 'delivery_date',
        hidden:deliveryWarehouse,
        render: (_: any, record: any, index: any) => (
          <Form.Item
            name={['items', index, 'delivery_date']}
            rules={[{ required: true, message: 'Please select a delivery date!' }]}
          >
            <DatePicker
              value={record.delivery_date }
              onChange={(value) => handleItemChange(index, 'delivery_date', value ? value.format('YYYY-MM-DD') : null)}
            />
          </Form.Item>
        ),
      },
      {
        title: 'Delivery Warehouse',
        dataIndex: 'delivery_warehouse',
        key: 'delivery_warehouse',
        hidden:deliveryWarehouse,
        render: (_: any, record: any, index: any) => (
          <Form.Item
          name={['items', index, 'delivery_warehouse']}
          rules={[{ message: 'Please select an item!' }]}
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
            onChange={(value) => handleItemChange(index, 'delivery_warehouse', value)}
          >
            {warehouseList?.map((item: any) => (
            <Select.Option key={item.name} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
          </Select>
          </Form.Item>
        ),
      },
      {
        title: "Quantity",
        dataIndex: "qty",
        key: "qty",
        render: (_: any, record:any, index: any) => (
          <Form.Item
            name={['items', index, 'qty']}
            rules={[{ required: true, message: 'Please select an quantity!' }]}
          >
                <InputNumber
                min={0}
                value={record.qty}
                onChange={(value) => handleItemChange(index, 'qty', value)}
                />
          </Form.Item>
        )
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        render: (_: any, record:any, index: any) => (
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
        render: (_: any, record:any) => record.qty * record.rate,
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_: any, record: ItemType) => (
          <Space size="middle">
            <DeleteOutlined
              onClick={() => handleDeleteRow(record.key)}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </Space>
        ),
      },
    ];

  
    return (
    <>
        <Table
            dataSource={items}
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
                    icon={<ShoppingCartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      : &nbsp; {items.reduce((total, item) => total + item.qty, 0)}
                    {/* : &nbsp; {items.reduce((total: any, item: { qty: any; }) => total + item.qty, 0)} */}
                  </FormItemHorizontal>
                  </Col>
                  <Col span={6}  >
                  <FormItemHorizontal
                    name="total"
                    label="Total Amount"
                    style={{ width: "100%" }}
                    icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    >
                      : &nbsp; {items.reduce((total, item) => total + item.amount, 0)}
                    {/* : &nbsp; {items.reduce((total: any, item: { amount: any; }) => total + item.amount, 0)} */}
                    </FormItemHorizontal>
                  </Col>
                </Row>
                      )}
        />
        <Button style={{ marginTop:'10px', marginBottom:'50px' ,float:'right' }} type="primary" icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={handleAddRow}>
            Add Row
        </Button>
    </>
    )}
