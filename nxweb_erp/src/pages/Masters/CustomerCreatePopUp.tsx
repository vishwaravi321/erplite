import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Option } = Select;

const ItemCreateModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<any>(null);

  const [gstCategory, setGstCategory] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [customerName, setCustomerName] = useState('');

  const [loading, setLoading] = useState(false);


  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, gstCategory, customerType,customerName });
      form.resetFields();
    });
  };
  

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

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
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: 'Please enter an customer name!' }]}
        >
          <Input
            placeholder="Enter item code"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
      </Form.Item>
      <Form form={form} layout="vertical">
        <Form.Item
          label="GST Category"
          name="gstCategory"
          rules={[{ required: true, message: 'Please select an GST Category!' }]}
        >
          <Select
            showSearch
            placeholder="Select GST Category"
            value={gstCategory}
            onChange={(value) => setGstCategory(value)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
          >
            <Option value="Registered Regular">{"Registered Regular"}</Option>
            <Option value="Registered Composition">{"Registered Composition"}</Option>
            <Option value="Unregistered">{"Unregistered"}</Option>
            <Option value="SEZ">{"SEZ"}</Option>
            <Option value="Overseas">{"Overseas"}</Option>
            <Option value="Deemed Export">{"Deemed Export"}</Option>
            <Option value="UIN Holders">{"UIN Holders"}</Option>
            <Option value="Tax Deductor">{"Tax Deductor"}</Option>

          </Select>
        </Form.Item>

        <Form.Item
          label="Customer Type"
          name="customerType"
          rules={[{ required: true, message: 'Please select a customer type!' }]}
        >
          <Select
            showSearch
            placeholder="Select Customer Type"
            value={customerType}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => setCustomerType(value)} 
          >
            <Option value="Company">{"Company"}</Option>
            <Option value="Individual">{"Individual"}</Option>
            <Option value="Proprietorship">{"Proprietorship"}</Option>
            <Option value="Partnership">{"Partnership"}</Option>
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ItemCreateModal;