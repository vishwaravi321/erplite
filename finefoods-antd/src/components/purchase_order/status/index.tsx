import {
    BellOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
  } from "@ant-design/icons";
  import { useTranslate } from "@refinedev/core";
  import { Tag } from "antd";
  import { BikeWhiteIcon } from "../../icons";
  
  type POrderStatusProps = {
    status: "Draft" | "On Hold" | "To Receive and Bill" | "To Bill" | "To Receive" | "Completed" | "Cancelled" ;
  };

  
  export const POrderStatus: React.FC<POrderStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;
    let icon;
  
    switch (status) {
      case "Draft":
        color = "orange";
        icon = <ClockCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "To Receive":
        color = "cyan";
        icon = <BellOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "To Receieve and Bill":
        color = "blue";
        icon = <BikeWhiteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "To Bill":
        color = "green";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Cancelled":
        color = "red";
        icon = <CloseCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
      case "Completed":
        color = "green";
        icon = <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
        break;
    }
  
    return (
      <Tag color={color} icon={icon}>
        {status}
      </Tag>
    );
  };
  