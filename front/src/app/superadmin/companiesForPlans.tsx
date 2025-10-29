import { useEffect, useState } from "react";
import { Plan } from "../register/types";
import axiosCustom from "../lib/axiosInstance";

const CompaniesForPlans: React.FC = () => {
    const [plans, setPlans] = useState([] as Plan[]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axiosCustom.get("http://localhost:3001/plans/actives");
                setPlans(response.data);
            } catch (error) {
                console.error("Error al buscar planes:", error);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div className="m-5">
        <h2 className="text-xl font-semibold mb-2 mt-5">Empresas por plan:</h2>
        <div className="flex justify-center">
        { plans.length !== 0 ?
         ( plans.map((plan:Plan) =>
            (
                <div key={plan.id} className="p-4 m-2 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                <p>{plan.companies.length}</p>
                </div>
            )
        ))
        : <p>Cargando...</p>}
        </div>
        </div>
    )
}

export default CompaniesForPlans;