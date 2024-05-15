import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const ItemList = () => {
  const [itemList, setItemList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('Item', {
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

  useFrappeDocTypeEventListener('Item', (d) => {
    if (d.doctype === "Item") {
      mutate();
    }
  });

  return itemList;
};