import { ScarabRarity, ScarabStocks } from './types';
import { scarabOrder, scarabRarities, scarabStocks } from './scarabData';
import { calculateTotalPrice, shouldHighlightConversion } from './priceUtils';
import { copyToClipboard } from './clipboardUtils';

const fetchPricesButton: HTMLElement | null = document.getElementById('fetchPrices');
const scarabPricesDiv: HTMLElement | null = document.getElementById('scarabPrices');
const priceMultiplierSlider: HTMLInputElement | null = document.getElementById('priceMultiplier') as HTMLInputElement;
const priceMultiplierOutput: HTMLOutputElement | null = document.getElementById('priceMultiplierOutput') as HTMLOutputElement;

(window as any).copyToClipboard = copyToClipboard; // Expose the copyToClipboard function to the global scope

if (priceMultiplierSlider && priceMultiplierOutput) {
  priceMultiplierSlider.addEventListener('input', () => {
    priceMultiplierOutput.value = `${priceMultiplierSlider.value}%`;

    if (fetchPricesButton) {
      fetchPricesButton.click(); // Fetch and display prices when the slider value changes
    }
  });
}

if (fetchPricesButton) {
  fetchPricesButton.onclick = async () => {
    const league: string = 'Crucible';
    const apiUrl: string = `https://poe.ninja/api/data/ItemOverview?league=${league}&type=Scarab`;

    try {
      const response: Response = await fetch(apiUrl);
      const data = await response.json();
      const scarabPrices: { [key: string]: number } = data.lines.reduce(
        (result: { [key: string]: number }, item: { name: string; chaosValue: number }) => ({
          ...result,
          [item.name]: item.chaosValue,
        }),
        {}
      );

      if (scarabPricesDiv) {
        scarabPricesDiv.innerHTML = scarabOrder
          .map(
            (scarabType) => `
            <div class="scarab-price">
              <div class="scarab-name">${scarabType} Scarabs:</div>
              ${scarabRarities
                .map((rarity, index) => {
                  const price: number = scarabPrices[`${rarity} ${scarabType} Scarab`] || 0;
                  const stock: number = scarabStocks[rarity];
                  const totalPrice: number = calculateTotalPrice(price, stock, parseInt(priceMultiplierSlider.value));
                  const nextRarity: ScarabRarity | undefined = scarabRarities[index + 1];
                  const nextRarityPrice: number = scarabPrices[`${nextRarity} ${scarabType} Scarab`];

                  const highlightConversion: boolean = shouldHighlightConversion(rarity, price, nextRarityPrice);

                  return `
                  <div>
                    ${rarity}:
                    ${price} chaos
                    <span class="clipboard-text ${highlightConversion ? 'highlight' : ''}" onclick="copyToClipboard('${totalPrice}', ${scarabStocks[rarity]})">
                      (${totalPrice}/${scarabStocks[rarity]})
                    </span>
                  </div>`;
                })
                .join('')}
            </div>
          `
          )
          .join('');
      }
    } catch (error: any) {
      console.error('Error fetching scarab prices:', error);
    }
  };
}
