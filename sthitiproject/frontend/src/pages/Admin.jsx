import { useEffect, useState } from "react";

const Admin =() => {

    const [users, setUsers] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("http://localhost:5000/api/admin/users", {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            });

            const data = await res.json();

            setUsers(data);
        }

        fetchUsers();
    }, []);

    return (
        <div>
            <h1 className="admin">Admin Panel</h1>

            <div className="admin-grid">
            {users.map((user) => (
                <div className="user-card"key={user._id} style={{border:"1px solid white",margin:"10px",padding:"10px"}}>
                    <p><strong>Name: {user.name}</strong></p>
                    <p>Email: {user.email}</p>
                    <p>Wallet: ₹{user.wallet}</p>
                    {/* <p>Admin: {user.isAdmin ? "Yes" : "No"}</p> */}

                    <span className={`admin-badge ${user.isAdmin ? "admin" : "user" }`}>{user.isAdmin ? "Yes" : "No"}</span>

                    </div>
            ))}
        </div>
        </div>
    );


     };

     export default Admin;
                
    