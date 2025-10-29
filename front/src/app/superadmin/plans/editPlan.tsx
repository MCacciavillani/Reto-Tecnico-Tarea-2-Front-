"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosCustom from "@/app/lib/axiosInstance";
import { Plan } from "@/app/register/types";

const schema = z.object({
  name: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
  description: z.string().min(10,"La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(0,"El precio debe ser un número positivo"),
  messageLimit: z.number().min(0,"El límite de mensajes debe ser un número positivo"),
  type: z.enum(["MONTHLY", "YEARLY", "CUSTOM"], "Tipo de plan inválido, debe ser MONTHLY, YEARLY o CUSTOM"),
  status: z.enum(["ACTIVE","EXPIRED"],"El estado debe ser ACTIVE o EXPIRED"),
  duration: z.number().optional()
}).superRefine((data, ctx) => {
    if (data.type === "CUSTOM" && !data.duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La duración es obligatoria para planes personalizados",
        path: ["duration"],
      });
    }
  });

type FormData = z.infer<typeof schema>;

type Props = {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  planToEdit: Plan
};

const EditPlan: React.FC<Props> = ({setEditMode, editMode, planToEdit}) => {
const[registerOK,setRegisterOK] = useState(false);

    const router=useRouter();

     const {
        watch,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>({
        resolver: zodResolver(schema),
      })

      const selectedType = watch("type");

        const onSubmit =async (data: FormData) => {
            try{
              const res= await axiosCustom.patch(`http://localhost:3001/plans/${planToEdit.id}`, data)
              if(res.data) setRegisterOK(true);
            } catch(error){
              console.error("Error al enviar los datos:", error);
            }
        }

        const onClick=()=>{
            setTimeout(() => setRegisterOK(false), 300);
            setTimeout(() => setEditMode(false), 300);
            setTimeout(() => window.location.reload(), 300);
        }


    return (   <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 z-50
                  transition-opacity duration-300 ease-in-out
                  ${editMode ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-blue-900/60 h-3/4 flex flex-col justify-between backdrop-blur-md 
                    rounded-2xl shadow-2xl p-3 w-full max-w-md text-center
                    transform transition-all duration-300 ease-in-out
                    ${editMode ? "scale-100" : "scale-90"}`}
      >
        {
            registerOK ? ( <div className="flex flex-col items-center justify-around h-full">
                            <h1>Plan editado exitosamente</h1>
                            <button onClick={onClick} className="m-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Cerrar</button>
                           </div> ) 
                :(
                <div className="flex flex-col items-center h-full">
                <h1 className=" m-2 mt-10">Editar Plan</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center mt-5">
                <input type="text" {...register("name")} placeholder={planToEdit.name} className="m-2 p-2 mt-5 border rounded"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                <input type="text" {...register("description")} placeholder={planToEdit.description} className="m-2 p-2 mt-5 border rounded"/>
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder={`Precio: ${planToEdit.price}`} className="m-2 p-2 mt-5 border rounded"/>
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                <input type="number" {...register("messageLimit", { valueAsNumber: true })} placeholder={`Limite de mensajes: ${planToEdit.messageLimit}`} className="m-2 p-2 mt-5 border rounded"/>
                {errors.messageLimit && <p className="text-red-500 text-sm">{errors.messageLimit.message}</p>}
                <input type="text" {...register("type")} placeholder={planToEdit.type} className="m-2 p-2 mt-5 border rounded"/>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                {selectedType==="CUSTOM" && (<div className="flex flex-col"><input type="number" {...register("duration", { valueAsNumber: true })} placeholder="Duracion en dias" className="m-2 p-2 mt-5 border rounded"/>
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration?.message}</p>}</div>)}
                <input type="text" {...register("status")} placeholder={planToEdit.status} className="m-2 p-2 mt-5 border rounded"/>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                <button type="submit" className="m-2 px-5 mt-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">Enviar</button>
                </form>
                </div>
            )
        }
        </div>
    </div>
    )
}

export default EditPlan;