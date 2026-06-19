import './App.css'

import {
Routes,
Route
} from 'react-router-dom'


import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Admin from '../pages/admin/Admin.jsx'

import ProtectedRoute from '../components/ProtectedRoute.jsx'



function App(){


return (

<Routes>


{/* Página principal */}

<Route
path="/"
element={<Home/>}
/>



{/* Login */}

<Route
path="/login"
element={<Login/>}
/>



{/* Registro */}

<Route
path="/register"
element={<Register/>}
/>



{/* Usuario logueado */}

<Route
path="/home"

element={

<ProtectedRoute>

<Home/>

</ProtectedRoute>

}

/>



{/* Admin */}

<Route
path="/admin"

element={

<ProtectedRoute adminOnly>

<Admin/>

</ProtectedRoute>

}

/>



{/* cualquier ruta rara */}

<Route
path="*"
element={<Home/>}
/>


</Routes>


)

}


export default App