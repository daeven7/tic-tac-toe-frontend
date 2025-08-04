import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { refreshToken, setAuthenticated } from '../store/slices/authSlice';
import { CONSTANTS } from '../utils/constants.utils';

export const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const hasAccessToken = localStorage.getItem(CONSTANTS.ACCESS_TOKEN_NAME);
      const hasRefreshToken = localStorage.getItem(CONSTANTS.REFRESH_TOKEN_NAME);

      if (hasAccessToken && hasRefreshToken && !isAuthenticated) {
        try {
          // refresh the token to validate it
          await dispatch(refreshToken()).unwrap();
          dispatch(setAuthenticated(true));
        } catch (error) {
          localStorage.removeItem(CONSTANTS.ACCESS_TOKEN_NAME);
          localStorage.removeItem(CONSTANTS.REFRESH_TOKEN_NAME);
          dispatch(setAuthenticated(false));
        }
      } else if (!hasAccessToken || !hasRefreshToken) {
        dispatch(setAuthenticated(false));
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  return { isAuthenticated };
}; 