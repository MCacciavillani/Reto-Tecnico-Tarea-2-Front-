"use client"

import axiosCustom from "@/app/lib/axiosInstance";
import { Plan, Role } from "@/app/register/types";
import { useEffect, useState } from "react"
import EditPlan from "./editPlan";
import { useAuth } from "@/app/context/authContext";
import CreatePlan from "../createPlan";

const PlansPage: React.FC = () => {

        const [plans, setPlans]= useState([] as Plan[]);
        const [editMode,setEditMode]= useState(false)
        const [planToEdit,setPlanToEdit]= useState({} as Plan)
        const [createMode,setCreateMode]= useState(false)

        const {user}= useAuth()

    useEffect(() => {
        const fetchPlans= async()=>{
            try{
                const response= await axiosCustom.get("http://localhost:3001/plans");
                setPlans(response.data);
            }catch(error){
                console.error("Error al buscar planes:", error);
            }
        }
        fetchPlans();
    }, []);

    const edit = (plan: Plan)=>{
            setEditMode(true)
            setPlanToEdit(plan)
    }

    const create=()=>{
        setCreateMode(true)
    }

    const del = async (plan: Plan)=>{
        if(confirm("¿Esta seguro que desea eliminar este plan?")){
            try{
                await axiosCustom.delete(`http://localhost:3001/plans/${plan.id}`)
                alert("Plan eliminado correctamente")
            }catch(error){
                console.error("Error al eliminar plan:", error)
            }
        }
    }

return (
    <div className="flex flex-col items-center h-full w-full">
    {user?.role === Role.SUPERADMIN ? 
(<div className="flex flex-col items-center h-full w-full">
    <h1 className="m-2 mt-10 text-3xl font-semibold">Planes: </h1>
    <div className="flex justify-center mt-10">
        {plans.length>0 ? (
            plans.map((plan)=>(
                <div key={plan.id} className="m-4 p-4 border rounded-lg shadow-md w-64">
                    <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                    <p className="mb-1">Descripción: {plan.description}</p>
                    <p className="mb-1">Límite de mensajes: {plan.messageLimit}</p>
                    <p className="mb-1">Precio: ${plan.price}</p>
                    <p className="mb-1">Duración (dias): {plan.duration}</p>
                    {plan.status === "ACTIVE" && <p className="mb-1 text-green-600 font-semibold">Activo</p>}
                    {plan.status === "EXPIRED" && <p className="mb-1 text-red-600 font-semibold">Inactivo</p>}
                    <div className="flex">
                    <button onClick={()=>edit(plan)} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Editar</button>
                    <button onClick={()=>del(plan)} className="m-2 px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-medium transition-colors">Eliminar</button>
                    </div>
                </div>
        )))
        : (
            <p className="text-red-500 text-xl">Cargando...</p>
        )}
        {editMode && <EditPlan setEditMode={setEditMode} editMode={editMode} planToEdit={planToEdit} />}
        {createMode && <CreatePlan setCreatePlan={setCreateMode} CP={createMode} />}
    </div>
    <button onClick={create} className="m-2 mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Crear Plan</button>
</div>)
:(<h1 className="m-2 mt-48 text-2xl font-semibold text-red-700">Acceso denegado.</h1>)
}
</div>
)
}

export default PlansPage