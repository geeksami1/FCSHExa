import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const FCSApiComponent = () => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('');

  const api_key = 'API_KEY';
  const currency_ids = '1,1984,80,81,7774,7778';
  const main_url = 'wss://fcsapi.com';
  const backup_url = 'wss://fxcoinapi.com';

  const connectSocket = (ws_url) => {
    const newSocket = io.connect(ws_url, {
      transports: ['websocket'],
      path: '/v3/'
    });

    newSocket.emit('heartbeat', api_key);
    newSocket.emit('real_time_join', currency_ids);

    newSocket.on('data_received', prices_data => {
      // Update UI with prices data
      console.log(prices_data);
      // Update UI with prices data
    });

    newSocket.on('successfully', message => {
      console.log(`Connected successfully at ${new Date().toLocaleString()}`);
      setStatus(`Response From Server: ${message}`);
    });

    newSocket.on('disconnect', message => {
      console.log(`FCS SOCKET: ${message}`);
      setStatus(`Response From Server: ${message}`);
      socketReconnection();
    });

    newSocket.on('message', message => {
      console.log(`FCS SOCKET: ${message}`);
    });

    newSocket.on('connect_error', () => {
    //   backupServer();
      console.log('Connection error. If you see this message for more than 15 minutes, then contact us.');
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    connectSocket(main_url);

    const heartInterval = setInterval(() => {
      if (socket) {
        socket.emit('heartbeat', api_key);
      }
    }, 1 * 60 * 60 * 1000);

    return () => {
      if (socket) {
        socket.disconnect();
        socket.destroy();
      }
      clearInterval(heartInterval);
    };
  }, []);

  const backupServer = () => {
    connectSocket(backup_url);
  };

  const socketReconnection = () => {
    setTimeout(() => {
      connectSocket(main_url);
      socketReconnection();
    }, 15 * 60 * 1000);
  };

  return (
    <div>
      <p id="status">{status}</p>
    </div>
  );
};

export default FCSApiComponent;
