import { ScarabRarity } from './types';

export function calculateTotalPrice(price: number, stock: number, priceMultiplier: number, scarabMultiplier: number): number {
  return Math.round(price * stock * priceMultiplier / 100* scarabMultiplier / 100);
}

export function shouldHighlightConversion(scarabRarity: ScarabRarity, price: number, nextRarityPrice: number): boolean {
  if (scarabRarity === 'Winged' || scarabRarity === 'Gilded') {
    return false;
  }
  return nextRarityPrice > price * 3;
}

export function calculateOptimalStock(scarabPrice: number, divinePrice: number): number {
  const scarabPriceInDivines = (scarabPrice) / divinePrice;
  const optimalStockForOneDivine = 1 / scarabPriceInDivines;
  
  // Use Math.floor() to round down to the nearest whole number
  return Math.floor(optimalStockForOneDivine);
}