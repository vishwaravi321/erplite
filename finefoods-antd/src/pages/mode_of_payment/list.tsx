import { useFrappeDocTypeEventListener, useFrappeGetDocList } from 'frappe-react-sdk';
import {
    useTranslate,
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
  import { Skeleton, Table, Typography, Tag } from "antd";
  import { EyeOutlined } from "@ant-design/icons";
  
  
  import {
    PaginationTotal,
  } from "../../components";
  import { IItemPrice } from "../../interfaces";
  import { FrappeApp } from 'frappe-js-sdk';
  import { useEffect, useState } from "react";
  
  type CheckboxValueType = React.ReactText[];
  
  
  export const ModeofPaymentList = () => {
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [error, setError] = useState<any>(null);
    const [list, setList] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  
  
    const { data,isLoading,mutate } = useFrappeGetDocList<any>('Mode of Payment', {
        fields: ['name', 'type', 'enabled', 'mode_of_payment' , 'creation', 'modified_by'],
        limit:1000,
        asDict:true
      });

    useFrappeDocTypeEventListener('Mode of Payment', (d) => {
        console.log("Event", d)
        if (d.doctype === "Mode of Payment") {
            mutate()
        }
      })
    
    useEffect(() => {
        if (data !== list) {
          setList(data);
          setLoading(isLoading);
        }
      }, [data, list]);
  
    const t = useTranslate();
    const { show } = useNavigation();
  
    // const { isLoading, triggerExport } = useExport<IItemPrice>({
    //   pageSize: 50,
    //   maxItemCount: 50,
    //   mapData: (item) => {
    //     return {
    //       id: item.item_name, 
    //       amount: item.grand_total,
    //       orderNumber: item.name, 
    //       status: item.status,
    //       customer: item.customer,
    //     };
    //   },
    // });
  
    // const { selectProps: orderSelectProps } = useSelect<IOrderStatus>({
    //   resource: "orderStatuses",
    //   optionLabel: "text",
    //   optionValue: "text",
    // });
  
    const [loading, setLoading] = useState(false);
  
    const start = () => {
      setLoading(true);
      setTimeout(() => {
        setSelectedRowKeys([]);
        setLoading(false);
      }, 1000);
    };
  
    const { triggerExport } = useExport<IItemPrice>({
        pageSize: 50,
        maxItemCount: 50,
        mapData: (item) => {
          return {
            id: item.item_code, 
            name: item.item_name,
            pricelist: item.price_list, 
            rate: item.rate
          };
        },
      });

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
                          show("mode_of_payment", record.name);
                        },
                      };
                    }}
                    pagination={{
                      showTotal: (total) => (
                        <PaginationTotal total={total} entityName="Mode of Payment" />
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
                      key="enabled"
                      dataIndex="enabled"
                      title={("Status")}
                      render={(value)=>{
                        const status = value ? "Enabled" : "Disabled";
                        const color = value ? "blue" : "red";
                        return (
                            <Tag color={color}>{status}</Tag>
                        )
                      }}
                    />

                     <Table.Column
                      key="type"
                      dataIndex="type"
                      title={("Type")}
                    />
                    
                    <Table.Column
                      key="mode_of_payment"
                      dataIndex="mode_of_payment"
                      title={("Mode of Payment")}
                    />

                  </Table>
            </>
          )}
        </List>
      );
    };
    