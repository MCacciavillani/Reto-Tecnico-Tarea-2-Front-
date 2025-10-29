"use client"

import { useAuth } from "@/app/context/authContext"
import axiosCustom from "@/app/lib/axiosInstance"
import { Company, Plan } from "@/app/register/types"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import AsignPlan from "./asignPlan"
import ChangeRole from "./changeRole"

const Admin:React.FC = ()=>{
    const[dataEmpresa,setDataEmepresa]=useState({} as Company)
     const[plans,setPlans]= useState([] as Plan[])
     const[asignMode,setAsignMode]= useState(false)
     const[changeMode,setChangeMode]= useState(false)
     const[idUser,setidUser]= useState("")

    const params=useParams()
    let empresa:string= ""
    if( typeof(params.name)==="string"){
        empresa= decodeURIComponent(params.name)
    }

    const{user}= useAuth()

    useEffect(()=>{
        const fetchEmpresa= async()=>{
            try{
                const dataEmpresa = await axiosCustom.get("http://localhost:3001/companies/name",{params:{name:empresa}})
                setDataEmepresa(dataEmpresa.data)
            }catch(error){
                console.error("Error al buscar empresa:", error);
            }
        }
         const fetchPlans= async()=>{
            try{
                const response= await axiosCustom.get("http://localhost:3001/plans/actives");
                setPlans(response.data);
            }catch(error){
                console.error("Error al buscar planes:", error);
            }
        }
        fetchPlans();
        fetchEmpresa()
    },[])

     const planName=(company:Company)=>{
        if(company.planHistory){
            if(company.planHistory.length>0){
                return company.planHistory[company.planHistory.length-1].plan.name
            }
            else{
                return "Ninguno"
            }
        }
    }

    const asign=()=>{
        setAsignMode(true)
    }

    const changeRole=(id:string)=>{
        setChangeMode(true)
        setidUser(id)
    }

    if(user?.role==="SUPERADMIN" || (user?.role==="ADMIN" && user.company === empresa)){
        return(
            <div className="flex flex-col items-center h-full w-full">
                <h1 className="text-2xl mt-10 font-semibold">Empresa:  <span className="text-2xl text-fuchsia-600">{empresa}</span></h1>
                <p className="text-xl mt-10">{dataEmpresa.description}</p>
                <div className="flex mt-5 gap-5">
                    <p className="text-xl mt-4">Plan activo: {planName(dataEmpresa)}</p>
                    <button onClick={asign} className="m-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium transition-colors">Asignar Plan</button>
                    {asignMode && (<AsignPlan setAsignMode={setAsignMode} plans={plans} asignMode={asignMode} companyToAsign={dataEmpresa}/>)}
                </div>
                <p className="text-xl mt-5">Mensajes disponibles: {dataEmpresa.availableMessages}</p>
                <p className="text-2xl font-semibold mt-10">Usuarios:</p>
                {dataEmpresa.users ? (dataEmpresa.users.map((user)=>(
                    <div className="flex w-3/4 justify-around m-2 border rounded-lg">
                            <p className="mt-4 font-semibold">Nombre: <span className="font-normal">{user.name}</span></p>
                            <p className="mt-4 font-semibold">Email: <span className="font-normal">{user.email}</span></p>
                            <p className="mt-4 font-semibold">Mensajes enviados: <span className="font-normal">{user.messageCount}</span></p>
                            <p className="mt-4 font-semibold">Rol: <span className="font-normal">{user.role}</span></p>
                            {user.role!=="SUPERADMIN" && <button onClick={()=>changeRole(user.id)} className="m-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium transition-colors">Cambiar Rol</button>}
                    </div>
                ))): ( <p>Cargando...</p> )
                }
                {changeMode && (<ChangeRole setChangeMode={setChangeMode} changeMode={changeMode} id={idUser}/>) }
            </div>
        )
    }
    else{
        return(
            <div className="flex flex-col items-center h-full w-full">
                <h1 className="m-2 mt-48 text-2xl font-semibold text-red-700">Acceso denegado.</h1>
            </div>
        )
    }
}

export default Admin