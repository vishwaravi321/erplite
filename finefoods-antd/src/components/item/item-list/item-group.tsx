import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const useItemList = () => {
  const [itemList, setItemList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('Item Group', {
    fields: ['name'],
    limit: 1000,
    orderBy: { field: 'creation', order: 'desc' },
    asDict: true
  });

  useEffect(() => {
    if (data !== itemList) {
      setItemList(data);
    }
  }, [data, itemList]);

  useFrappeDocTypeEventListener('Item Group', (d) => {
    if (d.doctype === "Item Group") {
      mutate();
    }
  });

  return itemList;
};