export const Login: React.FC= ()=>{
    return (<div className="flex flex-col items-center h-full">
        <h1 className=" m-2 mt-10">Login</h1>
        <form className="flex flex-col items-center mt-20">
            <input type="text" placeholder="Usuario" className="m-2 p-1 rounded"/>
            <input type="password" placeholder="Contraseña" className="m-2 p-1 rounded"/>
            <button type="submit" className="m-2 p-1 mt-5 bg-blue-600 text-white rounded">Enviar</button>
        </form>
    </div>
    )
}

export default Login;