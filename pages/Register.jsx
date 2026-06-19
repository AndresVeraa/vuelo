import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../src/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: username,
        email,
        role: "user",
        createdAt: new Date(),
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      const code = error?.code;
      if (code === "auth/email-already-in-use") {
        setError("El correo ya está registrado.");
      } else if (code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else if (code === "auth/invalid-email") {
        setError("El correo electrónico no es válido.");
      } else {
        setError("Error al registrar usuario. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Regístrate y comienza a usar la plataforma.</p>
        </header>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-field">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              placeholder="tu_usuario"
              className="input-field"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@example.com"
              className="input-field"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
          {error && <p className="error-text">{error}</p>}

          <p className="form-note">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}