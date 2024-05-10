import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { Tag } from "antd";
import { BikeWhiteIcon } from "../../icons";

type OrderStatusProps = {
  status: "Draft" | "To Deliver" | "To Deliver and Bill" | "To Bill" | "Cancelled";
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
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
    case "To Deliver and Bill":
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
  }

  return (
    <Tag color={color} icon={icon}>
      {status}
    </Tag>
  );
};
