// components/Game.tsx
'use client';
import { useState, useEffect } from 'react';
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

export default function Game() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [wagonSupplies
