import { useEffect, useState } from "react";
import { Table, Card, Col, Row, Button, Input, Statistic, Tag, Typography } from "antd";
import { UserOutlined, DollarOutlined, DownloadOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";

const { Title, Text } = Typography;

const Reports = () => {
  const { dark } = useTheme();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const glass = {
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
  };

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students")) || []);
  }, []);

  const collectedFees = students.filter((s) => s.paid).reduce((sum, s) => sum + s.fees, 0);
  const pendingFees   = students.filter((s) => !s.paid).reduce((sum, s) => sum + s.fees, 0);

  const branchData = {};
  const yearData   = {};
  students.forEach((s) => {
    branchData[s.branch] = (branchData[s.branch] || 0) + 1;
    yearData[s.year]     = (yearData[s.year]     || 0) + 1;
  });

  const handleExport = () => {
    if (!students.length) return;
    const csv = [
      ["ID","Name","Branch","Year","Fees","Status"],
      ...students.map((s) => [s.id, s.name, s.branch, s.year, s.fees, s.paid ? "Paid" : "Pending"]),
    ].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "report.csv"; a.click();
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toString().includes(search)
  );

  const columns = [
    { title: "ID",     dataIndex: "id",     key: "id",     width: 70 },
    { title: "Name",   dataIndex: "name",   key: "name"              },
    { title: "Branch", dataIndex: "branch", key: "branch"            },
    { title: "Year",   dataIndex: "year",   key: "year",   width: 80 },
    { title: "Fees",   dataIndex: "fees",   key: "fees",   render: (v) => `₹${v}` },
    {
      title: "Status", dataIndex: "paid", key: "paid",
      render: (paid) => (
        <Tag style={{
          background: paid ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
          color: paid ? "#86efac" : "#fca5a5",
          border: paid ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(239,68,68,0.4)",
          borderRadius: 20, padding: "2px 12px",
        }}>
          {paid ? "Paid" : "Pending"}
        </Tag>
      ),
    },
  ];

  const statCards = [
    { title: "Total Students",  value: students.length,                             icon: <UserOutlined />,   color: "#667eea", suffix: ""  },
    { title: "Collected Fees",  value: (collectedFees / 100000).toFixed(1),         icon: <DollarOutlined />, color: "#22c55e", suffix: "L" },
    { title: "Pending Fees",    value: (pendingFees   / 100000).toFixed(1),         icon: <DollarOutlined />, color: "#ef4444", suffix: "L" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Reports</Title>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: 12 }}>
        <Button icon={<PrinterOutlined />} onClick={() => window.print()}
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}>
          Print
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExport}
          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", color: "white" }}>
          Export CSV
        </Button>
      </div>

      {/* STAT CARDS */}
      <Row gutter={[16, 16]}>
        {statCards.map((card) => (
          <Col xs={24} sm={8} key={card.title}>
            <Card style={glass} bordered={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: 12, borderRadius: 12, background: `${card.color}30`, color: card.color, fontSize: 22 }}>
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

      {/* BRANCH WISE */}
      <Card title={<Text style={{ color: "white" }}>Branch-wise Students</Text>} style={glass} bordered={false}>
        <Row gutter={[12, 12]}>
          {Object.entries(branchData).map(([b, c]) => (
            <Col xs={12} sm={8} key={b}>
              <div style={{ background: "rgba(102,126,234,0.15)", border: "1px solid rgba(102,126,234,0.25)", borderRadius: 12, padding: 12 }}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{b}</Text>
                <div style={{ color: "white", fontWeight: 700, fontSize: 20 }}>{c}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* YEAR WISE */}
      <Card title={<Text style={{ color: "white" }}>Year-wise Students</Text>} style={glass} bordered={false}>
        <Row gutter={[12, 12]}>
          {Object.entries(yearData).map(([y, c]) => (
            <Col xs={12} sm={6} key={y}>
              <div style={{ background: "rgba(118,75,162,0.15)", border: "1px solid rgba(118,75,162,0.25)", borderRadius: 12, padding: 12 }}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Year {y}</Text>
                <div style={{ color: "white", fontWeight: 700, fontSize: 20 }}>{c}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* FULL STUDENT TABLE */}
      <Card title={<Text style={{ color: "white" }}>All Students</Text>} style={glass} bordered={false}>
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
          placeholder="Search by name or ID..."
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8 }}
        />
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Reports;