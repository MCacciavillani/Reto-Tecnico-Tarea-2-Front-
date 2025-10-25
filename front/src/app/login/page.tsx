"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosCustom from "../lib/axiosInstance";
import { useAuth } from "../context/authContext";

const schema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type ErrorLogin={message:string}

type FormData = z.infer<typeof schema>;

export const Login: React.FC= ()=>{

    const {login}= useAuth();

    const[errorLogin, setErrorLogin]= useState({} as ErrorLogin);

      const router=useRouter();

       const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm<FormData>({
          resolver: zodResolver(schema),
        })

const onSubmit =async (data: FormData) => {
      try{
        const res= await axiosCustom.post("http://localhost:3001/users/login", data)
        console.log(res.data);
        if(res.data.access_token){
          login(res.data.access_token);
          router.push("/profile");
        }
      }
      catch (error) {
  if (error instanceof AxiosError) {
    console.error("Error al logearse:", error.response?.data);
    if (error.response?.data.statusCode === 400)
      setErrorLogin({ message: "Credenciales incorrectas" });
    else
      setErrorLogin({ message: "Error del servidor, intente nuevamente" });
  } else {
    console.error("Error desconocido:", error);
    setErrorLogin({ message: "Error inesperado" });
  }
  }
  }

    return (<div className="flex flex-col items-center h-full">
        <h1 className=" m-2 mt-10">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center mt-20">
            <input type="email" {...register("email")} placeholder="Email" className="m-2 p-1 rounded"/>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <input type="password" {...register("password")} placeholder="Contraseña" className="m-2 p-1 rounded"/>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <button type="submit" className="m-2 p-1 mt-5 bg-blue-600 text-white rounded">Enviar</button>
        </form>
        {errorLogin.message && <p className="text-red-500 text-shadow-red-950 text-lg mt-2">{errorLogin.message}</p>}
    </div>
    )
}

export default Login;