import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrarStore } from "../store/useRegistrarStore";

function RegistrarDboard() {
  const navigate = useNavigate();
  const { departmentYears, fetchDepartmentYears, fetchStudentDetails } = useRegistrarStore();

  // Fetch department-year pairs on component mount
  useEffect(() => {
    fetchDepartmentYears();
  }, [fetchDepartmentYears]);

  const handleViewDiplomas = async (department, year) => {
    try {
      await fetchStudentDetails(department, year);
      navigate(`/registrar/view-diplomas?department=${department}&year=${year}`);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Diploma Records</h2>
      <div className="space-y-2">
        {departmentYears.map(({ department, year }, index) => (
          <div 
            key={`${department}-${year}-${index}`}
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
          >
            <span className="font-medium">{department}</span>
            <span className="mx-2">-</span>
            <span>{year}</span>
            <button
              onClick={() => handleViewDiplomas(department, year)}
              className="ml-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegistrarDboard;