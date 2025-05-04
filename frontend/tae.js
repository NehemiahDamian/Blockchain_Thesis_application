/* eslint-disable no-unused-vars */
const apiData = {
  departments: {
    COT: {
      years: {
        "2024": {
          students: {
            "123": {
              name: "John Doe",
              grades: {
                math: { score: 95, teacher: "Mr. Smith" },
                science: { score: 88, teacher: "Ms. Reyes" }
              },
              diploma: {
                status: "signed",
                signature: "base64string...",
                issuedBy: {
                  name: "Dean A",
                  publicKey: "ABCD..."
                }
              }
            }
          }
        }
      }
    }
    
  }
  


};

// [
//   {
//     department: "COT",
//     year: "2024",
//     studentId: "123",
//     studentName: "John Doe",
//     diplomaStatus: "signed",
//     mathScore: 95,
//     scienceScore: 88
//   }
// ]



const formattedData = [];

for(const department in apiData.departments){
  const years = apiData.departments[department].years
  for(const year in years){
      const students = years[year].students
      console.log(students)
      for (const studentId in students){
        const data = students[studentId]
        formattedData.push({
          department,
          years,
          studentId,
          studentName: data.name,
          diplomaStatus: data.diploma.status,
          mathScore: data.grades.math.score,
          scienceScore: data.grades.science.score,
        })

      }
  }
}

console.log(formattedData)