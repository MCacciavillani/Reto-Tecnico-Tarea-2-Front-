"use client"

import { useAuth } from "@/app/context/authContext"
import axiosCustom from "@/app/lib/axiosInstance"
import { Company, Role } from "@/app/register/types"
import { useEffect, useState } from "react"
import CreateCompany from "../createCompany"
import { useRouter } from "next/navigation"

const AllCompanies : React.FC =()=>{
    const {user}= useAuth()

    const router= useRouter()

    const[companies,setCompanies]= useState([] as Company[])
    const[editMode,setEditMode]= useState(false)
    const[companyToEdit, setCompanyToEdit] = useState({} as Company)

    useEffect(() => {
        const fetchCompanies= async()=>{
            try{
                const response= await axiosCustom.get("http://localhost:3001/companies")
                setCompanies(response.data)
            }catch(error){
                console.error("Error al buscar companias:", error);
            }
        }
        fetchCompanies();
    }, []);

    const planName=(company:Company)=>{
        if(company.planHistory.length>0){
            return company.planHistory[company.planHistory.length-1].plan.name
        }
        else{
            return "Ninguno"
        }
    }

    const edit= (company:Company)=>{
        setEditMode(true)
        setCompanyToEdit(company)
    }

    const view= (company:Company)=>{
        router.push(`/admin/${company.name}`)
    }

    return(
<div className="flex flex-col items-center h-full w-full">
        {user?.role === Role.SUPERADMIN ? (
            <div className="flex flex-col items-center">
            <h1 className="m-2 mt-20 text-2xl font-semibold">Empresas:</h1>
                <div className="grid grid-cols-5 gap-2">
                {companies.length>0 ? (companies.map((company)=>
                   ( <div key={company.id} className="p-4 m-2 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                        <p className="mt-2">{company.description}</p>
                        <p className="mt-2">Cantidad de usuarios: {company.users.length}</p>
                        <p className="mt-2">Plan activo: {planName(company)}</p>
                        <p className="mt-2">Cantidad de mensajes disponibles: {company.availableMessages}</p>
                        <div>
                            <button onClick={()=>edit(company)} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Editar</button>
                            <button onClick={()=>view(company)} className="m-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium transition-colors">Ver Empresa</button>
                        </div>
                    </div>)
                )) : (
                    <p>Cargando...</p>
                )
                }
                </div>
                {editMode && <CreateCompany setCreateCompany={setEditMode} CC={editMode} registerOrCreate={false} id={companyToEdit.id} />}
            </div>
        ) :(
           <h1 className="m-2 mt-48 text-2xl font-semibold text-red-700">Acceso denegado.</h1>
        )}
        </div>
    )
}

export default AllCompanies