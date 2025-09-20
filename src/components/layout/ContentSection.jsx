import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContentSection({ children }) {
  return (
    <>
      <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
      />
    </>
  );
}

export default ContentSection;