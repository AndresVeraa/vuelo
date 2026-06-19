import { useAuth } from "../src/context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {

const { logout, user, userData } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/");
};

const isAuthenticated = Boolean(user);

return (

<main className="landing-page">

<section className="landing-card">

<div className="landing-content">

<p className="eyebrow">
Bienvenido
</p>

<h1 className="landing-title">
{isAuthenticated ? `Hola ${userData?.name || "usuario"}` : "Bienvenido"}
</h1>

<p className="landing-copy">
{isAuthenticated ? "Estás dentro de tu cuenta." : "Inicia sesión o crea una cuenta para comenzar."}
</p>

</div>

<div className="landing-actions">

{isAuthenticated ? (
  <>
    {userData?.role === "admin" && (
      <Link to="/admin" className="button-primary">
        Panel Admin
      </Link>
    )}

    <button onClick={handleLogout} className="button-ghost">
      Cerrar sesión
    </button>
  </>
) : (
  <>
    <Link to="/login" className="button-primary">
      Iniciar sesión
    </Link>
    <Link to="/register" className="button-ghost">
      Crear cuenta
    </Link>
  </>
)}

</div>

</section>

</main>

)

}