// components/Game.tsx
'use client'; // Required for client-side interactivity (drag-and-drop)

import { useState } from 'react';
import styles from './Game.module.css';

const characters = [
  { name: 'Ezra Meeker', bio: 'Real pioneer who traveled the Oregon Trail multiple times', img: '/ezra-meeker.jpg' },
  { name: 'Clara Jones', bio: 'Fictional doctor seeking a new life', img: '/clara-jones.jpg' },
  { name: 'Thomas Reed', bio: 'Fictional farmer with a big family', img: '/thomas-reed.jpg' },
  { name: 'Maria Lopez', bio: 'Fictional trader with survival skills', img: '/maria-lopez.jpg' },
  { name: 'John Smith', bio: 'Fictional blacksmith looking for adventure', img: '/john-smith.jpg' },
];

const supplies = [
  { id: 'food', name: 'Food', img: '/food.png' },
  { id: 'water', name: 'Water', img: '/water.png' },
  { id: 'tools', name: 'Tools', img: '/tools.png' },
  { id: 'clothes', name: 'Clothes', img: '/clothes.png' },
];

// Define types for TypeScript
interface Character {
  name: string;
  bio: string;
  img: string;
}

interface Supply {
  id: string;
  name: string;
  img: string;
}

export default function Game() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [wagonSupplies, setWagonSupplies] = useState<Supply[]>([]);
  const [day, setDay] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, supply: Supply) => {
    e.dataTransfer.setData('supplyId', supply.id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const supplyId = e.dataTransfer.getData('supplyId');
    const supply = supplies.find((s) => s.id === supplyId);
    if (supply && wagonSupplies.length < 3) {
      setWagonSupplies([...wagonSupplies, supply]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const nextDay = () => {
    if (day < 6) {
      setDay(day + 1);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setSelectedCharacter(null);
    setWagonSupplies([]);
    setDay(1);
    setGameOver(false);
  };

  if (!selectedCharacter) {
    return (
      <div className={styles.characterSelection}>
        <h2>Choose Your Character</h2>
        <div className={styles.characters}>
          {characters.map((char) => (
            <div
              key={char.name}
              className={styles.characterCard}
              onClick={() => handleCharacterSelect(char)}
            >
              <img src={char.img} alt={char.name} className={styles.characterImg} />
              <h3>{char.name}</h3>
              <p>{char.bio}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <h2>Day {day} of 6</h2>
      <div className={styles.characterInfo}>
        <img src={selectedCharacter.img} alt={selectedCharacter.name} />
        <p>
          {selectedCharacter.name} - {selectedCharacter.bio}
        </p>
      </div>
      <div className={styles.suppliesArea}>
        <h3>Available Supplies</h3>
        {supplies.map((supply) => (
          <div
            key={supply.id}
            draggable
            onDragStart={(e) => handleDragStart(e, supply)}
            className={styles.supplyItem}
          >
            <img src={supply.img} alt={supply.name} />
            <p>{supply.name}</p>
          </div>
        ))}
      </div>
      <div className={styles.wagon} onDrop={handleDrop} onDragOver={handleDragOver}>
        <h3>Your Wagon</h3>
        {wagonSupplies.length === 0 ? (
          <p>Drag supplies here!</p>
        ) : (
          wagonSupplies.map((supply) => (
            <div key={supply.id} className={styles.wagonItem}>
              <img src={supply.img} alt={supply.name} />
              <p>{supply.name}</p>
            </div>
          ))
        )}
      </div>
      {!gameOver ? (
        <button onClick={nextDay} className={styles.nextButton}>
          Next Day
        </button>
      ) : (
        <div>
          <h3>You Made It to Oregon!</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}
