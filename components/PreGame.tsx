// components/PreGame.tsx
'use client';
import { useState } from 'react';
import Game from './Game'; // Import the Game component
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

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setDollars(character.dollars);
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
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const startJourney = () => {
    if (selectedCharacter && wagonSupplies.some(s => s.units > 0)) {
      return <Game initialSupplies={wagonSupplies} initialDollars={dollars} character={selectedCharacter} />;
    }
    alert("Please select a character and purchase at least one item to start!");
    return null;
  };

  if (!selectedCharacter) {
    return (
      <div className={styles.characterSelection}>
        <h2 style={{ color: '#32CD32' }}>Choose Your Character</h2>
        <div className={styles.characters}>
          {characters.map((char) => (
            <div key={char.name} className={styles.characterCard} onClick={() => handleCharacterSelect(char)}>
              <img src={char.pfp} alt={char.name} className={styles.characterImg} />
              <h3 style={{ color: '#FFD700' }}>{char.name}</h3>
              <p style={{ color: '#FFFFFF' }}>{char.bio} - ${char.dollars}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <h2 style={{ color: '#32CD32' }}>Pre-Game: Purchase Supplies</h2>
      <div className={styles.statusBar}>
        <p>Dollars Remaining: ${dollars}</p>
      </div>
      <div className={styles.characterInfo}>
        <img src={selectedCharacter.pfp} alt={selectedCharacter.name} />
        <p style={{ color: '#FFFFFF' }}>{selectedCharacter.name} - {selectedCharacter.bio}</p>
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
  );
};

export default PreGame;
