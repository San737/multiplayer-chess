import  { useEffect, useState } from 'react';

export const Userstatistics = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/userstatistics')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key} className="py-2 px-4 text-left">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="py-2 px-4">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
  );
};

