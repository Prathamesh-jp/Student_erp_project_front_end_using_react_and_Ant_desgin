import { Layout, Menu, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined, TeamOutlined, BranchesOutlined,
  CheckSquareOutlined, DollarOutlined, BookOutlined,
  BarChartOutlined, LogoutOutlined,
} from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme();

  const menuItems = [
    { key: "/",           icon: <DashboardOutlined />, label: "Dashboard"  },
    { key: "/students",   icon: <TeamOutlined />,      label: "Students"   },
    { key: "/branches",   icon: <BranchesOutlined />,  label: "Branches"   },
    { key: "/attendance", icon: <CheckSquareOutlined />,label: "Attendance" },
    { key: "/fees",       icon: <DollarOutlined />,    label: "Fees"       },
    { key: "/exams",      icon: <BookOutlined />,      label: "Exams"      },
    { key: "/reports",    icon: <BarChartOutlined />,  label: "Reports"    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <Sider
      width={220}
      style={{
        background: dark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        style={{
          background: "transparent",
          border: "none",
          marginTop: 16,
          color: "white",
        }}
        theme="dark"
      />

      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            background: "rgba(239,68,68,0.2)",
            borderColor: "rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;