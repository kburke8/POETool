import { ScarabRarity } from './types';

export function calculateTotalPrice(price: number, stock: number, priceMultiplier: number): number {
  return Math.round(price * stock * priceMultiplier / 100);
}

export function shouldHighlightConversion(scarabRarity: ScarabRarity, price: number, nextRarityPrice: number): boolean {
  if (scarabRarity === 'Winged' || scarabRarity === 'Gilded') {
    return false;
  }
  return nextRarityPrice > price * 3;
}
