import { ScarabRarity, ScarabStocks } from './types';
import { scarabOrder, scarabRarities, scarabStocks } from './scarabData';
import { calculateOptimalStock, calculatePriceMultiplier, calculateTotalPrice, shouldHighlightConversion } from './priceUtils';
import { copyToClipboard } from './clipboardUtils';

const fetchPricesButton: HTMLElement | null = document.getElementById('fetchPrices');
const scarabPricesDiv: HTMLElement | null = document.getElementById('scarabPrices');
const priceMultiplierSlider: HTMLInputElement | null = document.getElementById('priceMultiplier') as HTMLInputElement;
const priceMultiplierOutput: HTMLOutputElement | null = document.getElementById('priceMultiplierOutput') as HTMLOutputElement;
const resetSliderButton: HTMLElement | null = document.getElementById('resetSlider');
const individualMultipliers: { [key: string]: number } = {};

(window as any).copyToClipboard = copyToClipboard; // Expose the copyToClipboard function to the global scope

console.log("window.electronAPI", window.electronAPI);  // Debug line


if (priceMultiplierSlider && priceMultiplierOutput) {
  priceMultiplierSlider.addEventListener('input', () => {
    priceMultiplierOutput.value = `${priceMultiplierSlider.value}%`;

    if (fetchPricesButton) {
      fetchPricesButton.click(); // Fetch and display prices when the slider value changes
    }
  });
}

if (resetSliderButton && priceMultiplierSlider) {
  resetSliderButton.addEventListener('click', () => {
    priceMultiplierSlider.value = '100';
    if (priceMultiplierOutput) {
      priceMultiplierOutput.textContent = '100';
    }
    if (fetchPricesButton) {
      fetchPricesButton.click(); // Fetch and display prices when the slider value changes
    }
  });
}



function addSliderListeners(scarabType: string) {
  const slider: HTMLInputElement | null = document.getElementById(`slider-${scarabType}`) as HTMLInputElement;
  const scarabMultiplierOutput: HTMLOutputElement | null = document.getElementById(`slider-${scarabType}-output`) as HTMLOutputElement;
  
  if (slider && scarabMultiplierOutput) {
    console.log(`Adding listener for ${scarabType}`);  // Debug line
    slider.addEventListener('input', async () => {
      console.log(`Slider moved for ${scarabType}`);  // Debug line
      scarabMultiplierOutput.value = `${slider.value}%`;
      individualMultipliers[scarabType] = Number(slider.value);
      await FetchPrices();
    });
  }
}

//Simple in-memory cache of scarab prices
let cachedScarabPrices: any | null = null;
let cacheddivinePrice: any | null = null;
let scarabPrices: { [key: string]: number }; 
let divinePrice: number; 
const cacheTTL = 2 * 60 * 1000; // 5 minutes
let cacheTimestamp: number | null = null;

async function updatePrice(scarabType: string) {

  scarabRarities.forEach(rarity => {
    const slider: HTMLInputElement | null = document.getElementById(`slider-${scarabType}`) as HTMLInputElement;
    const priceDisplay: HTMLElement | null = document.getElementById(`price-${rarity}-${scarabType}`);
    console.log(`slider`, slider);  // Debug line
    console.log(`priceDisplay`, priceDisplay);  // Debug line

    if (slider && priceDisplay) {
      const originalPrice: number = scarabPrices[`${rarity} ${scarabType} Scarab`] || 0;
      const multipliedPrice: number = originalPrice * Number(slider.value) / 100;
      console.log(`Updating price for ${scarabType}`);  // Debug line
      
      priceDisplay.textContent = multipliedPrice.toFixed(2);
    }
  });
}

if (fetchPricesButton) {
  fetchPricesButton.onclick = async () => {
    await FetchPrices();
  };
}

async function FetchPrices() {
  const league: string = 'Ancestor';

  try {
    const currentTime = new Date().getTime();
    if (cachedScarabPrices && cacheddivinePrice && cacheTimestamp && currentTime - cacheTimestamp < cacheTTL) {
      scarabPrices = cachedScarabPrices;
      divinePrice = cacheddivinePrice;
    }
    else {
      const data: any = await window.electronAPI.retrievePrices(league);
      const divineOrbPrice: any = await window.electronAPI.retrieveDivinePrices(league);
      divinePrice = divineOrbPrice;
      console.log("divineOrbPrice", divineOrbPrice); // Debug line
      scarabPrices = data.lines.reduce(
        (result: { [key: string]: number; }, item: { name: string; chaosValue: number; }) => ({
          ...result,
          [item.name]: item.chaosValue,
        }),
        {}
      );
    }


    cachedScarabPrices = scarabPrices;
    cacheTimestamp = currentTime;

    if (scarabPricesDiv) {
      scarabPricesDiv.innerHTML = scarabOrder
        .map(
          (scarabType) => {
            const individualMultiplier = individualMultipliers[scarabType] || 100;


            return `
            <div class="scarab-price">
              <div class="scarab-name">${scarabType} Scarabs:</div>
              ${scarabRarities
                .map((rarity, index) => {
                  return MapScarabPrice(scarabType, rarity, index);
                })
                .join('')}
                <div>
                  <input type="range" min="0" max="200" value="${individualMultiplier}" step="5" class="price-slider" id="slider-${scarabType}">
                  <output for="slider-${scarabType}" id="slider-${scarabType}-output">${individualMultiplier}%</output>
                </div>
            </div>
          `;
          }
        )
        .join('');

      // Add event listeners to sliders
      scarabOrder.forEach(scarabType => addSliderListeners(scarabType));
    }
  } catch (error: any) {
    console.error('Error fetching scarab prices:', error);
  }
}

function MapScarabPrice(scarabType: string, rarity: string, index: number) {

  const scarabMultiplierOutput: HTMLOutputElement | null = document.getElementById(`slider-${scarabType}-output`) as HTMLOutputElement;
  const price: number = scarabPrices[`${rarity} ${scarabType} Scarab`] || 0;
  const multipliedPrice: number = (price * parseInt(priceMultiplierSlider.value)/100 *  parseInt(scarabMultiplierOutput?.value ?? "100")/100).toFixed(2);
  // const stock: number = scarabStocks[rarity];
  console.log('scarabMultiplierOutput?.value:', scarabMultiplierOutput?.value);

  let currency = 'divine';
  let lotPrice = divinePrice;
  let stock: number = calculateOptimalStock(multipliedPrice, divinePrice);
  if (stock > 30){
    lotPrice = 60;
    currency = 'chaos';
    stock = calculateOptimalStock(multipliedPrice, lotPrice);
  }
  const totalCost = currency == "divine" ? 1 : lotPrice
  const pricePer = (lotPrice / stock).toFixed(2);;
  const nextRarity: ScarabRarity | undefined = scarabRarities[index + 1];
  const nextRarityPrice: number = scarabPrices[`${nextRarity} ${scarabType} Scarab`];

  const highlightConversion: boolean = shouldHighlightConversion(rarity, price, nextRarityPrice);
  return `
                  <div>
                    ${rarity}:
                    ${multipliedPrice} chaos (${pricePer} c)
                    <span class="clipboard-text ${highlightConversion ? 'highlight' : ''}" onclick="copyToClipboard('${totalCost}', ${stock}, '${currency}')">
                      (${totalCost}/${stock} ${currency})
                    </span>
                  </div>
                  `;
}

