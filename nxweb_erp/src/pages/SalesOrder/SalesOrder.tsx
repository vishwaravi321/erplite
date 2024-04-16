import React from 'react';
import { Space, Table, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, theme } from 'antd';
import { DeleteOutlined, EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';


type CheckboxValueType = React.ReactText[];

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const deleteEntry = (key) =>{
  const frappe = new FrappeApp("http://5.75.229.51");
  const db = frappe.db();
  db.updateDoc('Sales Order', key, {
    docstatus: 2,
  });
  db.deleteDoc('Sales Order', key)
  .then((response) => console.log(response.message)) 
  .catch((error) => console.error(error));
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Amount',
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
        <Tag color={status === 'Paid' ? 'green' : 'volcano'} key={status}>
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
    const frappe = new FrappeApp("http://5.75.229.51");
    const db = frappe.db();
    db.getDocList('Sales Order', {
      fields: ['name', 'status', 'grand_total', 'customer', 'creation', 'modified_by'],
      limit: 10,
      asDict: true,
    })
    .then((docs) => {
      const formattedDocs: DataType[] = docs.map((doc) => ({
        key: doc.name,
        name: doc.name,
        age: doc.grand_total,
        address: doc.name,
        tags: [doc.status],
        customer: doc.customer,
        grand_total: `₹ ${doc.grand_total}`,
        status: doc.status,
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

  return (
    <div
    style={{
      padding: 24,
      minHeight: '99vh',
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
    }}
  >
  <Table 
    rowSelection={rowSelection} 
    columns={columns} 
    dataSource={list} 
    pagination={{
      style:{ marginTop: 'auto' },
      pageSize: 12, 
      total: Data.length, 
    }}
    />
  </div>

)
};

export default Data;