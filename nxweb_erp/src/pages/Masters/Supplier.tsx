import React, { useState, useEffect } from 'react';
import { Space, Table,FloatButton, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, Skeleton,Result, Button } from 'antd';
import { DeleteOutlined, EditOutlined,FolderAddOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import SupplierCreatePopUp from './SupplierCreatePopUp';

type CheckboxValueType = React.ReactText[];

interface DataType {
  key: string;
  name: string;
  tags: number;
  supplier_type: string;
  disabled: number;
  supplier_group:string;
  stock_uom: string;
}

const deleteEntry = (key: string) => {
  const frappe = new FrappeApp("http://162.55.41.54");
  const db = frappe.db();
  db.deleteDoc('Supplier', key)
    .then((response) => console.log(response.message))
    .catch((error) => console.error(error));
};

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Supplier Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Supplier Type',
    dataIndex: 'supplier_type',
    key: 'supplier_type',
  },
  { 
    title: 'Status',
    key: 'tags',
    dataIndex: 'tags',
    render: (disabled: number) => (
      <>
        <Tag color={disabled === 0 ? 'geekblue' : 'volcano'} key={disabled}>
          {disabled === 0 ? 'Enabled' : 'Disabled'}
        </Tag>
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record: DataType) => (
      <Space size="middle">
        <button className="action-button-e">
          <EditOutlined />
        </button>
        <button className="action-button-v">
          <FolderViewOutlined />
        </button>
        <button className="action-button-d" onClick={() => deleteEntry(record.key)}>
          <DeleteOutlined />
        </button>
      </Space>
    ),
  },
];

const ItemTable: React.FC = () => {
  const [list, setList] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<CheckboxValueType>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Supplier', {
          fields: ['name', 'disabled', 'supplier_group', 'creation', 'supplier_type'],
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          limit:1000,
          asDict: true,
        });
        const formattedDocs: DataType[] = docs.map((doc) => ({
          key: doc.name,
          name: doc.name,
          supplier_group: doc.supplier_group,
          tags: doc.disabled,
          supplier_type: doc.supplier_type,
        }));
        setList(formattedDocs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: CheckboxValueType) => {
      setSelectedRowKeys(keys);
      console.log(selectedRowKeys);
    },
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateItem = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (values) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    console.log(values);
    db.createDoc('Supplier', {
      supplier_name: values.supplierName,
      supplier_type: values.supplierType,
      gst_category: values.setGstCategory,
    })
      .then((doc) => {
        console.log('New Supplier created:', doc);
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error('Error creating new item:', error);
      });
  };

  return (
    <div style={{ padding: 24, minHeight: '85vh', background: '#fff', borderRadius: 8 }}>
      {loading ? (
        <div><Skeleton active /></div>
      ) : error ? (
        <div>  <Result
        status="500"
        title="500"
        subTitle={error.message}
        // extra={<Button type="primary">Back Home</Button>}
      />
      </div>
      ) : (
        <Table
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
          pagination={{position:['bottom','start'], style: { marginTop: '15px' }, total: list.length }}
        />
      )}
      <FloatButton
        icon={<FolderAddOutlined />}
        style={{ right: 24 }}
        type="primary"
        onClick={handleCreateItem}
      />
      <SupplierCreatePopUp
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ItemTable;