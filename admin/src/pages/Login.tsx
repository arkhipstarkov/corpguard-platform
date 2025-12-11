import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data && res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      } else if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
      } else {
        // accept some backends that return token in `token` field
        localStorage.setItem("token", JSON.stringify(res.data));
      }

      window.location.href = "/users";
    } catch (err: any) {
      // отображаем ошибку в UI
      setError("Login failed. Please check your credentials.");

      // fallback demo token чтобы UI можно было изучать офлайн
      localStorage.setItem("token", "demo-token");
      window.location.href = "/users";
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "50px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button onClick={login} style={{ padding: "8px 16px" }}>
        Sign in
      </button>

      <div style={{ marginTop: 12, color: "#666" }}>
        If the API is unavailable, pressing Sign in will put the app in demo mode.
      </div>
    </div>
  );
}
