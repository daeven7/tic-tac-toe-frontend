import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Card, Typography } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signIn, clearError } from "../../store/slices/authSlice";
import { AppUtils } from "../../utils/app.utils";
import { ALERT_TYPE } from "../../types/alert.type";
import { CONSTANTS } from "../../utils/constants.utils";

const { Text } = Typography;

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      navigate(CONSTANTS.GAME_STATS_PAGE);
    }
  }, [isAuthenticated, navigate, location.pathname]);

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
      await dispatch(signIn(values)).unwrap();
    } catch (e: any) {
      console.log("error in signin page", e);
    }
  };

  return (
    <div className="centeredForm">
      {contextHolder}

      <Card className="cardForm">
        <div className="container">
          <Text strong className="formTitle">
            Sign In
          </Text>
          <Form
            name="login"
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
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
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
                Sign In
              </Button>
              <div className="formFooter">
                or{" "}
                <Link to="/signup" className="link">
                  {" "}
                  Sign Up now!{" "}
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SignInPage;
