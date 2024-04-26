import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Option } = Select;

const ItemCreateModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [listUOM, setListUOM] = useState([]);
  const [error, setError] = useState<any>(null);

  const [itemGroup, setItemGroup] = useState('');
  const [defaultUom, setDefaultUom] = useState('');
  const [itemCode, setItemCode] = useState('');

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Item Group', {
          fields: ['name'],
          filters: [['docstatus', '!=', 2]],
          limit:1000,
          asDict: true,
        });
        setList(docs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

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
      onSubmit({ ...values, itemGroup, defaultUom,itemCode });
      form.resetFields();
    });
  };
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      title="Create New Item"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <Form.Item
          label="Item Code"
          name="itemCode"
          rules={[{ required: true, message: 'Please enter an item code!' }]}
        >
          <Input
            placeholder="Enter item code"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          />
      </Form.Item>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Item Group"
          name="itemGroup"
          rules={[{ required: true, message: 'Please select an item group!' }]}
        >
          <Select
            showSearch
            placeholder="Select item group"
            value={itemGroup}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => setItemGroup(value)}
          >
            {list.map((data) => (
            <Option value={data.name}>{data.name}</Option>
          ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Default UOM"
          name="defaultUom"
          rules={[{ required: true, message: 'Please select a default UOM!' }]}
        >
          <Select
            showSearch
            placeholder="Select default UOM"
            value={defaultUom}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => setDefaultUom(value)}
          >
            {listUOM.map((data) => (
              <Select.Option key={data.name} value={data.name}>
                {data.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ItemCreateModal;