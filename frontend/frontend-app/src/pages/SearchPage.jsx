import { useState, useEffect } from "react";

export default function SearchPage() {
  const [topic, setTopic] = useState("");
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const username = "sarada"; // Replace with actual logged-in user later

  // Fetch users searching for the same topic
  const handleSearch = async () => {
    if (!topic) return alert("Enter a topic!");

    try {
      const response = await fetch(`http://localhost:5001/get-users/${topic}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Send a chat request
  const sendChatRequest = async (receiver) => {
    try {
      const response = await fetch("http://localhost:5001/send-chat-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: username, // Now using real username
          receiver,
          topic,
        }),
      });
      const data = await response.json();
      console.log("Response Data:", data);
      if (data.success) {
        alert("Chat request sent!");
      } else {
        alert("Chat request failed");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  // Fetch pending chat requests
  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5001/pending-requests/${username}`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-5">
      <h1 className="text-2xl font-bold">Search for a Topic</h1>
      <input
        type="text"
        placeholder="Enter anime/movie/book..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border rounded p-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>

      {/* Users Searching for the Same Topic */}
      {users.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Users Searching for {topic}:</h2>
          <ul className="list-disc mt-2">
            {users.map((user, index) => (
              <li key={index} className="mt-1 flex justify-between items-center">
                {user.username}
                <button className="bg-green-500 text-white px-3 py-1 rounded ml-4" onClick={() => sendChatRequest(user.username)}>
                  Send Request
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show Pending Chat Requests */}
      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold">Pending Chat Requests</h2>
        {requests.length > 0 ? (
          <ul className="mt-2">
            {requests.map((req, index) => (
              <li key={index} className="mt-2 p-3 border rounded flex justify-between items-center">
                <div>
                  <span className="font-semibold">{req.sender}</span> wants to chat about <span className="italic">{req.topic}</span>
                </div>
                <div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Accept</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No pending requests.</p>
        )}
      </div>
    </div>
  );
}
