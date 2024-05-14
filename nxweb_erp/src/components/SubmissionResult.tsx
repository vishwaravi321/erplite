import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Result, Button,Typography, Modal} from 'antd';

const { Paragraph, Text } = Typography;


const SubmissionResult = ({ status, message,visible, onCancel }) => {
  const successResult = (
        <Result
        status="success"
        title="Success!"
        subTitle={message}

        />
  );

  const errorResult = (

        <Result
        status="error"
        title="Submission Failed"
        subTitle="Please check and modify the following information before resubmitting."

        >
        <div className="desc">
            <Paragraph>
            <Text strong style={{ fontSize: 16 }}>
                The content you submitted has the following error:
            </Text>
            </Paragraph>
            <Paragraph>
            <CloseCircleOutlined /> {message}
            </Paragraph>
        </div>
        </Result>
  );

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1300}
    >
      {status === 'success' ? successResult : errorResult}
    </Modal>
  );
};

export default SubmissionResult;