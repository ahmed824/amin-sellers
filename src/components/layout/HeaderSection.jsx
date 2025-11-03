import TopBar from "../TopBar";
import NotificationsModal from "../NotificationsModal";

function HeaderSection({
  title,
  userData,
  handleLogout,
  openNotifications,
  handleOpen,
  handleClose,
  style
}) {
  return (
    <>
      <TopBar
        title={title}
        userName={userData.name}
        handleLogout={handleLogout}
        handleOpenNotifications={handleOpen}
        style={style}
      />
      <NotificationsModal open={openNotifications} onClose={handleClose} />
    </>
  );
}

export default HeaderSection;