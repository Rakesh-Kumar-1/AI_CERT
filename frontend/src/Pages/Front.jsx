import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Front.css'; 

const Front = () => {
  const [user, setUser] = useState({ oldWord: "", newWord: "" });
  const [history, setHistory] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  async function old_history() {
    try {
      const response = await axios.get(`https://ai-cert.onrender.com/oldhistory/${userInfo.id}`);
      setHistory(response.data.info);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  useEffect(() => {
    old_history();
  }, []);

  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ai-cert.onrender.com/newhistory', { ...user, userId: userInfo.id });
      if (response.data.message === "Message inserted") {
        alert("Success! New history added.");
        setUser({ oldWord: "", newWord: "" });
        old_history();
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

return (
    <div className="container">
      <h1 className="title">History Manager</h1>

      {/* History Table Section */}
      <div className="history-box">
        <h2>Previous History</h2>
        {history.length === 0 ? (
          <p className="no-data">No history found.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Added Words</th>
                <th>Removed Words</th>
                <th>Old Len</th>
                <th>New Len</th>
                <th>Final Text</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.created_at}</td>
                  <td className="added">{item.addedwords?.join(", ")}</td>
                  <td className="removed">{item.removedwords?.join(", ")}</td>
                  <td>{item.oldlength}</td>
                  <td>{item.newlength}</td>
                  <td>{item.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Section */}
      <form onSubmit={formSubmit} className="form-box">
        <h2>Add New Word Change</h2>
        <input
          type="text"
          required
          placeholder="Enter replacing word"
          name="oldWord"
          value={user.oldWord}
          onChange={onchangeInput}
        />
        <input
          type="text"
          required
          placeholder="Enter new word"
          name="newWord"
          value={user.newWord}
          onChange={onchangeInput}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default Front;
