import PropTypes from 'prop-types';


function Diploma({ studentName, courseName, date, institutionName, deanName, deanSignature }) {
  return (
    <div className="diploma" style={{ border: '2px solid black', padding: '20px', borderRadius: '10px' , marginBottom: "20px"}}>
      <h2>{institutionName}</h2>
      <p><strong>Student Name:</strong> {studentName}</p>
      <p><strong>Course:</strong> {courseName}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Dean:</strong> {deanName ? deanName : "Not signed yet"}</p>
      <p><strong>Signature:</strong> {deanSignature ? deanSignature : "Not signed yet"}</p>
      
    </div>
  );
}

Diploma.propTypes = {
  studentName: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  institutionName: PropTypes.string.isRequired,
  deanName: PropTypes.string,
  deanSignature: PropTypes.string,
};

export default Diploma;
