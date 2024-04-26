import React,{useState, useEffect} from 'react';
import { Modal, Form, Skeleton, Result, Select, Table, Typography } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Option } = Select;
const { Text } = Typography;

const EntryViewModal = ({ visible, onCancel, entryData }) => {
  const [form] = Form.useForm();
  const [journalDoc, setJournalDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const doc = await db.getDoc('Journal Entry', entryData);
        setJournalDoc(doc);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [entryData]);


  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <Text>{index + 1}</Text>,
    },
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Party Type',
      dataIndex: 'party_type',
      key: 'party_type',
    },
    {
      title: 'Party',
      dataIndex: 'party',
      key: 'party',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
    },
  ];

  return (
    <Modal
      title={`Journal Entry -  ${entryData}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1300}
    >
      {loading ? (
        <div><Skeleton active /></div>
      ) : (
        <div>
          {journalDoc && (
            <>
              <Form form={form} layout="vertical">
                <Form.Item style={{ marginTop: '10px', display: "flex", float: "left" }} label="Entry Type" name="entrytype">
                  <Text>{journalDoc.voucher_type}</Text>
                </Form.Item>
  
                <Form.Item style={{ marginTop: '10px', display: "flex", float: "right" }} label="Company" name="company">
                  <Text>{journalDoc.company}</Text>
                </Form.Item>
  
                <Form.Item style={{ marginTop: '10px', display: "flex", float: "right" }} label="Posting Date" name="postingDate">
                  <Text>{journalDoc.posting_date}</Text>
                </Form.Item>
              </Form>
  
              <Table
                columns={columns}
                dataSource={journalDoc.accounts}
                pagination={false}
                rowKey="account"
                footer={() => (
                  <div>
                    <span style={{ display: "flex", float: "right" }}>
                      <b>Total Debit:&nbsp; {journalDoc.total_debit} </b>
                    </span>
  
                    <span style={{ display: "flex", float: "right" }}>
                      <b>Total Credit:&nbsp; {journalDoc.total_credit} </b>&nbsp;&nbsp;
                    </span>
                  </div>
                )}
              />
  
              <Form form={form} layout="vertical">
                <Form.Item label="User Remark" name="userRemark">
                  <Text>{journalDoc.user_remark}</Text>
                </Form.Item>
              </Form>
            </>
          )}
        </div>
      )}
    </Modal>
  );
  
};

export default EntryViewModal;