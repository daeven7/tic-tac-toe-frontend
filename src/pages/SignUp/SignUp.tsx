import React, { useEffect } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signUp, clearError } from "../../store/slices/authSlice";
import { AppUtils } from "../../utils/app.utils";
import { ALERT_TYPE } from "../../types/alert.type";
import { Typography } from "antd";
import { CONSTANTS } from "../../utils/constants.utils";

const { Text } = Typography;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(CONSTANTS.GAME_STATS_PAGE);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      AppUtils.openNotification(ALERT_TYPE.ERROR, api, {
        message: "Error",
        description: error,
        placement: "topRight",
      });
      dispatch(clearError());
    }
  }, [error, api, dispatch]);

  const onFinish = async (values: any) => {
    try {
      await dispatch(signUp(values)).unwrap();
      navigate(CONSTANTS.SIGN_IN_PAGE);
    } catch (e: any) {
      console.log("error in signup page", e);
    }
  };

  return (
    <div className="centeredForm">
      <Card className="formCard">
        {contextHolder}
        <div className="container">
          <Text strong className="formTitle">
            Sign Up
          </Text>
          <Form
            name="signup"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
                {
                  pattern:
                    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
                  message:
                    "Password must be at least 8 characters long, have at least 1 letter, 1 number, and 1 special character.",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                block 
                type="primary" 
                htmlType="submit" 
                className="button"
                loading={loading}
              >
                Sign Up
              </Button>
              <div className="formFooter">
                or{" "}
                <Link to="/" className="link">
                  {" "}
                  Back to Sign In!{" "}
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
