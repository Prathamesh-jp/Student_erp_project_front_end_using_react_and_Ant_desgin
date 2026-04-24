import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { branchesData } from "../data/branches";
import { useTheme } from "../context/ThemeContext";

const { Title, Text } = Typography;

const Branches = () => {
  const { dark } = useTheme();
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem("branches");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && !parsed[0].teacher) { localStorage.removeItem("branches"); return branchesData; }
      return parsed;
    }
    return branchesData;
  });
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [removeId, setRemoveId] = useState("");

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

  const inputStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white", marginBottom: 12,
  };

  useEffect(() => { localStorage.setItem("branches", JSON.stringify(branches)); }, [branches]);

  const filtered = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const getNextId = () => branches.length === 0 ? 1 : Math.max(...branches.map((b) => b.id)) + 1;

  const handleAdd = () => {
    if (!branchName) { message.error("Enter branch name ❌"); return; }
    if (!teacherName) { message.error("Enter teacher name ❌"); return; }
    setBranches([...branches, { id: getNextId(), name: branchName, teacher: teacherName }]);
    setBranchName(""); setTeacherName(""); setAddOpen(false);
    message.success("Branch added ✅");
  };

  const handleRemove = () => {
    const updated = branches.filter((b) => b.id != removeId);
    if (updated.length === branches.length) { message.error("Branch not found ❌"); return; }
    setBranches(updated); setRemoveId(""); setRemoveOpen(false);
    message.success("Branch removed 🗑️");
  };

  const columns = [
    { title: "ID",          dataIndex: "id",      key: "id",      width: 70 },
    { title: "Branch Name", dataIndex: "name",    key: "name"               },
    { title: "Teacher Name",dataIndex: "teacher", key: "teacher"            },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Title level={2} style={{ color: "white", margin: 0 }}>Branches</Title>

      <div style={{ ...glass, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
            placeholder="Search by branch or teacher..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}>
            Add Branch
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => setRemoveOpen(true)}
            style={{ background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }}>
            Remove Branch
          </Button>
        </div>

        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </div>

      {/* ADD MODAL */}
      <Modal
        title={<Text style={{ color: "#667eea" }}>Add Branch</Text>}
        open={addOpen} onCancel={() => setAddOpen(false)} footer={null}
        styles={{ content: modalStyle, header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <div style={{ marginTop: 16 }}>
          <Input placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} style={inputStyle} />
          <Input placeholder="Teacher Name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} style={inputStyle} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button onClick={() => setAddOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}>Cancel</Button>
            <Button type="primary" onClick={handleAdd} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none" }}>Add</Button>
          </div>
        </div>
      </Modal>

      {/* REMOVE MODAL */}
      <Modal
        title={<Text style={{ color: "#ef4444" }}>Remove Branch</Text>}
        open={removeOpen} onCancel={() => setRemoveOpen(false)} footer={null}
        styles={{ content: modalStyle, header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <div style={{ marginTop: 16 }}>
          <Input placeholder="Enter Branch ID" value={removeId} onChange={(e) => setRemoveId(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setRemoveOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}>Cancel</Button>
            <Button danger onClick={handleRemove} style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", color: "white" }}>Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Branches;