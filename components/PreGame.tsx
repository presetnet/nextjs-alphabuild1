// components/PreGame.tsx
'use client';
import { useState, useEffect } from 'react';
import Game from './Game';
import styles from './Game.module.css';

const characters = [
  { name: 'Ezra Meeker', bio: 'Real pioneer with vast trail experience', img: '/ezra-meeker.jpg', dollars: 860, pfp: '/pfp-ezra.png' },
  { name: 'Clara Jones', bio: 'Doctor with medical skills', img: '/clara-jones.jpg', dollars: 750, pfp: '/pfp-clara.png' },
  { name: 'Thomas Reed', bio: 'Farmer with a large family', img: '/thomas-reed.jpg', dollars: 680, pfp: '/pfp-thomas.png' },
  { name: 'Maria Lopez', bio: 'Trader with survival expertise', img: '/maria-lopez.jpg', dollars: 720, pfp: '/pfp-maria.png' },
  { name: 'John Smith', bio: 'Blacksmith seeking adventure', img: '/john-smith.jpg', dollars: 590, pfp: '/pfp-john.png' },
];

const supplies = [
  { id: 'food', name: 'Food', price: 10, img: '/food.png', units: 0 },
  { id: 'water', name: 'Water', price: 5, img: '/water.png', units: 0 },
  { id: 'tools', name: 'Tools', price: 15, img: '/tools.png', units: 0 },
  { id: 'clothes', name: 'Clothes', price: 8, img: '/clothes.png', units: 0 },
];

interface Character {
  name: string;
  bio: string;
  img: string;
  dollars: number;
  pfp: string;
}

interface Supply {
  id: string;
  name: string;
  price: number;
  img: string;
  units: number;
}

const PreGame = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [wagonSupplies, setWagonSupplies] = useState<Supply[]>(supplies.map(s => ({ ...s, units: 0 })));
  const [dollars, setDollars] = useState<number>(0);
  const [showGame, setShowGame] = useState<boolean>(false);

  useEffect(() => {
    console.log('PreGame initialized', { selectedCharacter, wagonSupplies, dollars, showGame });
  }, [selectedCharacter, wagonSupplies, dollars, showGame]);

  const handleCharacterSelect = (character: Character) => {
    if (!selectedCharacter) {
      setSelectedCharacter(character);
      setDollars(character.dollars);
      console.log('Character selected', character.name);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, supply: Supply) => {
    e.dataTransfer.setData('supplyId', supply.id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const supplyId = e.dataTransfer.getData('supplyId');
    const supply = wagonSupplies.find((s) => s.id === supplyId);
    if (supply && dollars >= supply.price && selectedCharacter) {
      setDollars((prev) => prev - supply.price);
      setWagonSupplies((prev) =>
        prev.map(s => s.id === supplyId ? { ...s, units: s.units + 1 } : s)
      );
      console.log('Item dropped', supplyId, wagonSupplies);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const startJourney = () => {
    console.log('Start Journey clicked', { selectedCharacter, wagonSupplies, showGame });
    if (selectedCharacter && wagonSupplies.some(s => s.units > 0)) {
      setShowGame(true);
      console.log('Transitioning to Game');
    } else {
      alert("Please select a character and purchase at least one item to start!");
    }
  };

  const handleReset = () => {
    setSelectedCharacter(null);
    setWagonSupplies(supplies.map(s => ({ ...s, units: 0 })));
    setDollars(0);
    setShowGame(false);
    console.log('Reset to PreGame');
  };

  return (
    <>
      {!showGame && (
        <div className={styles.gameContainer}>
          <h2 style={{ color: '#32CD32' }}>Pre-Game: Purchase Supplies</h2>
          <div className={styles.statusBar}>
            <p>Dollars Remaining: ${dollars}</p>
          </div>
          <div className={styles.characterInfo}>
            <img src={selectedCharacter?.pfp || ''} alt={selectedCharacter?.name || 'Character'} />
            <p style={{ color: '#FFFFFF' }}>
              {selectedCharacter?.name} - {selectedCharacter?.bio}
            </p>
          </div>
          <div className={styles.suppliesArea}>
            <h3 style={{ color: '#32CD32' }}>Shop (Price per Unit)</h3>
            {wagonSupplies.map((supply) => (
              <div
                key={supply.id}
                draggable
                onDragStart={(e) => handleDragStart(e, supply)}
                className={styles.supplyItem}
              >
                <img src={supply.img} alt={supply.name} />
                <p>{supply.name} - ${supply.price}</p>
              </div>
            ))}
          </div>
          <div className={styles.wagon} onDrop={handleDrop} onDragOver={handleDragOver}>
            <h3 style={{ color: '#32CD32' }}>Your Wagon</h3>
            {wagonSupplies.every(s => s.units === 0) ? (
              <p style={{ color: '#FFFFFF' }}>Drag supplies here to prepare!</p>
            ) : (
              wagonSupplies.map((supply, index) => (
                <div key={supply.id + index} className={styles.wagonItem}>
                  <img src={supply.img} alt={supply.name} />
                  <p>{supply.name} x{supply.units}</p>
                </div>
              ))
            )}
          </div>
          <button onClick={startJourney} className={styles.nextButton} disabled={wagonSupplies.every(s => s.units === 0)}>
            Start Journey
          </button>
        </div>
      )}
      {showGame && <Game initialSupplies={wagonSupplies} initialDollars={dollars} character={selectedCharacter!} onReset={handleReset} />}
    </>
  );
};

export default PreGame;
