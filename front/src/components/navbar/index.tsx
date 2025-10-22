import Link from "next/link";

export const Navbar: React.FC= ()=>{
    return (<div className="w-1/2 flex justify-around items-center">
        <Link href="http://localhost:3000/login">Login</Link>
        <Link href="http://localhost:3000/register">Registro</Link>
    </div>
    )
}

export default Navbar;