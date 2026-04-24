import { useState, useEffect } from "react";
import { Table, Input, Tag, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";

const { Title } = Typography;

const Attendance = () => {
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

  const getPercentage = (id) => 60 + (id % 36);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toString().includes(search)
  );

  const columns = [
    { title: "ID",     dataIndex: "id",     key: "id",     width: 70 },
    { title: "Name",   dataIndex: "name",   key: "name"              },
    { title: "Branch", dataIndex: "branch", key: "branch"            },
    {
      title: "Attendance %", key: "attendance",
      render: (_, record) => {
        const pct = getPercentage(record.id);
        return (
          <Tag color={pct < 75 ? "error" : "success"}
            style={{
              background: pct < 75 ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
              border: pct < 75 ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(34,197,94,0.4)",
              color: pct < 75 ? "#fca5a5" : "#86efac",
              borderRadius: 20, padding: "2px 12px",
            }}>
            {pct}%
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Attendance</Title>

      <div style={{ ...glass, padding: 24 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
          placeholder="Search by ID, Name, Branch..."
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: 16, background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8,
          }}
        />
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
};

export default Attendance;