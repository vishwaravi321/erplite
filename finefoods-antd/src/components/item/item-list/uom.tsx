import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const useUOMList = () => {
  const [itemList, setItemList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('UOM', {
    fields: ['name'],
    filters: [['enabled', '=', 1]],
    limit: 1000,
    orderBy: { field: 'creation', order: 'desc' },
    asDict: true
  });

  useEffect(() => {
    if (data !== itemList) {
      setItemList(data);
    }
  }, [data, itemList]);

  useFrappeDocTypeEventListener('UOM', (d) => {
    if (d.doctype === "UOM") {
      mutate();
    }
  });

  return itemList;
};