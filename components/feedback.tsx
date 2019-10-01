import React, {
  useState,
  FunctionComponent,
  FormEvent,
  useEffect
} from "react";
import { Button, Form, Input, Select, Popover, Result, Row } from "antd";
import { FormComponentProps } from "antd/es/form";

interface FeedbackFormProps extends FormComponentProps {
  onSuccess?: () => void;
}

const { TextArea } = Input;
const { Option } = Select;

async function postFeedback(feedback: string, rating: string) {
  try {
    const url = "/api/feedback";
    const result = await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ feedback, rating })
    }).then(res => res.json());
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

const FeedbackForm: FunctionComponent<FeedbackFormProps> = ({
  form,
  onSuccess
}) => {
  const {
    isFieldTouched,
    getFieldError,
    getFieldDecorator,
    validateFields
  } = form;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validateFields(
      async (err, values: { feedback: string; rating: string }) => {
        if (err) {
          return;
        }
        await postFeedback(values.feedback, values.rating);

        if (typeof onSuccess === "function") {
          onSuccess();
        }
      }
    );
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item help={""} validateStatus={""}>
        {getFieldDecorator("feedback", {
          rules: [{ required: true }]
        })(<TextArea style={{ width: 300 }} autosize={{ minRows: 4 }} />)}
      </Form.Item>
      <Row type="flex" justify="space-between">
        {getFieldDecorator("rating")(
          <Select style={{ width: 60 }} size="small" placeholder="☺">
            <Option value=":heart_eyes:">😍</Option>
            <Option value=":smile:">😄</Option>
            <Option value=":confused:">😕</Option>
            <Option value=":weary:">😩</Option>
          </Select>
        )}
        <Button
          type="primary"
          size="small"
          htmlType="submit"
          disabled={!isFieldTouched("feedback") || !!getFieldError("feedback")}
        >
          Send
        </Button>
      </Row>
    </Form>
  );
};

const WrappedFeedbackForm = Form.create<FeedbackFormProps>({
  name: "feedback"
})(FeedbackForm);

export function FeedbackFormPopover() {
  const [isSent, setIsSent] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const handleVisibleChange = (visible: boolean) => setVisible(visible);
  const handleFormSuccess = () => setIsSent(true);
  useEffect(() => {
    if (isSent) {
      setTimeout(() => setIsSent(false), 4000);
    }
  });
  return (
    <Popover
      content={
        isSent ? (
          <Result
            style={{ width: 300 }}
            status="success"
            title="Your feedback has been sent"
          />
        ) : (
          <WrappedFeedbackForm onSuccess={handleFormSuccess} />
        )
      }
      title="Feedback"
      trigger="click"
      visible={visible}
      placement="bottomRight"
      onVisibleChange={handleVisibleChange}
    >
      <Button type="primary" size="small">
        Feedback
      </Button>
    </Popover>
  );
}
