import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopScreen from './components/TopScreen';
import GameScreen from './components/GameScreen';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<TopScreen />} />
        <Route path="/game" element={<GameScreen />} />
      </Routes>
    </div>
  );
}

export default App;