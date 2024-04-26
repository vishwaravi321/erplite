import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, theme,Result,Skeleton, Button } from 'antd';
import { DeleteOutlined, EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import SalesOrderModal from './SalesOrderModel';
import SalesOrderView from './SalesOrderView';


type CheckboxValueType = React.ReactText[];

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const Data: React.FC = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [list, setList] = React.useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<CheckboxValueType>([]);
  const [selectedEntry, setSelectedEntry] = React.useState('');
  const [isViewModalVisible, setIsViewModalVisible] = React.useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState(null);


  const deleteEntry = (key) =>{
    const frappe = new FrappeApp("http://162.55.41.54");
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
      render: (text,record) => (
      <a onClick={()=>handleViewEntry(record.name)}>{text}</a>)
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
          <button className='action-button-v' onClick={()=>handleViewEntry(record.name)}><FolderViewOutlined /></button>
          <button className='action-button-d' onClick={()=>deleteEntry(record.key)}><DeleteOutlined /></button>        
        </Space>
      ),
    },
  ];

  const handleViewEntry = (record) => {
    setSelectedEntry(record);
    setIsViewModalVisible(true);
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoadingOrder(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Sales Order', {
          fields: ['name', 'status', 'grand_total', 'customer', 'creation', 'modified_by'],
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
          age: doc.grand_total,
          address: doc.name,
          tags: [doc.status],
          customer: doc.customer,
          grand_total: `₹ ${doc.grand_total}`,
          status: doc.status,
        }));
        setList(formattedDocs);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchData();
  }, []);

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleCreateSalesInvoice = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  

  const handleModalSubmit = (values) => {
    const frappe = new FrappeApp("http://162.55.41.54");

    const items = values.items.map((child) => ({
      item_code: child.item,
      qty: child.quantity,
      delivery_date: `${child.deliverydate.$y}-${child.deliverydate.$M + 1}-${child.deliverydate.$D}`,
      rate: child.rate,
      warehouse:child.deliverywarehouse
    }));
    const db = frappe.db();
    console.log(values);
    db.createDoc('Sales Order', {
      customer: values.customer,
      order_type:values.orderType,
      date: `${values.postingDate.$y}-${values.postingDate.$M + 1}-${values.postingDate.$D}`,
      items: items,
    })
    .then((doc) => {
      console.log('New item created:', doc);
      setIsModalVisible(false);
    })
    .catch((error) => {
      console.error('Error creating new item:', error);
    });
  };

  const [loading, setLoading] = React.useState(false);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
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
      minHeight: '99vh',
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
    }}
    >
    {loadingOrder?(
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
          <Button style={{marginRight:'8px', display:"flex",float:"right"}} type="primary" onClick={handleCreateSalesInvoice}>
            Create New Sales Order
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
        
        <SalesOrderView
          visible={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          entryData={selectedEntry}
        />

          <SalesOrderModal
            visible={isModalVisible}
            onCancel={handleModalCancel}
            onSubmit={handleModalSubmit}
          />
      </>
      )}
  </div>

)
};

export default Data;