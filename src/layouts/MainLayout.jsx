import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { dark } = useTheme();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) navigate("/login");
  }, [navigate]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: dark
          ? "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 40%, #0a0a20 100%)"
          : "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
      }}
    >
      <Navbar />
      <Layout style={{ background: "transparent" }}>
        <Sidebar />
        <Content style={{ padding: "24px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;