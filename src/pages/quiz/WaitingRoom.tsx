import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GameRoomDto, GameStateDto, RoomParticipantDto } from '../../types/game.types';
import { useGameRoom } from '../../context/GameRoomContext';
import { useConnection } from '../../context/ConnectionContext';

const WaitingRoom: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { room, setRoom, setGameState } = useGameRoom();
  const { connection } = useConnection();

  // Register listeners only once per connection
  useEffect(() => {
    if (!connection) return;

    const handleUserJoined = (updatedRoom: GameRoomDto) => {
      setRoom(updatedRoom);
      console.log(updatedRoom);
      setIsHost(updatedRoom.hostUserId === user?.id);
      toast.success('A new player joined the room!');
    };
    const handleUserLeft = (userId: number) => {
      if (room) {
        const updatedRoom = { ...room };
        updatedRoom.participants = updatedRoom.participants.filter(p => p.userId !== userId);
        setRoom(updatedRoom);
        toast('A player has left the room');
      }
    };
    const handleGameStarted = (gameState: GameStateDto) => {
      setGameState(gameState);
      toast.success('Game is starting!');
      navigate(`/play/${roomCode}`);
    };
    const handleError = (error: string) => {
      toast.error(error);
    };

    connection.off('UserJoined');
    connection.off('UserLeft');
    connection.off('GameStarted');
    connection.off('Error');

    connection.on('UserJoined', handleUserJoined);
    connection.on('UserLeft', handleUserLeft);
    connection.on('GameStarted', handleGameStarted);
    connection.on('Error', handleError);

    // Cleanup
    return () => {
      connection.off('UserJoined', handleUserJoined);
      connection.off('UserLeft', handleUserLeft);
      connection.off('GameStarted', handleGameStarted);
      connection.off('Error', handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, user?.id, setRoom, setGameState, navigate, room, roomCode]);

  // Join room only once
  useEffect(() => {
    if (connection && user?.id && roomCode) {
      connection.invoke('JoinRoom', roomCode, user.id)
        .then(() => console.log('Joined room:', roomCode))
        .catch(err => {
          console.error('Error joining room:', err);
          toast.error('Failed to join room');
          navigate('/');
        });
    }
  }, [connection, user?.id, roomCode, navigate]);

  const handleStartGame = async () => {
    if (!connection || !roomCode) return;
    
    try {
      setIsStarting(true);
      await connection.invoke('StartGame', roomCode);
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game');
      setIsStarting(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || '');
    toast.success('Room code copied to clipboard!');
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Waiting Room</h1>
            <div className="flex items-center justify-center gap-4">
              <p className="text-xl font-semibold">Room Code: {roomCode}</p>
              <button
                onClick={copyRoomCode}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Players ({room.participants.length})</h2>
            <div className="space-y-2">
              {room.participants.map((participant: RoomParticipantDto) => (
                <div
                  key={participant.userId}
                  className={`flex items-center justify-between p-3 rounded ${
                    participant.userId === room.hostUserId ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{participant.userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="font-medium">{participant.userName}</span>
                      {participant.userId === room.hostUserId && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Joined: {new Date(participant.joinedAt).toLocaleTimeString()}</div>
                    <div>ID: {participant.userId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <div className="text-center">
              <button
                onClick={handleStartGame}
                disabled={room.participants.length < 1 || isStarting}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200
                  ${room.participants.length < 1 || isStarting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 hover:shadow-lg'}`}
              >
                {isStarting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting...
                  </span>
                ) : (
                  'Start Quiz'
                )}
              </button>
              {room.participants.length < 1 && (
                <p className="text-red-500 mt-2">Need at least 1 player to start</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Waiting for host to start the quiz...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom; 