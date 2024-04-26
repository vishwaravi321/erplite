import React, { useState, useEffect } from 'react';
import { Space, Table,FloatButton, Skeleton, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, Drawer, Modal, Button, Result } from 'antd';
import { DeleteOutlined, EditOutlined,FolderAddOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import ItemCreateModal from './ItemCreationPopUp';
import ItemUpdateDrawer from './ItemUpdateDrawer';

type CheckboxValueType = React.ReactText[];

interface DataType {
  key: string;
  name: string;
  tags: number;
  item_group: string;
  disabled: number;
  stock_uom: string;
}

const ItemTable: React.FC = () => {
  const [list, setList] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<CheckboxValueType>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedItemEntry, setEditedItemEntry] = useState('');
  const [docName, setDocName] = useState('');

  const deleteEntry = (key: string) => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.deleteDoc('Item', key)
      .then((response) => console.log(response.message))
      .catch((error) => console.error(error));
  };
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => <a onClick={() => showDrawer(record.name)} >{text}</a>,
    },
    {
      title: 'Stock UOM',
      dataIndex: 'stock_uom',
      key: 'stock_uom',
    },
    {
      title: 'Item Group',
      dataIndex: 'item_group',
      key: 'item_group',
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
          <button onClick={() => showDrawer(record.name)} className="action-button-v">
            <FolderViewOutlined />
          </button>
          <button className="action-button-d" onClick={() => deleteEntry(record.key)}>
            <DeleteOutlined />
          </button>
        </Space>
      ),
    },
  ];
  


  const showDrawer = (name) => {
    setDocName(name);
    setIsDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleSaveDrawerNote = () => {
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.updateDoc('Note', currentItem.name, {
      content: editedItemEntry,
    })
      .then((doc) => {
        console.log(doc);
        setIsDrawerOpen(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Item', {
          fields: ['name', 'disabled', 'creation', 'item_group', 'stock_uom'],
          limit:1000,
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          asDict: true,
        });
        const formattedDocs: DataType[] = docs.map((doc) => ({
          key: doc.name,
          name: doc.name,
          tags: doc.disabled,
          stock_uom: doc.stock_uom,
          item_group: doc.item_group,
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');


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
    db.createDoc('Item', {
      item_code: values.itemCode,
      item_group: values.itemGroup,
      stock_uom: values.defaultUom,
    })
      .then((doc) => {
        console.log('New item created:', doc);
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error('Error creating new item:', error);
      });
  };
  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setIsDrawerOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: CheckboxValueType) => {
      setSelectedRowKeys(keys);
      console.log(selectedRowKeys);
    },
  };

  return (
    <div style={{ padding: 24, minHeight: '85vh', background: '#fff', borderRadius: 8 }}>
      {loading ? (
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
        <Table
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
          pagination={{ position:['bottom','start'], style: { marginTop: '15px' }, total: list.length }}
        />
      )}
      <FloatButton
        icon={<FolderAddOutlined />}
        style={{ right: 24 }}
        type="primary"
        onClick={handleCreateItem}
      />

      {/* <Drawer
        title={currentItem?.title}
        width={520}
        onClose={onDrawerClose}
        open={isDrawerOpen}
        placement="right"
        closable={false}
        getContainer={false}
        extra={
          <Space>
            <Button onClick={onDrawerClose}>Cancel</Button>
            <Button onClick={onDrawerClose} type="primary">
              Submit
            </Button>
          </Space>
        }
      > */}
              <Modal
        title="Title"
        open={isDrawerOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onDrawerClose}
      >
        <ItemUpdateDrawer
        data={docName}
        />
        </Modal>
      {/* </Drawer> */}

      <ItemCreateModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ItemTable;