"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosCustom from "../lib/axiosInstance";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
  description: z.string().min(10,"La descripción debe tener al menos 10 caracteres"),
})

type FormData = z.infer<typeof schema>;

type Props = {
  setCreateCompany: React.Dispatch<React.SetStateAction<boolean>>;
  CC: boolean;
  registerOrCreate: boolean
  id?: string
};

const CreateCompany: React.FC<Props> = ({setCreateCompany, CC, registerOrCreate, id}) => {
const[registerOK,setRegisterOK] = useState(false);

     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>({
        resolver: zodResolver(schema),
      })

        const onSubmit =async (data: FormData) => {
          if(registerOrCreate){
            try{
              const res= await axiosCustom.post("http://localhost:3001/companies", data)
              if(res.data) setRegisterOK(true);
            } catch(error){
              console.error("Error al enviar los datos:", error);
            }
          }
          else{
             try{
              const res= await axiosCustom.patch(`http://localhost:3001/companies/${id}`, data)
              if(res.data) setRegisterOK(true);
            } catch(error){
              console.error("Error al enviar los datos:", error);
            }
          }
        }

        const onClick=()=>{
            setTimeout(() => setRegisterOK(false), 300);
            setTimeout(() => setCreateCompany(false), 300);
            setTimeout(() => window.location.reload(), 300);
        }


    return (   <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 z-50
                  transition-opacity duration-300 ease-in-out
                  ${CC ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-blue-900/60 h-1/2 flex flex-col justify-between backdrop-blur-md 
                    rounded-2xl shadow-2xl p-6 w-full max-w-md text-center
                    transform transition-all duration-300 ease-in-out
                    ${CC ? "scale-100" : "scale-90"}`}
      >
        {
            registerOK ? ( <div className="flex flex-col items-center justify-around h-full">
                            {registerOrCreate ? <h1>Empresa registrada correctamente</h1> : <h1>Empresa modificada correctamente</h1>}
                            <button onClick={onClick} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Cerrar</button>
                           </div> ) 
                :(
                <div className="flex flex-col items-center h-full">
                {registerOrCreate ? <h1 className=" m-2 mt-10">Registrar empresa</h1> : <h1 className=" m-2 mt-10">Modificar empresa</h1>}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center mt-20">
                <input type="text" {...register("name")} placeholder="Nombre de la empresa" className="m-2 p-2 border rounded"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                <input type="text" {...register("description")} placeholder="Descripcion de la empresa" className="m-2 p-2 border rounded"/>
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                <button type="submit" className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Enviar</button>
                </form>
                </div>
            )
        }
        </div>
    </div>
    )
}

export default CreateCompany;