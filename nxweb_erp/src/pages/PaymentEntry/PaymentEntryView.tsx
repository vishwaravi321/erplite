import React,{useState, useEffect} from 'react';
import { Modal, Form, Skeleton, Typography, Card } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';
import './paymentEntryView.css';

const { Text } = Typography;

const EntryViewModal = ({ visible, onCancel, entryData }) => {
  const [form] = Form.useForm();
  const [paymentEntryDoc, setPaymentEntryDoc] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const doc = await db.getDoc('Payment Entry', entryData);
        setPaymentEntryDoc(doc);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [entryData]);

  return (
    <Modal
      title={`Payment Entry - ${entryData}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1300}
      className="entry-view-modal"
    >
      {loading?(
        <div><Skeleton active /></div>
      ):(
        <div>
        {paymentEntryDoc && (
          <>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="horizontal-form"
            >
              <Form.Item label="Posting Date" name="postingDate">
                <Text>{paymentEntryDoc.posting_date}</Text>
              </Form.Item>
              <Form.Item label="Payment Type" name="paymentType">
                <Text>{paymentEntryDoc.payment_type}</Text>
              </Form.Item>
              <Form.Item label="Company" name="company">
                <Text>{paymentEntryDoc.company}</Text>
              </Form.Item>
              <Form.Item label="Mode of Payment" name="modeOfPayment">
                <Text>{paymentEntryDoc.mode_of_payment}</Text>
              </Form.Item>
            </Form>
  
            <Card title="Payment From / To" className="block-card">
              <Form
                form={form}
                layout="vertical"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                className="vertical-form"
              >
                <Form.Item label="Party" name="paymentFromTo">
                  <Text>{paymentEntryDoc.party}</Text>
                </Form.Item>
                <Form.Item label="Party Name" name="partyName">
                  <Text>{paymentEntryDoc.party_name}</Text>
                </Form.Item>
              </Form>
            </Card>
  
            <Card title="Accounts" className="block-card">
              <Form
                form={form}
                layout="vertical"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                className="vertical-form"
              >
                <Form.Item label="Accounts Paid From" name="accountsPaidFrom">
                  <Text>{paymentEntryDoc.paid_from}</Text>
                </Form.Item>
                <Form.Item label="Accounts Paid To" name="accountsPaidTo">
                  <Text>{paymentEntryDoc.paid_to}</Text>
                </Form.Item>
              </Form>
            </Card>
  
            <Form.Item style={{float:'right',marginTop:'-10px'}} label="Paid Amount" name="amount">
              <Text>{`₹ ${paymentEntryDoc.paid_amount}`}</Text>
            </Form.Item>
          </>
        )}
        </div>
      )}
    </Modal>
  );
};

export default EntryViewModal;