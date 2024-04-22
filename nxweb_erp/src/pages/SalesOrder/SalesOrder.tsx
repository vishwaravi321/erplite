import React from 'react';
import { Space, Table, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, theme, Button } from 'antd';
import { DeleteOutlined, EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import SalesOrderModal from './SalesOrderModel';


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
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.getDocList('Sales Order', {
      fields: ['name', 'status', 'grand_total', 'customer', 'creation', 'modified_by'],
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
    <Button style={{display:"flex",float:"right"}} type="primary" onClick={handleCreateSalesInvoice}>
      Create New Sales Order
    </Button>

      <SalesOrderModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
  </div>

)
};

export default Data;