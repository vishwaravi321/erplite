import React, { useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  Select,
  Space,
  Table,
} from "antd";

import {
  DeleteOutlined,
  DollarCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AccountList } from "../../components/masterData/account";
import { FormItemHorizontal } from "../form";



export const TaxTable = () => {

  const [items, setItems] = useState<{ key: React.Key; type: string; account_head: string; tax_rate: number; amount: number; total: number }[]>([
    { key: 1, type: "", account_head: "", tax_rate: 0, amount: 0, total: 0 },
  ]);    
  const accountList = AccountList();

    const handleItemChange = (index: number, field: string, value: any) => {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems[index] = { ...newItems[index], [field]: value };
        return newItems;
      });
    };

    const handleAddRow = () => {
      setItems([
        ...items,
        {
          key: items.length + 1,
          type: "",
          account_head: "",
          tax_rate: 0,
          amount: 0,
          total: 0,
        },
      ]);
    };


    const handleDeleteRow = (key: React.Key) => {
      const newItems = items.filter((item) => item.key !== key);
      setItems(newItems);
    };


    

  
    const tableColumns = [
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (_: any, record:any,index:any) => (
          <Form.Item
            name={['items', index, 'type']}
          >
            <Select
            defaultValue={'On Net Total'}
              style={{ width: "300px" }}
              >
                  <Select.Option key={'Actual'} value={'Actual'}>
                    {'Actual'}
                  </Select.Option>
                  <Select.Option key={'On Net Total'} value={'On Net Total'}>
                    {'On Net Total'}
                  </Select.Option>
                  <Select.Option key={'On Previous Row Amount'} value={'On Previous Row Amount'}>
                    {'On Previous Row Amount'}
                  </Select.Option>
                  <Select.Option key={'On Previous Row Total'} value={'On Previous Row Total'}>
                    {'On Previous Row Total'}
                  </Select.Option>
                  <Select.Option key={'On Item Quantity'} value={'On Item Quantity'}>
                    {'On Item Quantity'}
                  </Select.Option>

              </Select>
          </Form.Item>
        )
      },
      {
        title: 'Account Head',
        dataIndex: 'account_head',
        key: 'account_head',
        render: (_: any, _form: any, index: number) => (
          <Form.List name={['items', index, 'account_head']}>
            {(fields, { add, remove }) => (
              <Form.Item>
                <Select
                  style={{ width: '300px' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    (option?.value ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                  }
                  onChange={(value) => handleItemChange(index, 'account_head', value)}
                >
                  {accountList?.map((item: any) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form.List>
        ),
      },
      {
        title: "Tax Rate",
        dataIndex: "tax_rate",
        key: "tax_rate",
        render: (_: any, { tax_rate, amount }: any, index: any) => (
          <Form.Item name={["items", index, "tax_rate"]}>
            <InputNumber min={0} value={tax_rate} onChange={(value) => handleItemChange(index, "tax_rate", value)} />
          </Form.Item>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (_: any, record:any, index: any) => (
          <Form.Item
            name={['items', index, 'amount']}
          >
                <InputNumber
                min={0}
                value={record.amount}
                onChange={(value) => handleItemChange(index, "amount", value)}
                />
          </Form.Item>
        )
      },
      {
        title: "Total(INR)",
        dataIndex: "total",
        key: "total",
        render: (_: any, record:any) => record.amount * record.tax_rate,
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_: any, record: any) => (
          <Space size="middle">
            <DeleteOutlined
              onClick={() => handleDeleteRow(record.key)}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </Space>
        ),
      },
    ];

  
    return (
    <>
        <Table
            dataSource={items}
            style={{ marginTop: '20px' }}
            columns={tableColumns}
            pagination={false}
            rowKey="key"
            footer={() => (
            <FormItemHorizontal
                name="total"
                label="Total Taxes and charges (INR)"
                labelStyle={{display:'flex',float:'right'}}
                icon={<DollarCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            >
            : &nbsp; {items.reduce((total: any, item: { amount: any; }) => total + item.amount, 0)}
            </FormItemHorizontal>
            )}
        />
        <Button style={{ marginTop:'10px', marginBottom:'50px', float:'right' }} type="primary" icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={handleAddRow}>
            Add Row
        </Button>
    </>
    )}
