import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext.jsx";


export default function ProtectedRoute({
  children,
  adminOnly = false
}) {


const {
  user,
  userData,
  loading,
  isLoggingOut
} = useAuth();



if(loading || isLoggingOut){

return (

<div className="auth-page">

<div className="auth-card">

<p className="auth-subtitle">
Cargando...
</p>

</div>

</div>

)

}



if(!user){

return <Navigate to="/login" replace />

}



if(adminOnly && userData?.role !== "admin"){

return (

<div className="auth-page">

<div className="auth-card">

<h1 className="auth-title">
No autorizado
</h1>


<p className="auth-subtitle">
No tienes permisos de administrador.
</p>


</div>

</div>

)

}



return children;


}