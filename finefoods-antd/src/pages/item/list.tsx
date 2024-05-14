import {
  useTranslate,
  useNavigation,
  useGo
} from "@refinedev/core";
import {
  CreateButton,
  DateField,
  EditButton,
  List,
} from "@refinedev/antd";
import { EyeOutlined} from "@ant-design/icons";
import { Table, Typography, theme, Tag, Button } from "antd";
import {
  PaginationTotal,
} from "../../components";
import { ItemDrawerForm } from "../../components/item/drawer-form/create";
import { PropsWithChildren, useEffect, useState } from "react";
import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useLocation } from "react-router-dom";

export const ItemList = ({ children }: PropsWithChildren) => {
  const t = useTranslate();
  const [list, setList] = useState<any>([]);
  const { token } = theme.useToken();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const { showUrl } = useNavigation();
  const { pathname } = useLocation();
  const go = useGo();


  const { data, mutate } = useFrappeGetDocList<any>('Item', {
    fields: ['name', 'creation','item_group','disabled'],
    limit:1000,
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    asDict:true
  });

  useFrappeDocTypeEventListener('Payment Entry', (d) => {
    console.log("Event", d)
    if (d.doctype === "Item") {
        mutate()
    }
  })

  useEffect(() => {
    if (data !== list) {
      setList(data);
    }
  }, [data, list]);

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={() => [
          <CreateButton
          key="create"
          size="large"
          onClick={() => setIsCreateDrawerOpen(true)} // Open the create drawer
        >
          {"Create new Item"}
        </CreateButton>,
        ]}
      >
        <Table
          dataSource={list}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="Items" />
            ),
          }}
        >
          <Table.Column
            title={
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                ID 
              </Typography.Text>
            }
            dataIndex="name"
            key="name"
            width={80}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
                      <Table.Column<any>
              dataIndex="disabled"
              key="disabled"
              title={"Status"}
              render={(value) => {
                const status = value ? "Disabled" : "Enabled";
                const color = value ? "red" : "blue";
                
                return (
                  <Tag color={color} >
                    {status}
                  </Tag>
                );
              }}
            />
          <Table.Column
            key="item_group"
            dataIndex="item_group"
            title={"Item Group"}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
          <Table.Column
            key="creation"
            dataIndex="creation"
            title={t("orders.fields.createdAt")}
            render={(value) => <DateField value={value} format="LLL" />}
          />
          
          <Table.Column
            title={t("table.actions")}
            key="actions"
            fixed="right"
            align="center"
            render={(_, record: any) => {
            return (
              <Button
                icon={<EyeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                onClick={() => {
                  return go({
                    to: `${showUrl("item", record.name)}`,
                    query: {
                      to: pathname,
                    },
                    options: {
                      keepQuery: true,
                    },
                    type: "replace",
                  });
                }}
          />
            );
          }}
      />
      </Table>

      </List>
      {isCreateDrawerOpen && (
      <ItemDrawerForm
        open={isCreateDrawerOpen}
        action="create"
        onClose={() => setIsCreateDrawerOpen(false)}
        onMutationSuccess={() => {
          setIsCreateDrawerOpen(false);
          mutate();
        }}
      />
    )}
      {children}
    </>
  );
};
