import { Layout, Button, Badge, Space } from "antd";
import { BellOutlined, UserOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";

const { Header } = Layout;

const Navbar = () => {
  const { dark, toggleDark } = useTheme();

  return (
    <Header
      style={{
        background: dark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: "bold", color: "white",
          }}
        >
          S
        </div>
        <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
          Student ERP
        </span>
      </div>

      {/* RIGHT */}
      <Space size={8}>
        <Button
          type="text"
          icon={dark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleDark}
          style={{
            color: "white",
            background: "rgba(255,255,255,0.1)",
            border: "none",
          }}
        />
        <Badge dot color="#667eea">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{
              color: "white",
              background: "rgba(255,255,255,0.1)",
              border: "none",
            }}
          />
        </Badge>
        <Button
          type="text"
          icon={<UserOutlined />}
          style={{
            color: "white",
            background: "rgba(255,255,255,0.1)",
            border: "none",
          }}
        />
      </Space>
    </Header>
  );
};

export default Navbar;