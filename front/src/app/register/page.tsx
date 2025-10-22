"use client";
import React, { useEffect, useState } from "react";

export const Registro: React.FC= ()=>{
const [data, setData]= useState({});
const [companys, setCompanys]= useState([]);

useEffect(()=>{
const fetchCompanys= async()=>{
    try{
        const response= await fetch("http://localhost:8000/companys/");
        const jsonData= await response.json();
        setCompanys(jsonData);
    }catch(error){
        console.error("Error al buscar empresas", error);
    }
}
fetchCompanys();
},[])

    return(
        <div className="flex flex-col items-center h-full">
            <h1 className=" m-2 mt-10">Registro</h1>
            <form className="flex flex-col items-center mt-20">
            <input type="text" placeholder="Nombre completo" className="m-2 p-1 rounded"/>
            <input type="number" placeholder="Numero de telefono movil" className="m-2 p-1 rounded"/>
            <input type="mail" placeholder="Email" className="m-2 p-1 rounded"/>
            <input type="text" placeholder="Nombre de usuario" className="m-2 p-1 rounded"/>
            <input type="password" placeholder="Contraseña" className="m-2 p-1 rounded"/>
            <input type="password" placeholder="Confirmar contraseña" className="m-2 p-1 rounded"/>
            <label htmlFor="company">Seleccioná una empresa:</label>
      <select
        id="company"
        value={data.company || ""}
        className="border p-2 rounded"
      >
        <option value="">-- Seleccioná --</option>
        {companys.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
            <button type="submit" className="m-2 p-1 mt-5 bg-blue-600 text-white rounded">Enviar</button>
        </form>
        </div>
    )
}
export default Registro;