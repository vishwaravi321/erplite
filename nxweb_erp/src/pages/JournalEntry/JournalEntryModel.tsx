import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker,Button, Table, InputNumber, Select } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Option } = Select;

const JournalEntryModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [account, setAccount] = useState([{ key: 1, account: '', debit: 0, credit: 0, amount: 0,partytype:'',party:''}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [propertyParty,setPropertyParty] = useState(false);

  const [entryType,SetEntryType] = useState('');
  const [listAccount,setListAccount] = useState([]);
  const [listParty, setListParty] = useState([]);
  const [listPartyEmp,setListPartyEmp] = useState([]);
  
  useEffect(() => {

      const fetchItem = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('Account', {
            fields: ['name','account_type'],
            filters: [['disabled','=', 0]],
            limit:1000,
            asDict: true,
          });
          setListAccount(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();

      const fetchPartyCustomer = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('Supplier', {
            fields: ['name'],
            filters: [['disabled','=', 0]],
            limit:1000,
            asDict: true,
          });
          setListParty(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPartyCustomer();

      const fetchPartySupplier = async () => {
        setLoading(true);
        try {
          const frappe = new FrappeApp("http://162.55.41.54");
          const db = frappe.db();
          const docs = await db.getDocList('Employee', {
            fields: ['name','first_name'],
            filters: [['status','=', 'Active']],
            limit:1000,
            asDict: true,
          });
          setListPartyEmp(docs);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPartySupplier();

    }, []);

    const MakePartyReadOnly = (account_type, index) => {
      if (account_type == 'Payable') {
        setPropertyParty(false);
      } else {
        setPropertyParty(true);
      }
    };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, account });
      form.resetFields();
      setAccount([{ key: 1, account: '', debit: 0, credit: 0, amount: 0, partytype:'',party:'' }]);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setAccount([{ key: 1, account: '', debit: 0, credit: 0, amount: 0,partytype:'',party:'' }]);
    onCancel();
  };

  const handleAddItem = () => {
    setAccount([...account, { key: account.length + 1, account: '', debit: 0, credit: 0, amount: 0,partytype:'',party:'' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...account];
    newItems[index][field] = value;
    newItems[index].amount = newItems[index].debit * newItems[index].credit;
    setAccount(newItems);
  };
  const entries = [
    'Journal Entry', 'Inter Company Journal Entry', 'Bank Entry', 'Cash Entry', 'Credit Card Entry',
    'Debit Note', 'Credit Note', 'Contra Entry', 'Excise Entry', 'Write Off Entry', 'Opening Entry', 'Depreciation Entry',
    'Exchange Rate Revaluation', 'Exchange Gain Or Loss', 'Deferred Revenue', 'Deferred Expense'
];

  const columns = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      render: (_, record, index) => (
        <Form.Item
          name={['account', index, 'account']}
          rules={[{ required: true, message: 'Please select an Account!' }]}
        >
        <Select
        showSearch
        placeholder="Select Account"
        value={record.account}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
        }
        onChange={(value) => {
          handleItemChange(index, 'account', value);
          MakePartyReadOnly(listAccount.find(data => data.name === value)?.account_type, index);
          console.log(listAccount.find(data => data.name === value)?.account_type);
        }}
        >
        {listAccount.map(data => (
            <Option key={data.name} value={data.name}>
            {data.name}
            </Option>
        ))}
        </Select>

        </Form.Item>
      ),
    },
    {
      title: 'Party Type',
      dataIndex: 'partytype',
      key: 'partytype',
      render: (_, record, index) => (
        <Form.Item
          name={['account', index, 'partytype']}
          rules={[{ required: false, message: 'Please select an Party Type!' }]}
        >
          <Select
            showSearch
            placeholder="Select Party Type"
            value={record.partytype}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => handleItemChange(index, 'partytype', value)}
            disabled={propertyParty}
          >
            <Option value="Employee">Employee</Option>
            <Option value="Supplier">Supplier</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
        title: 'Party',
        dataIndex: 'party',
        key: 'party',
        render: (_, record, index) => (
          <Form.Item
            name={['account', index, 'party']}
            rules={[{ required: false, message: 'Please select an Party!' }]}
          >
            <Select
              showSearch
              placeholder="Select Party"
              value={record.party}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
              }
              onChange={(value) => handleItemChange(index, 'party', value)}
              disabled={propertyParty}
            >
            {record.partytype === 'Supplier'
              ? listParty.map((data) => (
                  <Option key={data.name} value={data.name}>
                    {data.name}
                  </Option>
                ))
              : listPartyEmp.map((data) => (
                  <Option key={data.name} value={data.first_name}>
                    {data.first_name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        ),
      },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: (_, record, index) => (
        <Form.Item
          name={['account', index, 'debit']}
          rules={[{ required: false, message: 'Please enter a debit!' }]}
        >
          <InputNumber
            min={0}
            value={record.debit}
            onChange={(value) => handleItemChange(index, 'debit', value)}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: (_, record, index) => (
        <Form.Item
          name={['account', index, 'credit']}
          rules={[{ required: false, message: 'Please enter a credit!' }]}
        >
          <InputNumber
            min={0}
            value={record.credit}
            onChange={(value) => handleItemChange(index, 'credit', value)}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Modal
      title="Create Journal Entry"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
      width={1100}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Entry Type"
          name="entrytype"
          rules={[{ required: true, message: 'Please enter a Entry Type!' }]}
        >
          <Select
            showSearch
            placeholder="Select Entry Type"
            value={entryType}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
            }
            onChange={(value) => SetEntryType(value)}
          >
        {entries.map((entry, index) => (
            <Option key={index} value={entry}>{entry}</Option>
        ))}
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
          dataSource={account}
          columns={columns}
          pagination={false}
          footer={() => (
            <div>
              <span style={{display:"flex",float:"right"}}>
                <b>Total Amount:&nbsp; {account.reduce((total, item) => total + item.credit, 0)} </b>
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

export default JournalEntryModal;