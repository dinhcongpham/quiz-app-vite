import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface ConnectionContextType {
  connection: HubConnection | null;
  isConnected: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const connect = async () => {
      try {
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${import.meta.env.VITE_API_URL}/gameHub`, {
            accessTokenFactory: () => localStorage.getItem('accessToken') || ''
          })
          .withAutomaticReconnect()
          .build();

        await newConnection.start();
        console.log('SignalR Connected');
        setConnection(newConnection);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting to game hub:', error);
        toast.error('Failed to connect to game server');
        setIsConnected(false);
      }
    };

    if (user) {
      connect();
    }

    return () => {
      if (connection) {
        connection.stop().catch(err => console.error('Error stopping connection:', err));
        setIsConnected(false);
      }
    };
  }, [user]);

  return (
    <ConnectionContext.Provider value={{ connection, isConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
}; 