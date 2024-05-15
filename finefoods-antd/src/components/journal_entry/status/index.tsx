import {
    BellOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
  } from "@ant-design/icons";
  import { useTranslate } from "@refinedev/core";
  import { Tag } from "antd";
  import { BikeWhiteIcon } from "../../icons";
  
  type JEStatusProps = {
    status: "Draft" | "Journal Entry" | "Inter Company Journal Entry" | "Bank Entry" | "Cash Entry" | " Credit Card Entry" | "Debit Note" | "Credit Note" | "Contra Entry"
    | 'Excise Entry' | 'Write Off Entry' | "Opening Entry" | "Depreciation Entry" | "Exchange Rate Revaluation" | "Exchange Gain Or Loss" | "Deferred Revenue" | "Deferred Expense";
  };

  export const JournalEntryStatus: React.FC<JEStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;
    
    switch (status) {
        case "Draft":
            color = "orange";
            
            break;
        case "Journal Entry":
            color = "blue";
        
            break;
        case "Inter Company Journal Entry":
            color = "cyan";
    
            break;
        case "Bank Entry":
            color = "green";
            break;
        case "Cash Entry":
            color = "green";
   
            break;
        case "Credit Card Entry":
            color = "blue";
            break;
        case "Debit Note":
            color = "red";
       
            break;
        case "Credit Note":
            color = "magenta";
            break;
        case "Contra Entry":
            color = "purple";
            break;
        case "Excise Entry":
            color = "gold";
            break;
        case "Write Off Entry":
            color = "lime";
            break;
        case "Opening Entry":
            color = "volcano";
            break;
        case "Depreciation Entry":
            color = "geekblue";
            break;
        case "Exchange Rate Revaluation":
            color = "cyan";
            break;
        case "Exchange Gain Or Loss":
            color = "red";
            break;
        case "Deferred Revenue":
            color = "yellow";
            break;
        case "Deferred Expense":
            color = "purple";
            break;
        default:
            color = "gray";
            break;
        }
  
    return (
      <Tag color={color}>
        {status}
      </Tag>
    );
  };
  