import { useState } from "react";

export default function SearchPage() {
  const [topic, setTopic] = useState("");
  const [users, setUsers] = useState([]);

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


  const sendchatRequest = async(receiver)=>{
    try{
      const response = await fetch("http://localhost:5001/send-chat-request",{
        method:POST,
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "YourUsernameHere", 
        receiver,
        topic,
      })
    });
    const data = response.json();
    if(data.success){
      alert("chat request sent");
    }else{
      alert('chat request failed')
    }
  }catch(error){
    console.error("Error sending request:", error);

  }
}





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
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {users.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Users Searching for {topic}:</h2>
          <ul className="list-disc mt-2">
            {users.map((user, index) => (
              <li key={index} className="mt-1">
                {user.username}
                <button
                 className="bg-green-500 text-white px-3 py-1 rounded"
                 onClick={sendchatRequest(user.username)}
                >
                Send Request
                </button>
              
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
