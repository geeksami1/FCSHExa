import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const API_KEY = 'API_KEY';
const CURRENCY_IDS = '1,1984,80,81,7774,7778';
const MAIN_URL = 'wss://fcsapi.com';

const RealTimeData = () => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('...');
  const [data, setData] = useState([]);

  useEffect(() => {
    const connectSocket = () => {
      const newSocket = io(MAIN_URL, {
        transports: ['websocket'],
        path: '/v3/'
      });

      newSocket.emit('heartbeat', API_KEY);
      newSocket.emit('real_time_join', CURRENCY_IDS);

      newSocket.on('data_received', handleDataReceived);
      newSocket.on('successfully', handleMessage);
      newSocket.on('disconnect', handleMessage);
      newSocket.on('message', handleMessage);
      newSocket.on('connect_error', handleConnectError);

      setSocket(newSocket);
    };

    if (!socket) {
      connectSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleDataReceived = (pricesData) => {
    console.log(pricesData);
    setData(pricesData);
  };

  const handleMessage = (message) => {
    setStatus(`Response From Server: ${message}`);
  };

  const handleConnectError = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    console.log('Connection error. If you see this message for more than 15 minutes then contact us.');
  };

  return (
    <div>
      <h2 id="status" style={{ color: 'blue' }}>{status}</h2>
      <button onClick={() => disconnect(socket)}>Close Connection</button>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Close</th>
            <th>Current</th>
            <th>Ask</th>
            <th>Bid</th>
            <th>High</th>
            <th>Low</th>
            <th>Change</th>
            <th>Change%</th>
            <th>Spread</th>
            <th>Volume</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.lastClose}</td>
              <td>{item.current}</td>
              <td>{item.ask}</td>
              <td>{item.bid}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.change}</td>
              <td>{item.changePercentage}</td>
              <td>{item.spread}</td>
              <td>{item.volume}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const disconnect = (socket) => {
  if (socket) {
    socket.disconnect();
  }
};

export default RealTimeData;
