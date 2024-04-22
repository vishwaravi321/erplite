import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker,Button, Table, InputNumber, Select } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Option } = Select;

const SalesInvoiceModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ key: 1, item: '', quantity: 0, rate: 0, uom: '', amount: 0 }]);
  const [Customer,SetCustomer] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [error, setError] = useState<any>(null);
  const [listItem,setListItem] = useState([]);
  const [listUOM, setListUOM] = useState([]);
  
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

    }, []);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, items });
      form.resetFields();
      setItems([{ key: 1, item: '', quantity: 0, rate: 0, uom: '', amount: 0 }]);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setItems([{ key: 1, item: '', quantity: 0, rate: 0, uom: '', amount: 0 }]);
    onCancel();
  };

  const handleAddItem = () => {
    setItems([...items, { key: items.length + 1, item: '', quantity: 0, rate: 0, uom: '', amount: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount = newItems[index].quantity * newItems[index].rate;
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
            placeholder="Select item"
            value={record.item}
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
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      render: (_, record, index) => (
        <Form.Item
          name={['items', index, 'uom']}
          rules={[{ required: true, message: 'Please select a UOM!' }]}
        >
          <Select
            placeholder="Select UOM"
            value={record.uom}
            onChange={(value) => handleItemChange(index, 'uom', value)}
          >
            {listUOM.map(data=>(
            <Option value={data.name}>{data.name}</Option>
          ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record) => record.quantity * record.rate,
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
            placeholder="Select Customer"
            value={Customer}
            onChange={(value) => SetCustomer(value)}
          >
            {customerList.map((data)=>(
            <Option value={data.name}>{data.name}</Option>
            ))}

          </Select>
        </Form.Item>
        <Form.Item
          label="Payment Due Date"
          name="paymentDueDate"
          rules={[{ required: true, message: 'Please select a payment due date!' }]}
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
                <b>Total Amount:&nbsp; {items.reduce((total, item) => total + item.amount, 0)} </b>
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

export default SalesInvoiceModal;