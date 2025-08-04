import {
  ArgsProps,
  NotificationInstance,
} from "antd/es/notification/interface";
import { ALERT_TYPE } from "../types/alert.type";

export const AppUtils = {
  openNotification: (
    type: ALERT_TYPE,
    api: NotificationInstance,
    argsProps: ArgsProps
  ) => {
    api[type](argsProps);
  },
};
