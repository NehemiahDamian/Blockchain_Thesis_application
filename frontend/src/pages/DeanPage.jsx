import { useState } from "react";
function DeanPage() {
const [department, setDepartment] = useState({
  studentDepartment: "",
});
  return (
    <div>
      <form>
        <input 
        type="text"
          value={department.studentDepartment}
          onChange={(e) => setDepartment({ studentDepartment: e.target.value })}
        />
      </form>
    </div>
  )
}

export default DeanPage