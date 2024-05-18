import {
  useTranslate,
  useExport,
  useNavigation,
  useGo,
} from "@refinedev/core";

import {
  List,
  DateField,
  EditButton,
  NumberField,
  ExportButton,
  CreateButton,
} from "@refinedev/antd";
import { Skeleton, Table, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";


import {
  OrderStatus,
  PaginationTotal,
} from "../../components";
import { ISalesOrder, IOrderStatus } from "../../interfaces";
import { useEffect, useState } from "react";
import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";



export const OrderList = () => {
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState<any>(null);
  const [list, setList] = useState<any>([]);
  const go = useGo();
  const { createUrl } = useNavigation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);


  const { data, error,isLoading,mutate } = useFrappeGetDocList<any>('Sales Order', {
    fields: ['name', 'status', 'grand_total', 'customer', 'creation', 'modified_by'],
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    limit: 1000,
    asDict: true,
  });

  useFrappeDocTypeEventListener('Sales Order', (d) => {
    console.log("Event", d)
    if (d.doctype === "Sales Order") {
        mutate()
    }
  })

  useEffect(() => {
    if (data !== list) {
      setList(data);
      setLoadingOrder(isLoading);
      setOrderError(error)
    }
  }, [data, list]);

  const t = useTranslate();
  const { show } = useNavigation();

  const { triggerExport } = useExport<ISalesOrder>({
    pageSize: 50,
    maxItemCount: 50,
    mapData: (list) => {
      console.log("data");
      
      console.log(list);
      
      return {
        id: list.name, 
        amount: list.grand_total,
        orderNumber: list.name, 
        status: list.status,
        customer: list.customer,
      };
    },
  });

  const [loading, setLoading] = useState(false);

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
    <List
      headerButtons={() => [
        <ExportButton onClick={triggerExport} loading={isLoading} />,
        <CreateButton
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("orders")}`,
              // query: {
              //   to: "/products",
              // },
              // options: {
              //   keepQuery: true,
              // },
              // type: "replace",
            });
          }}
        >
          {"Create new Sales Order"}
        </CreateButton>,
        ]}
    >
      {loadingOrder?(
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
                show("orders", record.name);
              },
            };
          }}
          pagination={{
            showTotal: (total) => (
            <PaginationTotal total={total} entityName="orders" />
          ),
          }}
        >
          <Table.Column
            key="name"
            dataIndex="name"
            title={t("orders.fields.order")}
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
          <Table.Column<ISalesOrder>
            key="status"
            dataIndex="status"
            title={t("orders.fields.status")}
            render={(status) => {
              return <OrderStatus status={status} />;
            }}
          />
          <Table.Column
            align="right"
            key="grand_total"
            dataIndex="grand_total"
            title={t("orders.fields.amount")}
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
                  key="customer"
                  dataIndex="customer"
                  title={t("orders.fields.customer")}
                />
                <Table.Column
                  key="creation"
                  dataIndex="creation"
                  title={t("orders.fields.createdAt")}
                  render={(value) => <DateField value={value} format="LLL" />}
                />
                <Table.Column<any>
                  fixed="right"
                  title={t("table.actions")}
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