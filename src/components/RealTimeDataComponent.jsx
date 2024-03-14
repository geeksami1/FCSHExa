import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const RealTimeDataComponent = () => {
  const [status, setStatus] = useState('...');
  const [currencyData, setCurrencyData] = useState({});
  const [socket, setSocket] = useState(null);
  const wsUrl = 'wss://fcsapi.com/v3/'; // WebSocket URL

  useEffect(() => {
    // Start WebSocket connection
    startSocketConnection();

    // Cleanup function to close WebSocket connection when unmounting
    return () => {
      disconnect();
    };
  }, []);

  const startSocketConnection = () => {
    // Connect to WebSocket server
    const socketInstance = io(wsUrl, { transports: ['websocket'] });

    // Set up event listeners for WebSocket events
    socketInstance.on('connect', onConnect);
    socketInstance.on('data_received', onDataReceived);
    socketInstance.on('successfully', onSuccessfully);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);

    // Set the socket instance
    setSocket(socketInstance);
  };

  const disconnect = () => {
    // Close WebSocket connection
    if (socket) {
      socket.disconnect();
    }
  };

  // Event handlers for WebSocket events
  const onConnect = () => {
    setStatus('Connection established');
    socket.emit('real_time_join', '1,1984,80,81,7774,7778'); // Join required IDs
  };

  const onDataReceived = (data) => {
    setCurrencyData((prevData) => ({ ...prevData, [data.s]: data }));
  };

  const onSuccessfully = (message) => {
    console.log('Connected successfully:', message);
  };

  const onDisconnect = () => {
    setStatus('Disconnected');
    // Reconnect logic can be added here if needed
  };

  const onConnectError = () => {
    console.error('Connection error. Please check your network.');
    // Use backup server logic can be added here if needed
  };

  return (
    <div>
      <h2>Status: {status}</h2>
      <div>
        {/* Render currency data */}
        {Object.keys(currencyData).map((key) => (
          <div key={key}>
            <h3>{key}</h3>
            <p>Last Close: {currencyData[key].lc}</p>
            <p>Current: {currencyData[key].c}</p>
            {/* Add more data points here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeDataComponent;
