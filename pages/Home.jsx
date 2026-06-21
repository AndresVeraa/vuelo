import { useAuth } from "../src/context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { MapPin } from "lucide-react";

export default function Home() {
  const { logout, user, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const isAuthenticated = Boolean(user);

  const authActions = (
    <>
      {userData?.role === "admin" && (
        <Link to="/admin" className="button-primary" data-testid="admin-panel-link">
          Panel Admin
        </Link>
      )}
      <Link to="/reservar" className="button-primary" data-testid="book-transfer-link">
        Reservar traslado
      </Link>
      <button onClick={handleLogout} className="button-ghost" data-testid="logout-button">
        Cerrar sesión
      </button>
    </>
  );

  const guestActions = (
    <>
      <Link to="/login" className="button-primary" data-testid="login-link">
        Iniciar sesión
      </Link>
      <Link to="/register" className="button-ghost" data-testid="register-link">
        Crear cuenta
      </Link>
    </>
  );

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?q=80&w=2000&auto=format&fit=crop')" }}
      data-testid="home-page"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"></div>

      <section
        className="relative z-10 flex min-h-screen items-center justify-center px-6"
        data-testid="home-card"
      >
        <div className="w-full max-w-2xl text-center">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-100"
            data-testid="home-eyebrow"
          >
            Bienvenido
          </p>

          <h1
            className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-serif)" }}
            data-testid="home-title"
          >
            {isAuthenticated ? `Hola ${userData?.name ?? "usuario"}` : "Bienvenido"}
          </h1>

          <p className="mt-4 text-base text-white/85 md:text-lg" data-testid="home-copy">
            {isAuthenticated
              ? "Estás dentro de tu cuenta."
              : "Inicia sesión o crea una cuenta para comenzar."}
          </p>

          <div
            className="mt-10 inline-flex flex-col gap-4 rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-md sm:flex-row sm:items-center"
            data-testid="home-actions"
          >
            <MapPin className="hidden h-5 w-5 shrink-0 text-amber-200 sm:block" />
            {isAuthenticated ? authActions : guestActions}
          </div>
        </div>
      </section>
    </main>
  );
}