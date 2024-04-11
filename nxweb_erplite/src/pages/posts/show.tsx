import { useShow, useOne } from "@refinedev/core";
import { useEffect, useState } from "react";
import { Show, MarkdownField } from "@refinedev/chakra-ui";
import { Heading, Text, Spacer } from "@chakra-ui/react";
import { FrappeApp } from 'frappe-js-sdk';
import { ICategory, IPost } from "../../interfaces";

export const PostShow: React.FC = () => {
  const [invoices, setInvoices] = useState(['']);
  const record = invoices;

  const frappe = new FrappeApp('http://49.13.142.146');
  const db = frappe.db()

  useEffect(() => {
    db.getDocList('Sales Invoice', {
      fields: ['name', 'creation'],
      limit: 10,
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
      groupBy: 'name',
      asDict: false,
    }).then((docs) => setInvoices(docs))
    .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    console.log('Invoices:', invoices);
  }, [invoices]);
  
  return (
    <Show isLoading={isLoading}>
      <Heading as="h5" size="sm">
        Id
      </Heading>
      <Text mt={2}>{invoices?.name}</Text>

      <Heading as="h5" size="sm" mt={4}>
        Title
      </Heading>
      <Text mt={2}>{invoices?.creation}</Text>

      <Heading as="h5" size="sm" mt={4}>
        Status
      </Heading>
      <Text mt={2}>{record?.status}</Text>

      <Heading as="h5" size="sm" mt={4}>
        Category
      </Heading>
      <Text mt={2}>{categoryData?.data?.title}</Text>

      <Heading as="h5" size="sm" mt={4}>
        Content
      </Heading>
      <Spacer mt={2} />
      <MarkdownField value={record?.content} />
    </Show>
  );
};
