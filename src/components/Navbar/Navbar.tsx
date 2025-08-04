import React, { useEffect } from "react";
import { Layout, Button, notification } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, clearError } from "../../store/slices/authSlice";
import styles from "./navbar.module.scss";
import { AppUtils } from "../../utils/app.utils";
import { ALERT_TYPE } from "../../types/alert.type";
const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [api, contextHolder] = notification.useNotification();

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

  const onClick = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (e: any) {
      console.log(error)
    }
  };

  return (
    <Layout>
       {contextHolder}
      <Header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.appName}>My App</div>
          <div>
            <Button
              icon={<LogoutOutlined />}
              onClick={onClick}
              className={styles.navBarButton}
              loading={loading}
            >
              Logout
            </Button>
          </div>
        </div>
      </Header>
    </Layout>
  );
};

export default Navbar;
