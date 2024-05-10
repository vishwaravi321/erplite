import {
    BellOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
  } from "@ant-design/icons";
  import { useTranslate } from "@refinedev/core";
  import { Tag } from "antd";
  import { BikeWhiteIcon } from "../../icons";
  
  type SalStatusProps = {
    status: "Draft" | "To Deliver" | "Overdue" | "Paid" | "Cancelled";
  };
  
  export const SalStatus: React.FC<SalStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;
    let icon;
  
    switch (status) {
      case "Draft":
        color = "orange";
        icon = <ClockCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "To Deliver":
        color = "cyan";
        icon = <BellOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Overdue":
        color = "red";
        icon = <BikeWhiteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Paid":
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
  