import React from 'react';
import { Space, Table, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, Button, theme } from 'antd';
import { DeleteOutlined, EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import JournalEntryModel from './JournalEntryModel';

type CheckboxValueType = React.ReactText[];

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const deleteEntry = (key) =>{
  const frappe = new FrappeApp("http://162.55.41.54");
  const db = frappe.db();
  db.updateDoc('Journal Entry', key, {
    docstatus: 2,
  });
  db.deleteDoc('Journal Entry', key)
  .then((response) => console.log(response.message)) 
  .catch((error) => console.error(error));
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Title',
    dataIndex: 'customer',
    key: 'customer',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Total Debit',
    dataIndex: 'grand_total',
    key: 'grand_total',
  },
  {
    title: 'ID',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <>
        <Tag color={status === 'Paid' ? 'green' : 'blue'} key={status}>
          {status.toUpperCase()}
        </Tag>
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <button className="action-button-e"><EditOutlined /></button>
        <button className='action-button-v'><FolderViewOutlined /></button>
        <button className='action-button-d' onClick={()=>deleteEntry(record.key)}><DeleteOutlined /></button>        
      </Space>
    ),
  },
];

const Data: React.FC = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [list, setList] = React.useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<CheckboxValueType>([]);

  React.useEffect(() => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.getDocList('Journal Entry', {
      fields: ['name', 'voucher_type', 'total_debit', 'title', 'creation', 'modified_by'],
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
      limit:1000,
      asDict: true,
    })
    .then((docs) => {
      const formattedDocs: DataType[] = docs.map((doc) => ({
        key: doc.name,
        name: doc.name,
        age: doc.total_debit,
        address: doc.name,
        tags: [doc.voucher_type],
        customer: doc.title,
        grand_total: `₹ ${doc.total_debit}`,
        status: doc.voucher_type,
      }));
      setList(formattedDocs);
    })
    .catch((error) => console.error(error));
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: CheckboxValueType) => {
      setSelectedRowKeys(keys);
      console.log(selectedRowKeys);
      
    },
  };

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleCreateJournalEntry = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (values) => {
    const frappe = new FrappeApp("http://162.55.41.54");

    const accounts = values.account.map((child) => ({
      account: child.account,
      party_type: child.partytype,
      party: `${child.party.$y}-${child.party.$M + 1}-${child.party.$D}`,
      debit: child.debit,
      credit:child.credit
    }));
    const db = frappe.db();
    console.log(values);
    db.createDoc('Journal Entry', {
      voucher_type: values.entrytype,
      posting_date: `${values.postingDate.$y}-${values.postingDate.$M + 1}-${values.postingDate.$D}`,
      accounts: accounts,
    })
    .then((doc) => {
      console.log('New Journal created:', doc);
      setIsModalVisible(false);
    })
    .catch((error) => {
      console.error('Error creating new Journal:', error);
    });
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: '85vh',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Table rowSelection={rowSelection} columns={columns} dataSource={list} />
      <Button style={{display:"flex",float:"right"}} type="primary" onClick={handleCreateJournalEntry}>
        Create New Journal Entry
      </Button>
      
      <JournalEntryModel
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </div>
)
};

export default Data;