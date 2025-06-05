import React, { useState } from "react";
import { login, getUsers } from "./api";

function App() {
  const [email, setEmail] = useState("carlos@example.com");
  const [password, setPassword] = useState("pass123");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result && result.token) {
      setToken(result.token);
      setUser(result.user);
    } else {
      alert("Login failed");
    }
  };

  const handleGetUsers = async () => {
    const users = await getUsers(token);
    setUsers(users);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Gym4ULSA Login</h2>
      {!token ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button type="submit" style={{ width: "100%" }}>Login</button>
        </form>
      ) : (
        <div>
          <p>Bienvenido, {user.name} ({user.email})</p>
          <button onClick={handleGetUsers}>Ver todos los usuarios</button>
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.name} ({u.email})</li>
            ))}
          </ul>
          <button onClick={() => { setToken(""); setUser(null); setUsers([]); }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;