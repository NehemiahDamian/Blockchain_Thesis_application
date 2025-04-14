import bcrypt from "bcryptjs";

const inputDetails = {
  name: "Alice Johnson",
  course: "Computer Science",
  token: "token123"
};

const storedHash = "$2b$10$TEUJArdlCtSbzNk0OLiIpOQG15KHk45OCCXsxo01UpwkYdyeQZsBW";

const verifyStudentDetails = async () => {
  const inputString = `${inputDetails.name}${inputDetails.course}${inputDetails.token}`;
  const match = await bcrypt.compare(inputString, storedHash);
  
  if (match) {
    console.log("✅ Verification successful!");
  } else {
    console.log("❌ Verification failed!");
  }
};

verifyStudentDetails();
