import React, { useState, useEffect } from 'react';
import { Button, Col, Skeleton, Result, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { FrappeApp } from 'frappe-js-sdk';

const App = ({ data }) => {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCode,setItemCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const frappe = new FrappeApp("http://162.55.41.54");
        const db = frappe.db();
        const doc = await db.getDoc('Item', data);
        setDoc(doc);
        setItemCode(doc.item_code)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [data]);

  return (
    <>
      {loading ? (
        <div><Skeleton active /></div>
      ) : error ? (
        <div>
          <Result status="500" title="500" subTitle={error.message} />
        </div>
      ) : (
        doc && (
          <>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="item_code" label="Item Name" rules={[{ required: true, message: 'Item Name' }]}>
                    <Input type='textarea' value={doc.item_code} placeholder="Item Name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="item_group" label="Item Group" rules={[{ required: true, message: 'Item Group' }]}>
                    <Input style={{ width: '100%' }} value={doc.item_group} placeholder="Item Group" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="stock_uom" label="UOM" rules={[{ required: true, message: 'UOM' }]}>
                    <Input style={{ width: '100%' }} value={doc.stock_uom} placeholder="UOM" />
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={16}>
              <Col span={12}>
                  <Form.Item name="valuation_rate" label="Valuation Rate" rules={[{ required: true, message: 'Please enter valuation rate' }]}>
                    <Input style={{ width: '100%' }} value={doc.valuation_rate} placeholder="Valuation Rate" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </>
        )
      )}
    </>
  );
};

export default App;