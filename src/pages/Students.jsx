import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { studentsData } from "../data/students";
import { useTheme } from "../context/ThemeContext";

const { Title, Text } = Typography;

const Students = () => {
  const { dark } = useTheme();
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem("students")) || studentsData);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [form] = Form.useForm();

  const glass = {
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
  };

  const modalStyle = {
    background: dark ? "rgba(15,15,40,0.97)" : "rgba(20,20,60,0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16,
  };

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toString().includes(search)
  );

  const getNextId = () => students.length === 0 ? 101 : Math.max(...students.map((s) => s.id)) + 1;

  const addActivity = (text) => {
    const a = JSON.parse(localStorage.getItem("activity")) || [];
    a.unshift(text);
    localStorage.setItem("activity", JSON.stringify(a));
  };

  const handleAdd = (values) => {
    const newStudent = { id: getNextId(), ...values, fees: 0, paid: false };
    setStudents([...students, newStudent]);
    form.resetFields();
    setAddOpen(false);
    addActivity(`Added: ${values.name}`);
    message.success("Student added ✅");
  };

  const handleRemove = () => {
    const updated = students.filter((s) => s.id != removeId);
    if (updated.length === students.length) { message.error("Student not found ❌"); return; }
    setStudents(updated);
    addActivity(`Removed student ID: ${removeId}`);
    setRemoveId("");
    setRemoveOpen(false);
    message.success("Student removed 🗑️");
  };

  const columns = [
    { title: "ID",     dataIndex: "id",     key: "id",     width: 70  },
    { title: "Name",   dataIndex: "name",   key: "name"               },
    { title: "Branch", dataIndex: "branch", key: "branch"             },
    { title: "Year",   dataIndex: "year",   key: "year",   width: 80  },
    { title: "Course", dataIndex: "course", key: "course"             },
    { title: "Email",  dataIndex: "email",  key: "email"              },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Students</Title>

      <div style={{ ...glass, padding: 24 }}>
        {/* SEARCH + BUTTONS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
            placeholder="Search by ID, Name, Branch..."
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white", borderRadius: 8,
            }}
          />
          <Button
            type="primary" icon={<PlusOutlined />}
            onClick={() => setAddOpen(true)}
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}
          >
            Add Student
          </Button>
          <Button
            danger icon={<DeleteOutlined />}
            onClick={() => setRemoveOpen(true)}
            style={{ background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }}
          >
            Remove Student
          </Button>
        </div>

        {/* TABLE */}
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, style: { color: "white" } }}
          style={{ background: "transparent" }}
        />
      </div>

      {/* ADD MODAL */}
      <Modal
        title={<Text style={{ color: "#667eea", fontSize: 16 }}>➕ Add Student</Text>}
        open={addOpen}
        onCancel={() => { setAddOpen(false); form.resetFields(); }}
        footer={null}
        styles={{ content: modalStyle, header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: 16 }}>
          {["name", "branch", "year", "course", "email"].map((field) => (
            <Form.Item key={field} name={field} rules={[{ required: true }]}
              label={<Text style={{ color: "rgba(255,255,255,0.7)" }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>}>
              <Input style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }} />
            </Form.Item>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => { setAddOpen(false); form.resetFields(); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}>
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      {/* REMOVE MODAL */}
      <Modal
        title={<Text style={{ color: "#ef4444", fontSize: 16 }}>🗑️ Remove Student</Text>}
        open={removeOpen}
        onCancel={() => setRemoveOpen(false)}
        footer={null}
        styles={{ content: modalStyle, header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <div style={{ marginTop: 16 }}>
          <Input
            placeholder="Enter Student ID"
            value={removeId}
            onChange={(e) => setRemoveId(e.target.value)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", marginBottom: 16 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setRemoveOpen(false)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}>Cancel</Button>
            <Button danger onClick={handleRemove}
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", color: "white" }}>Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Students;