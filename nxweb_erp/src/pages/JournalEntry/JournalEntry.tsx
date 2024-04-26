import React, { useEffect, useState } from 'react';
import { Flex, Space, Table, Tag } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import { TableProps, Skeleton, Result, Button, theme } from 'antd';
import { DeleteOutlined, EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import '../SalesInvoice/App.css';
import JournalEntryModel from './JournalEntryModel';
import EntryViewModal from './JournalEntryView';

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
  const [list, setList] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<CheckboxValueType>([]);
  const [selectedEntry, setSelectedEntry] = useState('');
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const [error, setError] = useState(null);


  const deleteEntry = (key) =>{
    const frappe = new FrappeApp("http://162.55.41.54");
    const db = frappe.db();
    db.updateDoc('Journal Entry', key, {
      docstatus: 2,
    });
    db.deleteDoc('Journal Entry', key)
    .then((response) => console.log(response.message)) 
    .catch((error) => {
      console.error(error)
    });
  }


  const handleViewEntry = (record) => {
    setSelectedEntry(record);
    setIsViewModalVisible(true);
  };
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'customer',
      key: 'customer',
      render: (text,record) => (
      <a onClick={()=>handleViewEntry(record.name)}>{text}</a>
    ),
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
          <button className='action-button-v' onClick={() => handleViewEntry(record.name)} ><FolderViewOutlined /></button>
          <button className='action-button-d' onClick={()=>deleteEntry(record.key)}><DeleteOutlined /></button>        
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoadingJournal(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const docs = await db.getDocList('Journal Entry', {
          fields: ['name', 'voucher_type', 'total_debit', 'title', 'creation', 'modified_by'],
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
          age: doc.total_debit,
          address: doc.name,
          tags: [doc.voucher_type],
          customer: doc.title,
          grand_total: `₹ ${doc.total_debit}`,
          status: doc.voucher_type,
        }));
        setList(formattedDocs);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingJournal(false);
      }
    };
    fetchData();
  }, []);
  

  const [isModalVisible, setIsModalVisible] = useState(false);

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
        minHeight: '85vh',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {loadingJournal ? (
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
        <Button style={{marginRight:'8px' ,display:"flex",float:"right"}} type="primary" onClick={handleCreateJournalEntry}>
          Create New Journal Entry
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
        
        <EntryViewModal
            visible={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            entryData={selectedEntry}
          />
        
        <JournalEntryModel
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