import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const AccountList = () => {
  const filter = {"account_type":["Tax","Chargeable","Expense Account"],"company":"Sri Sasthaa Constructions"}
  const [taxAccountList, setTaxAccountList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('Account', {
    fields: ['name'],
    limit: 1000,
    filters:[['disabled','=',0]],
    orderBy: { field: 'creation', order: 'desc' },
    asDict: true
  });

  useEffect(() => {
    if (data !== taxAccountList) {
        setTaxAccountList(data);
    }
  }, [data, taxAccountList]);

  useFrappeDocTypeEventListener('Account', (d) => {
    if (d.doctype === "Account") {
      mutate();
    }
  });

  return taxAccountList;
};