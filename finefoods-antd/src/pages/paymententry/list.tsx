import { useFrappeDocTypeEventListener, useFrappeGetDocList } from 'frappe-react-sdk';
import {
  useExport,
  useNavigation,
} from "@refinedev/core";

import {
  List,
  DateField,
  EditButton,
  NumberField,
  ExportButton,
} from "@refinedev/antd";
import { Skeleton, Table, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";


import {
  PaymentStatus,
  PaginationTotal,
} from "../../components";
import { ISalesOrder, IOrderStatus } from "../../interfaces";
import { useEffect, useState } from "react";



export const Paymentent = () => {
  const [list, setList] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const { data,isLoading,mutate } = useFrappeGetDocList<any>('Payment Entry', {
    fields: ['name','party','status','payment_type','posting_date','mode_of_payment', 'creation', 'paid_amount'],
    limit:1000,
    asDict:true
  });

  useFrappeDocTypeEventListener('Payment Entry', (d) => {
    console.log("Event", d)
    if (d.doctype === "Payment Entry") {
        mutate()
    }
  })

  useEffect(() => {
    if (data !== list) {
      setList(data);
    }
  }, [data, list]);

  const { show } = useNavigation();

  const { triggerExport } = useExport<ISalesOrder>({
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => {
      return {
        id: item.name, 
        amount: item.grand_total,
        orderNumber: item.name, 
        status: item.status,
        customer: item.customer,
      };
    },
  });

  const start = () => {
    setTimeout(() => {
      setSelectedRowKeys([]);
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
    <List
      headerProps={{
        extra: <ExportButton onClick={triggerExport} loading={isLoading} />,
      }}
    >
      {isLoading?(
        <Skeleton active loading={true} paragraph={{ rows: 20 }} />
      ):(
        <>
              <Table
                dataSource={list}
                rowKey="name"
                style={{
                  cursor: "pointer",
                }}
                rowSelection={rowSelection}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      show("paymentent", record.name);
                    },
                  };
                }}
                pagination={{
                  showTotal: (total) => (
                    <PaginationTotal total={total} entityName="Payment" />
                  ),
                }}
              >
                <Table.Column
                  key="party"
                  dataIndex="party"
                  title={"Title"}
                />

                <Table.Column
                  key="name"
                  dataIndex="name"
                  title={"ID"}
                  render={(value) => (
                    <Typography.Text
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      # {value}
                    </Typography.Text>
                  )}
                />
                <Table.Column
                  key="status"
                  dataIndex="status"
                  title={("Status")}
                  render={(status) => {
                    return <PaymentStatus status={status} />;
                  }}
                />
                
                <Table.Column
                  key="posting_date"
                  dataIndex="posting_date"
                  title={"Posting Date"}
                />
                
                <Table.Column
                  key="mode_of_payment"
                  dataIndex="mode_of_payment"
                  title={"Mode of Payment"}
                />

                <Table.Column
                  align="right"
                  key="paid_amount"
                  dataIndex="paid_amount"
                  title={"Amount Paid"}
                  render={(value) => {
                    return (
                      <NumberField
                        options={{
                          currency: "INR",
                          style: "currency",
                        }}
                        value={value}
                      />
                    );
                  }}
                />
                <Table.Column
                  key="creation"
                  dataIndex="creation"
                  title={"createdAt"}
                  render={(value) => <DateField value={value} format="LLL" />}
                />
                <Table.Column<any>
                  fixed="right"
                  title={"Actions"}
                  dataIndex="actions"
                  key="actions"
                  align="center"
                  render={(_, record) => {
                    return (
                      <EditButton
                        icon={<EyeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        hideText
                        recordItemId={record.id}
                      />
                    );
                  }}
                />
              </Table>
        </>
      )}
    </List>
  );
};
