import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
                
            });

            const data = await res.json();

            if(!res.ok){
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));

            // alert("Login successful");

            navigate("/");
        }catch(err){
            console.log(err);
            
        }
    };

    return (
        // <div style={{textAlign: "center" , marginTop: "100px"}}>
        //     <h2>Login</h2>
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome</h2>
                <p style={styles.subtitle}>Login to continue</p>

            <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{padding:"10px",margin:"10px"}}
            />
            <br/>
            <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{padding:"10px",margin:"10px"}}
            />
            <br/>
            <button onClick={handleLogin} style={styles.button}>Login</button>
            <p>Don't have an account?{" "} 
               <span onClick={()=> navigate("/register")} style={{color:"blue",cursor:"pointer"}} >
                Register
                </span> 
            </p>
            </div>
            </div>
    )
}

export default Login;

 const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "linear-gradient(135deg,#of172a, #1e293b)",
    },
    card: {
      width: "300px",
      padding: "40px",
      background: "#111827",
      borderRadius: "16px",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      textAlign: "center",
    },
    title: {
      color: "#fff",
      marginBottom: "10px",
    },
    subtitle:{
        color: "#9ca3af",
        marginBottom: "20px",
    },
    input:{
        width: "100%",
        padding: "12px",
        margin:"10px 0",
        borderRadius: "8px",
        border: "none",
        outline:"none",
        background: "#1f2937",
        color: "#fff",
    },
    button:{
        width: "100%",
        padding: "12px",
        marginTop:"15px",
        borderRadius: "8px",
        border: "none",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "#fff",
        fontWeight: "bold",
        cursor:"pointer",
    }
    
 }
