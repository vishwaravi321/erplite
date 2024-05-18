import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const WarehouseList = () => {
  const [warehouseList, setWarehouseList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('Warehouse', {
    fields: ['name'],
    limit: 1000,
    filters:[['disabled','=',0]],
    orderBy: { field: 'creation', order: 'desc' },
    asDict: true
  });

  useEffect(() => {
    if (data !== warehouseList) {
        setWarehouseList(data);
    }
  }, [data, warehouseList]);

  useFrappeDocTypeEventListener('Warehouse', (d) => {
    if (d.doctype === "Warehouse") {
      mutate();
    }
  });

  return warehouseList;
};