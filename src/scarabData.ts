import { ScarabRarity, ScarabStocks } from './types';

export const scarabOrder: string[] = [
  'Bestiary',
  'Shaper',
  'Reliquary',
  'Expedition',
  'Torment',
  'Cartography',
  'Sulphite',
  'Harbinger',
  'Metamorph',
  'Elder',
  'Legion',
  'Divination',
  'Ambush',
  'Breach',
  'Blight',
  'Abyss',
];

export const scarabRarities: ScarabRarity[] = ['Rusted', 'Polished', 'Gilded', 'Winged'];

export const scarabStocks: ScarabStocks = {
  Rusted: 40,
  Polished: 30,
  Gilded: 10,
  Winged: 3,
};