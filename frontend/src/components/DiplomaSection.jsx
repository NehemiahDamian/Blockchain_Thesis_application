/* eslint-disable react/prop-types */
function DiplomaSection({ diploma }) {
  return (
    <div className="diploma-section">
      <h2>{diploma.department}</h2>
      <p>{diploma.expectedYearToGraduate}</p>
    </div>
  );
}

export default DiplomaSection;