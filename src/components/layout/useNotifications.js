import { useState } from "react";
import { useMarkAllNotificationsAsRead } from "../../hooks/useNotifications";

export const useNotifications = (handleOpenNotifications) => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const handleOpen = () => {
    setOpenNotifications(true);
    markAllAsRead();
    handleOpenNotifications();
  };

  const handleClose = () => {
    setOpenNotifications(false);
  };

  return { openNotifications, handleOpen, handleClose };
};