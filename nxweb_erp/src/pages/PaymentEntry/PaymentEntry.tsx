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
  mode_of_payment:string;
  payment_type:string;
}



const deleteEntry = (key) =>{
  const frappe = new FrappeApp("http://162.55.41.54");
  const db = frappe.db();
  db.updateDoc('Payment Entry', key, {
    docstatus: 2,
  });
  db.deleteDoc('Payment Entry', key)
  .then((response) => console.log(response.message)) 
  .catch((error) => console.error(error));
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Party Name',
    dataIndex: 'customer',
    key: 'customer',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Paind Amount',
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
        <Tag color={status === 'Submitted' ? 'blue' : 'volcano'} key={status}>
          {status.toUpperCase()}
        </Tag>
      </>
    ),
  },
  {
    title: 'Mode of Payment',
    dataIndex: 'mode_of_payment',
    key: 'mode_of_payment',
  },
  {
    title: 'Payment Type',
    dataIndex: 'payment_type',
    key: 'payment_type',
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
    db.getDocList('Payment Entry', {
      fields: ['name', 'party_name','status', 'paid_amount', 'payment_type', 'mode_of_payment', 'modified_by'],
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
        age: doc.paid_amount,
        address: doc.name,
        tags: [doc.status],
        customer: doc.party_name,
        grand_total: `₹ ${doc.paid_amount}`,
        status: doc.status,
        payment_type:doc.payment_type,
        mode_of_payment:doc.mode_of_payment
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
      minHeight: '85vh',
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
    }}
  >
    <Table rowSelection={rowSelection} columns={columns} dataSource={list} />
  </div>
)
};

export default Data;