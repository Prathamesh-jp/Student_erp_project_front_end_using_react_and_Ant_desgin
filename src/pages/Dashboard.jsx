import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Timeline, Button, Statistic } from "antd";
import { UserOutlined, BranchesOutlined, DollarOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [activity, setActivity] = useState([]);

  const glass = {
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
  };

  useEffect(() => {
    const loadData = () => {
      setStudents(JSON.parse(localStorage.getItem("students")) || []);
      setBranches(JSON.parse(localStorage.getItem("branches")) || []);
      setActivity(JSON.parse(localStorage.getItem("activity")) || []);
    };
    loadData();
    window.addEventListener("studentsUpdated", loadData);
    return () => window.removeEventListener("studentsUpdated", loadData);
  }, []);

  const collectedFees = students.filter((s) => s.paid).reduce((sum, s) => sum + Number(s.fees || 0), 0);
  const pendingFees = students.filter((s) => !s.paid).reduce((sum, s) => sum + Number(s.fees || 0), 0);

  const handleExport = () => {
    if (!students.length) return;
    const csv = [
      ["ID", "Name", "Branch", "Year", "Course", "Email", "Fees", "Status"],
      ...students.map((s) => [s.id, s.name, s.branch, s.year, s.course, s.email, s.fees, s.paid ? "Paid" : "Pending"]),
    ].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students.csv"; a.click();
  };

  const cards = [
    { title: "Students",       value: students.length,                              icon: <UserOutlined />,     color: "#667eea", suffix: "" },
    { title: "Branches",       value: branches.length,                              icon: <BranchesOutlined />, color: "#a855f7", suffix: "" },
    { title: "Collected Fees", value: (collectedFees / 100000).toFixed(1),          icon: <DollarOutlined />,   color: "#22c55e", suffix: "L" },
    { title: "Pending Fees",   value: (pendingFees / 100000).toFixed(1),            icon: <DollarOutlined />,   color: "#ef4444", suffix: "L" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Dashboard</Title>

      {/* STAT CARDS */}
      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card style={glass} bordered={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  padding: 12, borderRadius: 12,
                  background: `${card.color}30`,
                  color: card.color, fontSize: 22,
                }}>
                  {card.icon}
                </div>
                <Statistic
                  title={<Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{card.title}</Text>}
                  value={card.value}
                  suffix={<span style={{ color: "white" }}>{card.suffix}</span>}
                  prefix={card.suffix === "L" ? <span style={{ color: "white" }}>₹</span> : null}
                  valueStyle={{ color: "white", fontWeight: 700 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* RECENT ACTIVITY */}
      <Card title={<Text style={{ color: "white" }}>Recent Activity</Text>} style={glass} bordered={false}>
        {activity.length > 0 ? (
          <Timeline
            items={activity.slice(0, 5).map((item) => ({
              color: "#667eea",
              children: <Text style={{ color: "rgba(255,255,255,0.7)" }}>{item}</Text>,
            }))}
          />
        ) : (
          <Text style={{ color: "rgba(255,255,255,0.4)" }}>No activity yet</Text>
        )}
      </Card>

      {/* QUICK ACTIONS */}
      <Card title={<Text style={{ color: "white" }}>Quick Actions</Text>} style={glass} bordered={false}>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/students")}
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}
          >
            Add Student
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", color: "white" }}
          >
            Export Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;