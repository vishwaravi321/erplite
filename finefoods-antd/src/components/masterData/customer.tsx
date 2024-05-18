import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const CustomerList = () => {
  const [customerList, setCustomerList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('Customer', {
    fields: ['name'],
    limit: 1000,
    filters:[['disabled','=',0]],
    orderBy: { field: 'creation', order: 'desc' },
    asDict: true
  });

  useEffect(() => {
    if (data !== customerList) {
        setCustomerList(data);
    }
  }, [data, customerList]);

  useFrappeDocTypeEventListener('Customer', (d) => {
    if (d.doctype === "Customer") {
      mutate();
    }
  });

  return customerList;
};