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
    SalStatus,
    PaginationTotal,
  } from "../../components";
  import { useEffect, useState } from "react";
import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
  
  type CheckboxValueType = React.ReactText[];
  
  
  export const SalesInvList = () => {
    const [loadingInv, setLoadingInv] = useState(false);
    const [err, setErr] = useState<any>(null);
    const [list, setList] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const { createUrl } = useNavigation();
    const go = useGo();


    const { data, error,isLoading,mutate } = useFrappeGetDocList<any>('Sales Invoice', {
      fields: ['name', 'status', 'grand_total', 'customer', 'creation', 'modified_by'],
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
      limit: 1000,
      asDict: true,
    });

    useFrappeDocTypeEventListener('Sales Invoice', (d) => {
      console.log("Event", d)
      if (d.doctype === "Sales Invoice") {
          mutate()
      }
    })

    useEffect(() => {
      if (data !== list) {
        setList(data);
        setLoadingInv(isLoading);
        setErr(error)
      }
    }, [data, list]);
  
  
    const t = useTranslate();
    const { show } = useNavigation();
  
    const { triggerExport } = useExport<any>({
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
        headerButtons={()=>[
        <ExportButton onClick={triggerExport} />,
        <CreateButton
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("salesinv")}`,
            });
          }}
        >
          {"Create new Sales Invoice"}
        </CreateButton>,
        ]}
      >
        {loadingInv?(
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
                        show("salesinv", record.name);
                      },
                    };
                  }}
                  pagination={{
                    showTotal: (total) => (
                      <PaginationTotal total={total} entityName="Sales Invoice" />
                    ),
                  }}
                >
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
                    title={"Status"}
                    render={(status) => {
                      return <SalStatus status={status} />;
                    }}
                  />
                  <Table.Column
                    align="left"
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