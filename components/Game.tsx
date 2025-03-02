// components/Game.tsx
'use client';
import { useState, useEffect } from 'react';
import PreGame from './PreGame';
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

const landmarks = [
  'Independence, MO', 'Kansas River Crossing', 'Fort Kearny', 'Chimney Rock', 'Fort Laramie',
  'Independence Rock', 'South Pass', 'Green River', 'Fort Bridger', 'Soda Springs',
  'Fort Hall', 'Snake River Crossing', 'Fort Boise', 'Blue Mountains', 'The Dalles',
  'Puyallup, the Hop Valley', 'Oregon City'
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

interface MiniGameResult {
  foodEarned: number;
  healthEarned: number;
}

const GameComponent = ({ initialSupplies, initialDollars, character }: { initialSupplies: Supply[], initialDollars: number, character: Character }) => {
  const [day, setDay] = useState<number>(1);
  const [familyHP, setFamilyHP] = useState<number>(100);
  const [foodMeter, setFoodMeter] = useState<number>(100);
  const [waterMeter, setWaterMeter] = useState<number>(100);
  const [dollars, setDollars] = useState<number>(initialDollars);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [highScoreName, setHighScoreName] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<{ name: string; days: number }[]>([]);
  const [currentLandmark, setCurrentLandmark] = useState<string>('');
  const [resting, setResting] = useState<boolean>(false);
  const [wagonSupplies, setWagonSupplies] = useState<Supply[]>(initialSupplies);

  useEffect(() => {
    setCurrentLandmark(landmarks[0]);
    const interval = setInterval(() => {
      if (!resting && day <= 145) {
        setFamilyHP((prev) => Math.max(prev - 5, 0));
        setFoodMeter((prev) => Math.max(prev - 10, 0));
        setWaterMeter((prev) => Math.max(prev - 15, 0));
        if (day % 15 === 0) setResting(true);
        if (familyHP <= 0 || foodMeter <= 0 || waterMeter <= 0) setGameOver(true);
        setDay((prev) => prev + 1);
        if (day % 3 === 0 && Math.random() < 0.3) promptRandomEvent(); // One event every 3 days max
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [familyHP, foodMeter, waterMeter, day, resting]);

  const promptRandomEvent = () => {
    const events = ['fish', 'hunt', 'count stars'];
    const event = events[Math.floor(Math.random() * events.length)];
    if (confirm(`Day ${day}: Want to ${event}?`)) playMiniGame(event);
  };

  const playMiniGame = (type: string): MiniGameResult => {
    switch (type) {
      case 'fish':
        return fishingGame();
      case 'hunt':
        return huntingGame();
      case 'count stars':
        return guessDotsGame();
      default:
        return { foodEarned: 0, healthEarned: 0 };
    }
  };

  const guessDotsGame = (): MiniGameResult => {
    const dots = Math.floor(Math.random() * 20) + 1;
    const guess = prompt('Guess the number of dots (1-20):');
    const numGuess = parseInt(guess || '0');
    if (numGuess === dots) {
      alert('Correct! +10 Food, +5 HP');
      return { foodEarned: 10, healthEarned: 5 };
    }
    alert(`Wrong! The number was ${dots}.`);
    return { foodEarned: 0, healthEarned: 0 };
  };

  const huntingGame = (): MiniGameResult => {
    if (day === 1) {
      alert("Can't hunt on Day 1!");
      return { foodEarned: 0, healthEarned: 0 };
    }
    const asteroids = Array(5).fill(0).map(() => Math.random() < 0.5);
    const hits = prompt('Hit 5 targets (Y/N for each, e.g., YYNYN):')?.toLowerCase().split('') || [];
    const score = hits.filter((h, i) => h === 'y' && asteroids[i]).length;
    if (score >= 3) {
      alert(`Success! Hit ${score}/5 targets. +20 Food, +10 HP`);
      return { foodEarned: 20, healthEarned: 10 };
    }
    alert(`Missed! Hit ${score}/5 targets.`);
    return { foodEarned: 0, healthEarned: 0 };
  };

  const fishingGame = (): MiniGameResult => {
    const fish = Math.floor(Math.random() * 10) + 1;
    const bait = prompt('Use bait (1-5 units of food)?');
    const baitUsed = Math.min(parseInt(bait || '0'), 5);
    if (baitUsed > 0 && Math.random() < 0.7) {
      setFoodMeter((prev) => Math.max(prev - baitUsed * 10, 0));
      alert(`Caught ${fish} fish! +${fish * 5} Food`);
      return { foodEarned: fish * 5, healthEarned: 0 };
    } else if (baitUsed > 0) {
      setFoodMeter((prev) => Math.max(prev - baitUsed * 10, 0));
      alert('Failed to catch fish, lost bait!');
      return { foodEarned: 0, healthEarned: 0 };
    }
    alert('No bait used, no fish caught.');
    return { foodEarned: 0, healthEarned: 0 };
  };

  const nextDay = () => {
    if (!resting && day < 145) {
      const nextIndex = Math.floor((day / 145) * landmarks.length);
      setCurrentLandmark(landmarks[nextIndex] || 'Journey End');
      setDay((prev) => prev + 1);
    } else if (resting) {
      setFamilyHP((prev) => Math.min(prev + 20, 100));
      setWaterMeter((prev) => Math.min(prev + 50, 100));
      setResting(false);
    } else if (day >= 145) {
      setGameOver(true);
    }
  };

  const submitHighScore = () => {
    if (highScoreName) {
      setLeaderboard([...leaderboard, { name: highScoreName, days: day }]);
      setHighScoreName('');
      setGameOver(false);
      setDay(1);
      setFamilyHP(100);
      setFoodMeter(100);
      setWaterMeter(100);
      setWagonSupplies(initialSupplies);
      setDollars(initialDollars);
    }
  };

  return (
    <div className={styles.gameContainer}>
      <h2 style={{ color: '#32CD32' }}>Day {day} of 145 - {currentLandmark}</h2>
      <div className={styles.statusBar}>
        <p>Family HP: {familyHP}/100</p>
        <p>Food: {foodMeter}/100</p>
        <p>Water: {waterMeter}/100</p>
        <p>Dollars: ${dollars}</p>
      </div>
      <div className={styles.characterInfo}>
        <img src={character.pfp} alt={character.name} />
        <p style={{ color: '#FFFFFF' }}>{character.name} - {character.bio}</p>
      </div>
      <div className={styles.suppliesArea}>
        <h3 style={{ color: '#32CD32' }}>Your Wagon</h3>
        {wagonSupplies.map((supply, index) => (
          <div key={supply.id + index} className={styles.wagonItem}>
            <img src={supply.img} alt={supply.name} />
            <p>{supply.name} x{supply.units}</p>
          </div>
        ))}
      </div>
      {!gameOver && (
        <button onClick={nextDay} className={styles.nextButton}>
          {resting ? 'Rest (Recover HP & Water)' : 'Next Day'}
        </button>
      )}
      {gameOver && (
        <div>
          <h3 style={{ color: '#32CD32' }}>You Made It to Oregon!</h3>
          <input
            value={highScoreName}
            onChange={(e) => setHighScoreName(e.target.value)}
            placeholder="Enter Name"
            style={{ margin: '10px' }}
          />
          <button onClick={submitHighScore} className={styles.nextButton}>
            Submit High Score
          </button>
          <div>
            <h4 style={{ color: '#FFD700' }}>Leaderboard</h4>
            {leaderboard.map((entry, index) => (
              <p key={index} style={{ color: '#FFFFFF' }}>{entry.name}: {entry.days} days</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
      return <GameComponent initialSupplies={wagonSupplies} initialDollars={dollars} character={selectedCharacter} />;
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
