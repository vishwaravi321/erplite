import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps,Button,Skeleton,Result, theme } from 'antd';
import { DeleteOutlined, EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import PaymentEntryView from './PaymentEntryView';


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


const Data: React.FC = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [list, setList] = React.useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<CheckboxValueType>([]);
  const [selectedEntry, setSelectedEntry] = React.useState('');
  const [isViewModalVisible, setIsViewModalVisible] = React.useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState(null);


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
      render: (text,record) => <a onClick={()=>handleViewEntry(record.name)}>{text}</a>,
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
          <button className='action-button-v' onClick={()=>handleViewEntry(record.name)}><FolderViewOutlined /></button>
          <button className='action-button-d' onClick={()=>deleteEntry(record.key)}><DeleteOutlined /></button>        
        </Space>
      ),
    },
  ];


  useEffect(() => {
    const fetchData = async () => {
      setLoadingPayment(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Payment Entry', {
          fields: ['name', 'party_name','status', 'paid_amount', 'payment_type', 'mode_of_payment', 'modified_by'],
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          limit: 1000,
          asDict: true,
        });
        const formattedDocs = docs.map((doc) => ({
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
      } catch (err) {
        setError(err);
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchData();
  }, []);

  const [loading, setLoading] = React.useState(false);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const handleViewEntry = (record) => {
    setSelectedEntry(record);
    setIsViewModalVisible(true);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div
    style={{
      padding: 24,
      minHeight: '85vh',
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
    }}
  >
        {loadingPayment?(
        <div><Skeleton active /></div>
      ) : error ? (
      <div>
        <Result
          status="500"
          title="500"
          subTitle={error.message}
          // extra={<Button type="primary">Back Home</Button>}
        />
      </div>
      ) : (
      <>
    <div style={{ display:'flex', float:'right', marginBottom: 16 }}>
        <Button style={{marginRight:'8px' , display:"flex",float:"right"}} type="primary" >
          Create New Payment Entry
        </Button>
        <span style={{ marginRight: 8 , marginTop: 8}}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Delete
        </Button>
    </div>
    <Table 
    rowSelection={rowSelection} 
    columns={columns} 
    dataSource={list}
    pagination={{
      position:['bottom','start']
    }}
     />

    <PaymentEntryView
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        entryData={selectedEntry}
    />
    </>
      )}

  </div>
)
};

export default Data;