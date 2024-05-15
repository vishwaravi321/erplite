import {
    BellOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
  } from "@ant-design/icons";
  import { useTranslate } from "@refinedev/core";
  import { Tag } from "antd";
  import { BikeWhiteIcon } from "../../icons";
  
  type PInvoiceStatusProps = {
    status: "Draft" | "Return" | "Debit Note Issued" | "Submitted" | "Partly Paid" | "Paid" | "Unpaid" | "Overdue" | "Cancelled" | "Internal Transfer";
  };
  
  
  export const PInvoiceStatus: React.FC<PInvoiceStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;
    let icon;
  
    switch (status) {
      case "Draft":
        color = "orange";
        icon = <ClockCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Return":
        color = "cyan";
        
        break;
      case "Debit Note Issued":
        color = "blue";
        icon = <BikeWhiteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Submitted":
        color = "green";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Partially Paid":
        color = "blue";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Paid":
        color = "green";
        icon = <CloseCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Unpaid":
        color = "red";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Overdue":
        color = "red";
        icon = <BellOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Internal Transfer":
        color = "cyan";
        icon = <BikeWhiteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Cancelled":
        color = "red";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
    }
  
    return (
      <Tag color={color} icon={icon}>
        {status}
      </Tag>
    );
  };
  