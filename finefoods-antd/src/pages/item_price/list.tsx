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
  import { Skeleton, Table, Typography } from "antd";
  import { EyeOutlined } from "@ant-design/icons";
  
  
  import {
    PaginationTotal,
  } from "../../components";
  import { IItemPrice } from "../../interfaces";
  import { FrappeApp } from 'frappe-js-sdk';
  import { useEffect, useState } from "react";
  
  type CheckboxValueType = React.ReactText[];
  
  
  export const ItemPriceList = () => {
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [error, setError] = useState<any>(null);
    const [list, setList] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  
  
    const { data,isLoading,mutate } = useFrappeGetDocList<any>('Item Price', {
        fields: ['item_name', 'item_code', 'price_list', 'price_list_rate' , 'creation', 'modified_by'],
        limit:1000,
        asDict:true
      });

    useFrappeDocTypeEventListener('Item Price', (d) => {
        console.log("Event", d)
        if (d.doctype === "Item Price") {
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
                          show("item_price", record.name);
                        },
                      };
                    }}
                    pagination={{
                      showTotal: (total) => (
                        <PaginationTotal total={total} entityName="ItemPrice" />
                      ),
                    }}
                  >
    
                    <Table.Column
                      key="item_code"
                      dataIndex="item_code"
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
                      key="item_name"
                      dataIndex="item_name"
                      title={("Item name")}
                    />
                    
                    <Table.Column
                      key="price_list"
                      dataIndex="price_list"
                      title={("Price List")}
                    />
                    
                    <Table.Column
                      key="price_list_rate"
                      dataIndex="price_list_rate"
                      title={"Rate"}
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
                      title={t("orders.fields.createdAt")}
                      render={(value) => <DateField value={value} format="LLL" />}
                    />
                  </Table>
            </>
          )}
        </List>
      );
    };
    