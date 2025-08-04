import { useGetData } from "../../hooks/dashboard";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import styles from "./gameStats.module.scss";
import { useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Spin, Card, Typography, Row, Col, Statistic, Button } from "antd";
import { CONSTANTS } from "../../utils/constants.utils";
const { Title } = Typography;

const GameStats = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const { data, isSuccess, isLoading, isError, error } = useGetData(
    Boolean(isAuthenticated)
  );
  
  useEffect(() => {
    if (isError) {
      let e = error as AxiosError;
      if (e?.response?.status == 401) {
        dispatch(logout());
        navigate(CONSTANTS.SIGN_IN_PAGE);
      }
    }
  }, [isError, error, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <div className={styles.dashboard}>
        <Spin spinning={isLoading} fullscreen />
        {isSuccess && data?.stats && (
          <Card className={styles.statsCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                Game Statistics
              </Title>
              <Button
                type="default"
                onClick={() => navigate(CONSTANTS.TIC_TAC_TOE_PAGE)}
                size="large"
              >
                Play
              </Button>
            </div>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Wins"
                    value={data.stats.wins}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Losses"
                    value={data.stats.losses}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Draws"
                    value={data.stats.draws}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        )}
        {isError && (
          <Card>
            <Title level={3} style={{ textAlign: 'center', color: '#ff4d4f' }}>
              Error loading statistics
            </Title>
          </Card>
        )}
      </div>
    </>
  );
};

export default GameStats;
