import React, { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, Form, Input, DatePicker, Button, Table, InputNumber, Select } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Option } = Select;

const SalesOrderModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ key: 1, item: '', quantity: 0, rate: 0, amount: 0,deliverydate:'' ,deliverywarehouse:''}]);
  const [Customer,SetCustomer] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [error, setError] = useState<any>(null);
  const [listItem,setListItem] = useState([]);
  const [listUOM, setListUOM] = useState([]);
  const [listWarehouse,setListWarehouse] = useState([]);
  
  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('Customer', {
            fields: ['name'],
            filters: [['disabled','=', 0]],
            limit:1000,
            asDict: true,
          });
          setCustomerList(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();

      const fetchItem = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('Item', {
            fields: ['name'],
            filters: [['disabled','=', 0]],
            limit:1000,
            asDict: true,
          });
          setListItem(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();

      const fetchUOM = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('UOM', {
            fields: ['name'],
            limit:1000,
            asDict: true,
          });
          setListUOM(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchUOM();

      const fetchWarehouse = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('Warehouse', {
            fields: ['name'],
            filters: [['disabled','=', 0]],
            limit:1000,
            asDict: true,
          });
          setListWarehouse(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchWarehouse();

    }, []);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, items });
      form.resetFields();
      setItems([{ key: 1, item: '', quantity: 0, rate: 0, amount: 0,deliverydate:'',deliverywarehouse:'' }]);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setItems([{ key: 1, item: '', quantity: 0, rate: 0, deliverydate:'', amount: 0,deliverywarehouse:'' }]);
    onCancel();
  };

  const handleAddItem = () => {
    setItems([...items, { key: items.length + 1, item: '', quantity: 0, rate: 0, deliverydate:'', amount: 0,deliverywarehouse:'' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (_, record, index) => (
        <Form.Item
          name={['items', index, 'item']}
          rules={[{ required: true, message: 'Please select an item!' }]}
        >
          <Select
            showSearch
            placeholder="Select item"
            value={record.item}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => handleItemChange(index, 'item', value)}
          >
            {listItem.map(data=>(
            <Option value={data.name}>{data.name}</Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliverydate',
      key: 'deliverydate',
      render: (_, record, index) => (
        <Form.Item
          name={['items', index, 'deliverydate']}
          rules={[{ required: true, message: 'Please enter a delivery date!' }]}
        >
          <DatePicker 

          onChange={(value) => handleItemChange(index, 'deliverydate', value)}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Delivery Warehouse',
      dataIndex: 'deliverywarehouse',
      key: 'deliverywarehouse',
      render: (_, record, index) => (
        <Form.Item
          name={['items', index, 'deliverywarehouse']}
          rules={[{ required: true, message: 'Please select an Delivery Warehouse!' }]}
        >
          <Select
            showSearch
            placeholder="Select Delivery Warehouse"
            value={record.deliverywarehouse}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => handleItemChange(index, 'deliverywarehouse', value)}
          >
            {listWarehouse.map(data=>(
            <Option value={data.name}>{data.name}</Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record, index) => (
        <Form.Item
          name={['items', index, 'quantity']}
          rules={[{ required: true, message: 'Please enter a quantity!' }]}
        >
          <InputNumber
            min={0}
            value={record.quantity}
            onChange={(value) => handleItemChange(index, 'quantity', value)}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (_, record, index) => (
        <Form.Item
          name={['items', index, 'rate']}
          rules={[{ required: true, message: 'Please enter a rate!' }]}
        >
          <InputNumber
            min={0}
            value={record.rate}
            onChange={(value) => handleItemChange(index, 'rate', value)}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record, index) => (
        <Button
          type="danger"
          onClick={() => handleDeleteItem(index)}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Create Sales Invoice"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
      width={1100}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Customer"
          name="customer"
          rules={[{ required: true, message: 'Please enter a customer!' }]}
        >
          <Select
            showSearch
            placeholder="Select Customer"
            value={Customer}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => SetCustomer(value)}
          >
            {customerList.map((data)=>(
            <Option value={data.name}>{data.name}</Option>
            ))}

          </Select>
        </Form.Item>
        <Form.Item
          label="Order Type"
          name="orderType"
          rules={[{ required: true, message: 'Please Select Order Type!' }]}
        >
          <Select
            showSearch
            placeholder="Select Customer"
            value={Customer}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => SetCustomer(value)}
          >            
            <Option value="Sales">Sales</Option>
            <Option value="Maintenance">Maintenance</Option>
            <Option value="Shopping Cart">Shopping Cart</Option>
            
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Posting Date"
          name="postingDate"
          rules={[{ required: true, message: 'Please select a Posting date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          footer={() => (
            <div>
              <span style={{display:"flex",float:"right"}}>
                <b>Total Amount:&nbsp; {items.reduce((total, item) => total + (item.rate*item.quantity), 0)} </b>
              </span>
              <Button type='primary' onClick={handleAddItem}>
                Add 
              </Button>
            </div>
          )}
        />
      </Form>
    </Modal>
  );
};

export default SalesOrderModal;