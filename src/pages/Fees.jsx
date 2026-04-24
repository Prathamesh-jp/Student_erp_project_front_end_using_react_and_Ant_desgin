import { useState, useEffect } from "react";
import { Table, Input, Select, Tag, Typography, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { studentsData } from "../data/students";
import { useTheme } from "../context/ThemeContext";

const { Title } = Typography;

const Fees = () => {
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
    const stored = localStorage.getItem("students");
    if (!stored || JSON.parse(stored).length === 0) {
      localStorage.setItem("students", JSON.stringify(studentsData));
      setStudents(studentsData);
    } else {
      setStudents(JSON.parse(stored));
    }
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toString().includes(search)
  );

  const handleStatusChange = (id, value) => {
    const updated = students.map((s) => s.id === id ? { ...s, paid: value === "true" } : s);
    setStudents(updated);
    localStorage.setItem("students", JSON.stringify(updated));
    window.dispatchEvent(new Event("studentsUpdated"));
    message.success("Status updated ✅");
  };

  const columns = [
    { title: "ID",     dataIndex: "id",   key: "id",   width: 70 },
    { title: "Name",   dataIndex: "name", key: "name"            },
    { title: "Branch", dataIndex: "branch", key: "branch"        },
    { title: "Fees",   dataIndex: "fees", key: "fees", render: (v) => `₹${v}` },
    {
      title: "Status", key: "status",
      render: (_, record) => (
        <Select
          value={record.paid ? "true" : "false"}
          onChange={(val) => handleStatusChange(record.id, val)}
          style={{ width: 110 }}
          options={[
            { value: "true",  label: <Tag color="success" style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 20 }}>Paid</Tag> },
            { value: "false", label: <Tag color="error"   style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.4)",   borderRadius: 20 }}>Pending</Tag> },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Fees</Title>

      <div style={{ ...glass, padding: 24 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
          placeholder="Search by ID, Name, Branch..."
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8 }}
        />
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
};

export default Fees;