"use client";
import { useAuth } from "../context/authContext";
import { Role } from "../register/types";

export const Profile: React.FC= ()=> {

    const{user}= useAuth()

    const userRole=()=>{
        if(user?.role===Role.SUPERADMIN) return "Super Administrador";
        if(user?.role===Role.ADMIN) return "Administrador de empresa";
        if(user?.role===Role.SUPPORT) return "Soporte";
        if(user?.role===Role.AGENT) return "Agente";
        return "Usuario básico";
    }

    return (
        <>
        {
user ? (

    <div className="flex flex-col items-center h-full w-full">
        <div className="flex">
    <h1 className="m-2 mt-24 text-2xl font-semibold">Perfil de: </h1>
    <p className="m-1 mt-24 text-orange-700 text-2xl">{user?.name} </p>
        </div>
        <div className="flex">
    <p className="m-2 mt-14 font-semibold">Empresa: </p>
    <p className="m-2 mt-14 text-orange-700">{user?.company}</p>
        </div>
        <div className="flex">
    <p className="m-2 font-semibold">Rol: </p>
    <p className="m-2 text-orange-700">{userRole()}</p>
        </div>
        <div className="flex">
    <p className="m-2 font-semibold">Email: </p>
    <p className="m-2 text-orange-700">{user?.email}</p>
        </div>
        <div className="flex">
    <p className="m-2 font-semibold">Teléfono: </p>
    <p className="m-2 text-orange-700">{user?.phone}</p>
        </div>
        <div className="flex">
    <p className="m-2 font-semibold">Mensajes enviados: </p>
    <p className="m-2 text-orange-700">{user?.messageCount}</p>
        </div>
    </div>
):(
    <div className="flex flex-col items-center h-full">
        <h1 className="m-2 mt-24 font-semibold text-red-700 text-2xl">No estás logueado</h1>
        <p className="m-2 mt-10 font-semibold text-red-700 text-2xl">Por favor, inicia sesión para ver tu perfil.</p>
    </div>
)
        }
        </>
    )
       }

export default Profile;