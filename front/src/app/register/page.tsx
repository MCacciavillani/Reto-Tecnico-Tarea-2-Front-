"use client";
import React, { useEffect, useState } from "react";
import { Company } from "./types";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axiosCustom from "../lib/axiosInstance";

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().min(5, "El número de teléfono debe tener al menos 5 dígitos"),
  confirmPassword: z.string().min(6, "La confirmación de la contraseña debe tener al menos 6 caracteres"),
  companyId: z.string().min(1, "Debe seleccionar una empresa"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
})

type FormData = z.infer<typeof schema>;

export const Registro: React.FC= ()=>{
  const [companys, setCompanys]= useState([] as Company[]);
  const [registerOK, setRegisterOK]= useState(false);
  const router=useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  
  const onSubmit =async (data: FormData) => {
      const {confirmPassword, ...dataToSend}= data;
      try{
        const res= await axiosCustom.post("http://localhost:3001/users", dataToSend)
        if(res.data) setRegisterOK(true);
      }
      catch(error){
        console.error("Error al enviar los datos:", error);
      }
  }
  
const onClick=()=>{
    setRegisterOK(false);
    router.push("/login");
}

useEffect(()=>{
const fetchCompanys= async()=>{
    try{
        const response= await axiosCustom.get("http://localhost:3001/companies");
        setCompanys(response.data);
    }catch(error){
        console.error("Error al buscar empresas", error);
    }
}
fetchCompanys();
},[])

    return(
        <div className="flex flex-col items-center h-full">
            <h1 className=" m-2 mt-10">Registro</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center mt-20">
            <input type="text" {...register("name")} placeholder="Nombre completo" className="m-2 p-2 border rounded"/>
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            <input type="tel" {...register("phone")} placeholder="Numero de telefono movil" className="m-2 p-2 border rounded"/>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            <input type="email" {...register("email")} placeholder="Email" className="m-2 p-2 border rounded"/>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <input type="password" {...register("password")} placeholder="Contraseña" className="m-2 p-2 border rounded"/>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <input type="password" {...register("confirmPassword")} placeholder="Confirmar contraseña" className="m-2 p-2 border rounded"/>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            <label htmlFor="company">Seleccioná una empresa:</label>
      <select
        id="company"
        {...register("companyId")}
        defaultValue={""}
        className="border p-2 rounded"
      >
        <option value="">--Seleccioná una empresa--</option>
        {companys.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      {errors.companyId && <p className="text-red-500 text-sm">{errors.companyId.message}</p>}
            <button type="submit" className="m-2 p-1 mt-5 bg-blue-600 text-white rounded">Enviar</button>
        </form>
        {registerOK && 
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-blue-900/60 h-1/2 flex flex-col justify-between backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-md text-center">
          <p className="text-green-500 text-2xl font-semibold mt-40">Registro exitoso</p>
          <button onClick={onClick} className="m-2 px-5 py-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition-colors">Cerrar</button>
        </div>
        </div>
          }
        </div>
    )
}
export default Registro;