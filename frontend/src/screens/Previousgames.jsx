import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import ChessGameReplay from './ChessGameReplay';

export const Previousgames = ({ userId }) => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchGames();
    }, [userId]);
  
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/previousgames/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load previous games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleGameSelect = (game) => {
      setSelectedGame(game);
    };
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
  
    const getResultString = (result) => {
      switch (result) {
        case 1: return 'Win';
        case 0: return 'Draw';
        case -1: return 'Loss';
        default: return 'Unknown';
      }
    };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
          <div className="bg-slate-300 rounded-lg shadow-lg p-6">
            <p className="text-xl text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      );
    }
  
    return (
        <div className="flex items-stretch justify-center min-h-screen bg-slate-950 p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-slate-300 rounded-lg shadow-lg overflow-hidden">
          <div className="w-full lg:w-1/3 p-6 overflow-y-auto max-h-[80vh] lg:max-h-screen">
            <h2 className="text-2xl font-bold mb-4">Previous Games</h2>
            {games.length === 0 ? (
              <p>No previous games found.</p>
            ) : (
              <ul className="space-y-2">
                {games.map((game) => (
                  <li key={game.game_id}>
                    <button
                      onClick={() => handleGameSelect(game)}
                      className={`w-full text-left p-2 rounded-lg transition duration-300 ${
                        selectedGame && selectedGame.game_id === game.game_id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-blue-100'
                      }`}
                    >
                      <div className="font-semibold">{game.opponent_name}</div>
                      <div className="text-sm">
                        {formatDate(game.date)} - {getResultString(game.result)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-full lg:w-2/3 bg-slate-800 flex items-center justify-center">
        {selectedGame ? (
          <ChessGameReplay pgn={selectedGame.moves} />
        ) : (
          <div className="text-xl font-semibold text-white">Select a game to replay</div>
        )}
      </div>
        </div>
      </div>
    );
};



