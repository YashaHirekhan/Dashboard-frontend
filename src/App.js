import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  
  const [data, setData] = useState(null);
  console.log(data);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/data');
                
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetchData function inside useEffect

        
    }, []); // Empty dependency array means this effect runs only once after initial render

  return (
    <div className="App">
      <Dashboard data={data}/>
    </div>
  );
}

export default App;
