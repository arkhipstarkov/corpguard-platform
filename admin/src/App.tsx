import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Violations from "./pages/Violations";
import Equipment from "./pages/Equipment";
import Analytics from "./pages/Analytics";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/users" element={<Users />} />
                <Route path="/violations" element={<Violations />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

