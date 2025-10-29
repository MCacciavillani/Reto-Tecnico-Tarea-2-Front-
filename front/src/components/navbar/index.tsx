"use client";

import { useAuth } from "@/app/context/authContext";
import { Role } from "@/app/register/types";
import Link from "next/link";

export const Navbar: React.FC= ()=>{

    const {user, logout}= useAuth()

    const sendToCompany=()=>{
        return `http://localhost:3000/admin/${user?.company}`
    }

    return (<div className="w-1/2 flex justify-around items-center">
        <Link href="http://localhost:3000">Home</Link>
        {user ? (
            <>
            <span>Hola, {user.name?.split(" ")[0]}</span>
            <Link href="http://localhost:3000/profile">Perfil</Link>
            {user.role === Role.SUPERADMIN && <Link href="http://localhost:3000/superadmin">SuperAdmin</Link>}
            {user.role === Role.ADMIN && <Link href={sendToCompany()}>Admin</Link>}
            {user.role === Role.SUPPORT && <Link href="http://localhost:3000/suport">Suport</Link>}
            {user.role === Role.AGENT && <Link href="http://localhost:3000/agent">Agent</Link>}
            <button onClick={logout} className="bg-red-600 p-1 rounded">Logout</button>
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