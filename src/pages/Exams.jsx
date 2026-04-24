import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Form, Tag, Typography, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { examsData } from "../data/exams";
import { useTheme } from "../context/ThemeContext";

const { Title, Text } = Typography;

const statusColors = {
  Upcoming:  { bg: "rgba(102,126,234,0.2)", color: "#a5b4fc", border: "rgba(102,126,234,0.4)" },
  Ongoing:   { bg: "rgba(234,179,8,0.2)",   color: "#fde68a", border: "rgba(234,179,8,0.4)"   },
  Completed: { bg: "rgba(34,197,94,0.2)",   color: "#86efac", border: "rgba(34,197,94,0.4)"   },
};

const Exams = () => {
  const { dark } = useTheme();
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem("exams");
    if (saved) { const p = JSON.parse(saved); if (p.length > 0 && p[0].subject) return p; }
    return examsData;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
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

  useEffect(() => { localStorage.setItem("exams", JSON.stringify(exams)); }, [exams]);

  const allBranches = [...new Set(examsData.map((e) => e.branch))];
  const getNextId = () => exams.length === 0 ? 1 : Math.max(...exams.map((e) => e.id)) + 1;

  const filtered = exams.filter((e) => {
    const matchSearch =
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.branch.toLowerCase().includes(search.toLowerCase()) ||
      e.year.toLowerCase().includes(search.toLowerCase());
    return matchSearch &&
      (statusFilter === "All" || e.status === statusFilter) &&
      (branchFilter === "All" || e.branch === branchFilter);
  });

  const handleAdd = (values) => {
    setExams([...exams, { id: getNextId(), ...values }]);
    form.resetFields();
    setAddOpen(false);
    message.success("Exam added ✅");
  };

  const handleRemove = () => {
    const updated = exams.filter((e) => e.id != removeId);
    if (updated.length === exams.length) { message.error("Exam not found ❌"); return; }
    setExams(updated); setRemoveId(""); setRemoveOpen(false);
    message.success("Exam removed ✅");
  };

  const columns = [
    { title: "ID",      dataIndex: "id",      key: "id",      width: 60 },
    { title: "Subject", dataIndex: "subject", key: "subject"            },
    { title: "Branch",  dataIndex: "branch",  key: "branch"             },
    { title: "Year",    dataIndex: "year",    key: "year",    width: 70 },
    { title: "Date",    dataIndex: "date",    key: "date",    width: 110 },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (status) => (
        <Tag style={{
          background: statusColors[status].bg,
          color: statusColors[status].color,
          border: `1px solid ${statusColors[status].border}`,
          borderRadius: 20, padding: "2px 12px",
        }}>
          {status}
        </Tag>
      ),
    },
  ];

  const inputStyle = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white" };
  const labelStyle = { color: "rgba(255,255,255,0.7)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Exams</Title>

      <div style={{ ...glass, padding: 24 }}>
        {/* SEARCH + FILTERS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
            placeholder="Search..." onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, ...inputStyle, borderRadius: 8 }}
          />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 140 }}
            options={["All","Upcoming","Ongoing","Completed"].map((o) => ({ value: o, label: o }))} />
          <Select value={branchFilter} onChange={setBranchFilter} style={{ width: 200 }}
            options={[{ value: "All", label: "All Branches" }, ...allBranches.map((b) => ({ value: b, label: b }))]} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}>
            Add Exam
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => setRemoveOpen(true)}
            style={{ background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }}>
            Remove Exam
          </Button>
        </div>

        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </div>

      {/* ADD MODAL */}
      <Modal title={<Text style={{ color: "#667eea" }}>Add Exam</Text>}
        open={addOpen} onCancel={() => { setAddOpen(false); form.resetFields(); }} footer={null}
        styles={{ content: modalStyle, header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}>
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: 16 }}
          initialValues={{ status: "Upcoming" }}>
          <Form.Item name="subject" label={<Text style={labelStyle}>Subject</Text>} rules={[{ required: true }]}>
            <Input style={inputStyle} placeholder="Subject Name" />
          </Form.Item>
          <Form.Item name="branch" label={<Text style={labelStyle}>Branch</Text>} rules={[{ required: true }]}>
            <Select style={{ width: "100%" }} placeholder="Select Branch"
              options={allBranches.map((b) => ({ value: b, label: b }))} />
          </Form.Item>
          <Form.Item name="year" label={<Text style={labelStyle}>Year</Text>} rules={[{ required: true }]}>
            <Select style={{ width: "100%" }} placeholder="Select Year"
              options={["1st","2nd","3rd","4th"].map((y) => ({ value: y, label: y }))} />
          </Form.Item>
          <Form.Item name="date" label={<Text style={labelStyle}>Date</Text>} rules={[{ required: true }]}>
            <Input type="date" style={inputStyle} />
          </Form.Item>
          <Form.Item name="status" label={<Text style={labelStyle}>Status</Text>}>
            <Select style={{ width: "100%" }}
              options={["Upcoming","Ongoing","Completed"].map((s) => ({ value: s, label: s }))} />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => { setAddOpen(false); form.resetFields(); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}>Cancel</Button>
            <Button type="primary" htmlType="submit"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}>Add</Button>
          </div>
        </Form>
      </Modal>

      {/* REMOVE MODAL */}
      <Modal title={<Text style={{ color: "#ef4444" }}>Remove Exam</Text>}
        open={removeOpen} onCancel={() => setRemoveOpen(false)} footer={null}
        styles={{ content: modalStyle, header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}>
        <div style={{ marginTop: 16 }}>
          <Input placeholder="Enter Exam ID" value={removeId} onChange={(e) => setRemoveId(e.target.value)}
            style={{ ...inputStyle, marginBottom: 16 }} />
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

export default Exams;