import { Tag, Typography, theme } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { useConfigProvider } from "../../../context";

export const ItemStatus = ({ value }: any) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === "dark";

  return (
    <Tag
      color={value ? "default" : "green"}
      style={{
        color: value ?  token.colorTextTertiary : token.colorSuccess,
        marginInlineEnd: 0,
      }}
      icon={
        value ? (
            <StopOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ) : (
          <CheckCircleOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        )
      }
    >
      <Typography.Text
        style={{
          color: !value
            ? isDark
              ? token.green7
              : "#3C8618"
            : isDark
            ? token.colorTextTertiary
            : token.colorTextTertiary
        }}
      >
        {value === 0 ? 'Enable' : 'Disable'}
      </Typography.Text>
    </Tag>
  );
};