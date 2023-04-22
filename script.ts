type ScarabRarity = 'Rusted' | 'Polished' | 'Gilded' | 'Winged';

interface ScarabStocks {
  Rusted: number;
  Polished: number;
  Gilded: number;
  Winged: number;
}

const fetchPricesButton: HTMLElement | null = document.getElementById('fetchPrices');
const scarabPricesDiv: HTMLElement | null = document.getElementById('scarabPrices');
const priceMultiplierSlider: HTMLInputElement | null = document.getElementById('priceMultiplier') as HTMLInputElement;
const priceMultiplierOutput: HTMLOutputElement | null = document.getElementById('priceMultiplierOutput') as HTMLOutputElement;

const scarabOrder: string[] = [
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
const scarabRarities: ScarabRarity[] = ['Rusted', 'Polished', 'Gilded', 'Winged'];
const scarabStocks: ScarabStocks = {
  Rusted: 20,
  Polished: 20,
  Gilded: 10,
  Winged: 3,
};

function calculateTotalPrice(price: number, stock: number, priceMultiplier: number): number {
  return Math.round(price * stock * (priceMultiplier / 100));
}

function shouldHighlightConversion(scarabRarity: ScarabRarity, price: number, nextRarityPrice: number): boolean {
  if (scarabRarity === 'Winged' || scarabRarity === 'Gilded') {
    return false;
  }
  return nextRarityPrice > price * 3;
}

function copyToClipboard(text: string, stock: number): void {
  const el: HTMLTextAreaElement = document.createElement('textarea');
  el.value = `~price ${text}/${stock} chaos`;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

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
