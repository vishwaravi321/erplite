import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
  } from "@ant-design/icons";
  import { useTranslate } from "@refinedev/core";
  import { Tag } from "antd";
  
  type SalStatusProps = {
    status: "Draft" | "Submitted" | "Cancelled";
  };
  
  export const PaymentStatus: React.FC<SalStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;
    let icon;
  
    switch (status) {
      case "Draft":
        color = "orange";
        icon = <ClockCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Submitted":
        color = "green";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Cancelled":
        color = "red";
        icon = <CloseCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
    }
  
    return (
      <Tag color={color} icon={icon}>
        {status}
      </Tag>
    );
  };
  