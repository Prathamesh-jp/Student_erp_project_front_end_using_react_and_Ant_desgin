import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (values.email === "prathmeshmhettar@gmail.com" && values.password === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        message.success("Login successful ✅");
        navigate("/");
      } else {
        message.error("Invalid credentials ❌");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GLOW */}
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "#667eea", filter: "blur(80px)", opacity: 0.15,
        top: "20%", left: "25%",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "#764ba2", filter: "blur(80px)", opacity: 0.15,
        bottom: "20%", right: "25%",
      }} />

      {/* CARD */}
      <div style={{
        width: 400, padding: 40, borderRadius: 20,
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        position: "relative",
      }}>
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 12px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, fontWeight: "bold", color: "white",
          }}>
            S
          </div>
          <Title level={3} style={{ color: "white", margin: 0 }}>Student ERP</Title>
          <Text style={{ color: "rgba(255,255,255,0.45)" }}>Welcome back! Please login</Text>
        </div>

        <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
          <Form.Item name="email" rules={[{ required: true, message: "Enter email" }]}>
            <Input
              prefix={<MailOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
              placeholder="Enter Email"
              size="large"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white", borderRadius: 10,
              }}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
              placeholder="Enter Password"
              size="large"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white", borderRadius: 10,
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                border: "none", borderRadius: 10, height: 46, fontWeight: 600,
                boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ display: "block", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          Demo: prathmeshmhettar@gmail.com / 1234
        </Text>
      </div>
    </div>
  );
};

export default Login;