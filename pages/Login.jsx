import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebase.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";


export default function Login() {


const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");


const {
user,
userData,
loading:authLoading
} = useAuth();


const navigate = useNavigate();



const handleLogin = async(e)=>{

e.preventDefault();

setError("");
setLoading(true);


try{

await signInWithEmailAndPassword(
auth,
email,
password
);


}catch(error){


const code = error.code;


if(code==="auth/wrong-password"){

setError("Contraseña incorrecta");

}
else if(code==="auth/user-not-found"){

setError("Usuario no encontrado");

}
else if(code==="auth/invalid-email"){

setError("Correo inválido");

}
else{

setError("Error iniciando sesión");

}


}


setLoading(false);

};



useEffect(()=>{


if(authLoading) return;

if(!user) return;

if(!userData) return;



if(userData.role==="admin"){

navigate("/admin");

}else{

navigate("/home");

}


},[
authLoading,
user,
userData,
navigate
]);



return (

<div className="auth-page">

<div className="auth-card">


<h1 className="auth-title">
Iniciar sesión
</h1>


<p className="auth-subtitle">
Accede a tu cuenta
</p>



<form
onSubmit={handleLogin}
className="auth-form"
>


<input

type="email"

placeholder="Correo"

className="input-field"

value={email}

onChange={
e=>setEmail(e.target.value)
}

required

/>



<input

type="password"

placeholder="Contraseña"

className="input-field"

value={password}

onChange={
e=>setPassword(e.target.value)
}

required

/>



<button

disabled={loading}

className="button-primary"

>

{
loading
?
"Entrando..."
:
"Iniciar sesión"
}

</button>



{
error &&
<p className="error-text">
{error}
</p>
}


</form>


</div>

</div>


)

}