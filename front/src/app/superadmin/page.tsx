"use client"
import { useEffect, useState } from "react"
import { useAuth } from "../context/authContext"
import { Company, Role } from "../register/types"
import axiosCustom from "../lib/axiosInstance"
import CreateCompany from "./createCompany"
import CreatePlan from "./createPlan"
import CompaniesForPlans from "./companiesForPlans"
import { useRouter } from "next/navigation"

export const Superadmin: React.FC = () => {
    const {user}= useAuth()

    const router= useRouter();

    const[companies, setCompanies] = useState([] as Company[])
    const[createCompany, setCreateCompany]= useState(false)
    const[createPlan, setCreatePlan]= useState(false)

    useEffect(()=>{
        const fetchCompanies= async()=>{
            try{
                const response= await axiosCustom.get("http://localhost:3001/companies");
                setCompanies(response.data);
            }catch(error){
                console.error("Error al buscar empresas:", error);
            }
        }
        fetchCompanies();
    },[])

    const totalUsers= ()=>{
        let total:number=0
           companies.map((company=>{
            total+= company.users.length
           }))
              return total;
    }

    const promedy=()=>{
        const total= totalUsers();
        return total/ companies.length;
    }

    const maxUsersInCompany=()=>{
        let max:number=0
        companies.map((company=>{
            if(company.users.length> max){
                max= company.users.length
            }
        }))
        return max;
    }

    const minUsersInCompany=()=>{
        let min:number= 10000000
        companies.map((company=>{
            if(company.users.length< min){
                min= company.users.length
            }
        }))
        return min;
    }

    const handleCreateCompany=()=>{
        setCreateCompany(true)
    }

    const handleCreatePlan=()=>{
        setCreatePlan(true)
    }

    const handleSendToPlans=()=>{
        router.push("/superadmin/plans")
    }

    const handleSendToCompanies=()=>{
        router.push("/superadmin/companies")
    }

    return (
        <div className="flex flex-col items-center h-full w-full">
        {user?.role === Role.SUPERADMIN ? (
            <>
<h1 className="m-2 mt-20 text-2xl font-semibold">Bienvenido Super Administrador:  {user?.name.split(" ")[0]} </h1>
<div className="flex mt-16 gap-10">
    <div className="flex flex-col items-center">
        <h2 className="text-emerald-600 text-2xl font-semibold">Empresas:</h2>
        { companies.length !== 0 ? <p className="text-2xl font-semibold">{companies.length}</p> : <p>Cargando...</p>}
    </div>
    <div className="flex flex-col items-center">
        <h2 className="text-emerald-600 text-2xl font-semibold">Usuarios totales:</h2>
        { companies.length !== 0 ? <p className="text-2xl font-semibold">{totalUsers()}</p> : <p>Cargando...</p>}
    </div>
    <div className="flex flex-col items-center">
        <h2 className="text-emerald-600 text-2xl font-semibold">Promedio de usuarios por empresa:</h2>
        { companies.length !== 0 ? <p className="text-2xl font-semibold">{promedy()}</p> : <p>Cargando...</p>}
    </div>
    <div className="flex flex-col items-center">
        <h2 className="text-emerald-600 text-2xl font-semibold">Máximo de usuarios en una empresa:</h2>
        { companies.length !== 0 ? <p className="text-2xl font-semibold">{maxUsersInCompany()}</p> : <p>Cargando...</p>}
    </div>
    <div className="flex flex-col items-center">
        <h2 className="text-emerald-600 text-2xl font-semibold">Mínimo de usuarios en una empresa:</h2>
        { companies.length !== 0 ? <p className="text-2xl font-semibold">{minUsersInCompany()}</p> : <p>Cargando...</p>}
    </div>
</div>
<div className="flex gap-10 mt-12">
<button onClick={handleCreateCompany} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Crear Empresa</button>
        {createCompany && <CreateCompany setCreateCompany={setCreateCompany} CC={createCompany} registerOrCreate={true}/>}
<button onClick={handleCreatePlan} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Crear Plan</button>
        {createPlan && <CreatePlan setCreatePlan={setCreatePlan} CP={createPlan}/>}
</div>


    <CompaniesForPlans />

<div className="flex gap-10 mt-4">
<button onClick={handleSendToPlans} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Ver todos los planes</button>
<button onClick={handleSendToCompanies} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Ver todas las empresas</button>
</div>
            </>
        ):(
<h1 className="m-2 mt-48 text-2xl font-semibold text-red-700">Acceso denegado.</h1>
        )}
        </div>
    )
}

export default Superadmin;