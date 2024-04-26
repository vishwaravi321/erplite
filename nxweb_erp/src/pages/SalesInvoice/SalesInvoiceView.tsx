import React, { useEffect, useState } from 'react';
import { Modal, Form, Skeleton, Table, Typography } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Text } = Typography;

const EntryViewModal = ({ visible, onCancel, entryData }) => {
  const [form] = Form.useForm();
  const [salesInvoiceDoc, setSalesInvoiceDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const doc = await db.getDoc('Sales Invoice', entryData);
        setSalesInvoiceDoc(doc);
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
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
        title: 'UOM',
        dataIndex: 'uom',
        key: 'uom',
      },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },

  ];

  return (
    <Modal
      title={`Sales Invoice - ${entryData}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1300}
    > 
    {loading ? (
      <div><Skeleton active round /></div>
    ) : (
      <div>
        {salesInvoiceDoc && (
        <>
          <Form form={form} layout="vertical">
            <Form.Item style={{marginTop:'10px', marginRight:'25px' ,display:"flex",float:"left"}} label="Customer" name="entrytype">
            <Text><b>{salesInvoiceDoc.customer}</b></Text>
            </Form.Item>

            <Form.Item style={{marginTop:'10px',marginLeft:'10px' , display:"flex",float:"left"}} label="Posting Date" name="PostingDate">
              <Text><b>{salesInvoiceDoc.posting_date}</b></Text>
            </Form.Item>

            <Form.Item style={{marginTop:'10px', display:"flex",float:"right"}} label="Company" name="company">
              <Text><b>{salesInvoiceDoc.company}</b></Text>
            </Form.Item>

            <Form.Item style={{marginTop:'10px', display:"flex",float:"right"}} label="Payment Due Date" name="PaymentDueDate">
              <Text><b>{salesInvoiceDoc.due_date}</b></Text>
            </Form.Item>
          </Form>

          <Table
            columns={columns}
            dataSource={salesInvoiceDoc.items}
            pagination={false}
            rowKey="account"
            footer={() => (
              <div>
                <span style={{display:"flex",float:"right"}}>
                  <b>Total(INR):&nbsp; {salesInvoiceDoc.total} </b>
                </span>
                
                <span style={{display:"flex",float:"left"}}>
                  <b>Total Quantity:&nbsp; {salesInvoiceDoc.total_qty} </b>&nbsp;&nbsp;
                </span>
              </div>
            )}
          /><br />
          <Form.Item style={{marginTop:'-10px', display:"flex",float:"right"}} label="Grand Total" name="grandTotal">
            <span style={{display:"flex",float:"right"}}>
            &nbsp;<b>{salesInvoiceDoc.grand_total} </b>&nbsp;&nbsp;&nbsp;
            </span>
          </Form.Item>


        </>
      )}
      </div>
      )}
    </Modal>
  );
};

export default EntryViewModal;