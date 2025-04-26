import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";

function AdminStudentRequest() {
  const { getAllRequest, allRequest, acceptRequest,RejectRequest } = useAdminStore();
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllRequest();
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchData();
  }, [getAllRequest]);

  const handleAccept = async (requestId) => {
    const reasonforAction = "Diploma Approved, Please show this to the registrar as a confirmation"; // You can also use window.prompt for user input
    if (!reasonforAction) return; // If user cancels or enters empty reason
    
    setLoadingStates(prev => ({ ...prev, [requestId]: 'accepting' }));
    try {
      await acceptRequest(requestId, reasonforAction); // Assuming acceptRequest is modified to accept reason
      await getAllRequest();
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  const handleReject = async (requestId) => {
    const reasonforAction = window.prompt("Please enter the reason for rejecting:");
    if (!reasonforAction) return; // If user cancels or enters empty reason
    
    setLoadingStates(prev => ({ ...prev, [requestId]: 'rejecting' }));
    try {
      await RejectRequest(requestId, reasonforAction); // Assuming RejectRequest is modified to accept reason
      await getAllRequest();
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  if (!allRequest) {
    return <div>Loading requests...</div>;
  }

  if (allRequest.length === 0) {
    return <div>No requests found</div>;
  }

  return (
    <div>
      {allRequest.map((request) => (
        <div key={request._id} style={{ 
          marginBottom: "20px", 
          padding: "15px", 
          border: "1px solid #ddd", 
          borderRadius: "5px" 
        }}>
          <p><strong>Reason:</strong> {request.reason}</p>
          <p><strong>Student:</strong> {request.studentName}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>

          {request.paymentReceipt && (
            <a href={request.paymentReceipt} target="_blank" rel="noopener noreferrer">
              <button style={{ marginRight: "10px" }}>View Payment Receipt</button>
            </a>
          )}

          {request.affidavitOfLoss && (
            <a href={request.affidavitOfLoss} target="_blank" rel="noopener noreferrer">
              <button>View Affidavit of Loss</button>
            </a>
          )}

          <div style={{ marginTop: "10px" }}>
            {request.status === 'accepted' ? (
              <p style={{ color: "green" }}>Accepted na</p>
            ) : request.status === 'rejected' ? (
              <p style={{ color: "red" }}>Rejected na</p>
            ) : (
              <>
                <button
                  onClick={() => handleAccept(request._id)}
                  disabled={loadingStates[request._id]}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    opacity: loadingStates[request._id] ? 0.6 : 1
                  }}
                >
                  {loadingStates[request._id] === 'accepting' ? 'Accepting...' : 'Accept'}
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={loadingStates[request._id]}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    opacity: loadingStates[request._id] ? 0.6 : 1
                  }}
                >
                  {loadingStates[request._id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminStudentRequest;