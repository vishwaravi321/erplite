import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";

export const CompanyList = () => {
  const [companyList, setCompanyList] = useState<any>([]);
  const { data, mutate } = useFrappeGetDocList<any>('Company', {
    fields: ['name'],
    limit: 1000,
    orderBy: { field: 'creation', order: 'desc' },
    asDict: true
  });

  useEffect(() => {
    if (data !== companyList) {
        setCompanyList(data);
    }
  }, [data, companyList]);

  useFrappeDocTypeEventListener('Company', (d) => {
    if (d.doctype === "Company") {
      mutate();
    }
  });

  return companyList;
};