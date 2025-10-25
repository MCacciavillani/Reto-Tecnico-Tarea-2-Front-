"use client";

import { useAuth } from "@/app/context/authContext";
import { Role } from "@/app/register/types";
import Link from "next/link";

export const Navbar: React.FC= ()=>{

    const {user, logout}= useAuth()

    return (<div className="w-1/2 flex justify-around items-center">
        {user ? (
            <>
            <span className="text-white">Hola, {user.name?.split(" ")[0]}</span>
            <Link href="http://localhost:3000/profile">Perfil</Link>
            {user.role === Role.SUPERADMIN && <Link href="http://localhost:3000/admin">SuperAdmin</Link>}
            {user.role === Role.ADMIN && <Link href="http://localhost:3000/empresa">Admin</Link>}
            {user.role === Role.SUPPORT && <Link href="http://localhost:3000/suport">Suport</Link>}
            <button onClick={logout} className="bg-red-600 text-white p-1 rounded">Logout</button>
            </>
        ) : (
       <>
        <Link href="http://localhost:3000/login">Login</Link>
        <Link href="http://localhost:3000/register">Registro</Link>
       </>
        )}
    </div>
    )
}

export default Navbar;