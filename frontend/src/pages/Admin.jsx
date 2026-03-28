import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Admin = () => {
  const [users, setUsers] = useState([]);
  

  const [selectedUser, setSelectedUser] = useState(null);
  const [newAmount, setNewAmount] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    const res = await API.get("/api/admin/users");
    setUsers(res.data);
  };

  

  useEffect(() => {
    fetchUsers();
    
  }, []);

  // Update wallet
  const updateWallet = async () => {
    try {
      await API.post("/api/admin/wallet", {
        userId: selectedUser._id,
        amount: Number(newAmount)
      });

      setSelectedUser(null);
      setNewAmount("");

      fetchUsers();
      

    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2>Admin Dashboard</h2>


        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Wallet</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>₹{user.wallet}</td>
                <td>
                  <button
                    style={styles.editBtn}
                    onClick={() => setSelectedUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {selectedUser && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Update Wallet</h3>

              <p>Current: ₹{selectedUser.wallet}</p>

              <input
                type="number"
                placeholder="Enter new amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                style={styles.input}
              />

              <div style={{ marginTop: "15px" }}>
                <button
                  style={styles.saveBtn}
                  onClick={updateWallet}
                >
                  Save
                </button>

                <button
                  style={styles.cancelBtn}
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const styles = {
  statsContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px"
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    width: "200px"
  },
  table: {
    width: "100%",
    marginTop: "30px",
    borderCollapse: "collapse"
  },
  editBtn: {
    padding: "6px 12px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: "6px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    width: "300px"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px"
  },
  saveBtn: {
    padding: "8px 16px",
    background: "#22c55e",
    border: "none",
    color: "white",
    marginRight: "10px"
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    border: "none",
    color: "white"
  }
};

export default Admin;