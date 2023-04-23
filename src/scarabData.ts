import { ScarabRarity, ScarabStocks } from './types';

export const scarabOrder: string[] = [
  'Bestiary',
  'Reliquary',
  'Torment',
  'Sulphite',
  'Metamorph',
  'Legion',
  'Ambush',
  'Blight',
  'Shaper',
  'Expedition',
  'Cartography',
  'Harbinger',
  'Elder',
  'Divination',
  'Breach',
  'Abyss',
];

export const scarabRarities: ScarabRarity[] = ['Rusted', 'Polished', 'Gilded', 'Winged'];

export const scarabStocks: ScarabStocks = {
  Rusted: 20,
  Polished: 20,
  Gilded: 10,
  Winged: 3,
};
