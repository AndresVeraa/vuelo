import { useAuth } from "../../src/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


export default function Admin() {

const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/");
};



return (

<main className="admin-page">

<section className="admin-card">


<header className="admin-header">

<h1 className="admin-title">
Panel de administración
</h1>


<p className="admin-subtitle">

Bienvenido al área privada. Solo los usuarios con rol de administrador pueden ver esta sección.

</p>


</header>



<div className="admin-content">


<p>
Desde aquí puedes gestionar usuarios, revisar datos y explorar funciones avanzadas.
</p>



<button

onClick={handleLogout}

className="button-ghost"

>

Cerrar sesión

</button>



</div>


</section>


</main>

)

}