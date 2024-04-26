import React, { useEffect, useState } from 'react';
import { Modal, Form,Skeleton, Table, Typography } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const { Text } = Typography;

const EntryViewModal = ({ visible, onCancel, entryData }) => {
  const [form] = Form.useForm();
  const [salesOrderDoc, setSalesOrderDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const doc = await db.getDoc('Sales Order', entryData);
        setSalesOrderDoc(doc);
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

  ];

  return (
    <Modal
      title={`Sales Order - ${entryData}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1300}
    >
    {loading ? (
      <div><Skeleton active /></div>
    ) : (
      <div>
      {salesOrderDoc && (
        <>
          <Form form={form} layout="vertical">
            <Form.Item style={{marginTop:'10px', marginRight:'25px' ,display:"flex",float:"left"}} label="Customer" name="entrytype">
            {/* <Input 
                value={salesOrderDoc.customer_name}
                disabled={true}
                placeholder='Customer Name'
            /> */}
            <Text><b>{salesOrderDoc.customer_name}</b></Text>
            </Form.Item>

            <Form.Item style={{marginTop:'10px',marginLeft:'10px' , display:"flex",float:"left"}} label="Order Type" name="order_type">
              <Text><b>{salesOrderDoc.order_type}</b></Text>
            </Form.Item>

            <Form.Item style={{marginTop:'10px', display:"flex",float:"right"}} label="Company" name="company">
              <Text><b>{salesOrderDoc.company}</b></Text>
            </Form.Item>

            <Form.Item style={{marginTop:'10px', display:"flex",float:"right"}} label="Posting Date" name="postingDate">
              <Text><b>{salesOrderDoc.transaction_date}</b></Text>
            </Form.Item>
          </Form>

          <Table
            columns={columns}
            dataSource={salesOrderDoc.items}
            pagination={false}
            rowKey="account"
            footer={() => (
              <div>
                <span style={{display:"flex",float:"right"}}>
                  <b>Total(INR):&nbsp; {salesOrderDoc.total} </b>
                </span>
                
                <span style={{display:"flex",float:"left"}}>
                  <b>Total Quantity:&nbsp; {salesOrderDoc.total_qty} </b>&nbsp;&nbsp;
                </span>
              </div>
            )}
          />

        </>
      )}
      </div>
    )}
    </Modal>
  );
};

export default EntryViewModal;