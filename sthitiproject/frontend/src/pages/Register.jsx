import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"

const Register = () => {
    const[name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister =async() => {
        try{
            const res = await fetch("http://localhost:5000/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await res.json();

            if(!res.ok){
                alert(data.message);
                return;
            }

            alert("Registration successful");
            navigate("/login");
        }catch(err){
            console.log(err);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <input type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <br/>

            <input type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            <br/>

            <input type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <br/>
            <button onClick={handleRegister}>Register</button>

            <p style={{marginTop:"10px"}}>Already have an account?{" "}
           <span  onClick={() => navigate("/login")} style={{color:"blue",cursor:"pointer"}}>Login
            
            </span></p>

        </div>
    )


}

export default Register;