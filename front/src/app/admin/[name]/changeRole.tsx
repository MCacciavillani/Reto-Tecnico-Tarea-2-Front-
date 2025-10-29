"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axiosCustom from "@/app/lib/axiosInstance";

const schema = z.object({
  role: z.string().min(1, "Debe seleccionar un rol"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  setChangeMode: React.Dispatch<React.SetStateAction<boolean>>;
  changeMode: boolean;
  id:string
};

const ChangeRole: React.FC<Props> = ({setChangeMode,changeMode,id}) => {
const[registerOK,setRegisterOK] = useState(false);

     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>({
        resolver: zodResolver(schema),
      })

        const onSubmit =async (data: FormData) => {
            try{
              const res= await axiosCustom.patch(`http://localhost:3001/users/${id}`, data)
              if(res.data) setRegisterOK(true);
            } catch(error){
              console.error("Error al enviar los datos:", error);
            }
        }

        const onClick=()=>{
            setTimeout(() => setRegisterOK(false), 300);
            setTimeout(() => setChangeMode(false), 300);
            setTimeout(() => window.location.reload(), 300);
        }


    return (   <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 z-50
                  transition-opacity duration-300 ease-in-out
                  ${changeMode ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-blue-900/60 h-1/2 flex flex-col justify-between backdrop-blur-md 
                    rounded-2xl shadow-2xl p-3 w-full max-w-md text-center
                    transform transition-all duration-300 ease-in-out
                    ${changeMode ? "scale-100" : "scale-90"}`}
      >
        {
            registerOK ? ( <div className="flex flex-col items-center justify-around h-full">
                            <h1>Rol asignado exitosamente</h1>
                            <button onClick={onClick} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Cerrar</button>
                           </div> ) 
                :(
                <div className="flex flex-col items-center h-full">
                <h1 className=" m-2 mt-10">Cambiar Rol</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center mt-5">
                    <label htmlFor="Rol">Seleccioná un Rol:</label>
                <select id="Rol" {...register("role")}
        defaultValue={""}
        className="border p-2 rounded">
             <option value="">--Seleccioná un Rol--</option>
             <option value="ADMIN">ADMIN</option>
             <option value="USER">USER</option>
             <option value="SUPPORT">SUPPORT</option>
             <option value="AGENT">AGENT</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                <button type="submit" className="m-2 px-5 mt-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Enviar</button>
                </form>
                </div>
            )
        }
        </div>
    </div>
    )
}

export default ChangeRole;