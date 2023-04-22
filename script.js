var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var fetchPricesButton = document.getElementById('fetchPrices');
var scarabPricesDiv = document.getElementById('scarabPrices');
var priceMultiplierSlider = document.getElementById('priceMultiplier');
var priceMultiplierOutput = document.getElementById('priceMultiplierOutput');
var scarabOrder = [
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
var scarabRarities = ['Rusted', 'Polished', 'Gilded', 'Winged'];
var scarabStocks = {
    Rusted: 20,
    Polished: 20,
    Gilded: 10,
    Winged: 3,
};
function calculateTotalPrice(price, stock, priceMultiplier) {
    return Math.round(price * stock * (priceMultiplier / 100));
}
function shouldHighlightConversion(scarabRarity, price, nextRarityPrice) {
    if (scarabRarity === 'Winged' || scarabRarity === 'Gilded') {
        return false;
    }
    return nextRarityPrice > price * 3;
}
function copyToClipboard(text, stock) {
    var el = document.createElement('textarea');
    el.value = "~price ".concat(text, "/").concat(stock, " chaos");
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
if (priceMultiplierSlider && priceMultiplierOutput) {
    priceMultiplierSlider.addEventListener('input', function () {
        priceMultiplierOutput.value = "".concat(priceMultiplierSlider.value, "%");
        if (fetchPricesButton) {
            fetchPricesButton.click(); // Fetch and display prices when the slider value changes
        }
    });
}
if (fetchPricesButton) {
    fetchPricesButton.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        var league, apiUrl, response, data, scarabPrices_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    league = 'Crucible';
                    apiUrl = "https://poe.ninja/api/data/ItemOverview?league=".concat(league, "&type=Scarab");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(apiUrl)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    scarabPrices_1 = data.lines.reduce(function (result, item) {
                        var _a;
                        return (__assign(__assign({}, result), (_a = {}, _a[item.name] = item.chaosValue, _a)));
                    }, {});
                    if (scarabPricesDiv) {
                        scarabPricesDiv.innerHTML = scarabOrder
                            .map(function (scarabType) { return "\n            <div class=\"scarab-price\">\n              <div class=\"scarab-name\">".concat(scarabType, " Scarabs:</div>\n              ").concat(scarabRarities
                            .map(function (rarity, index) {
                            var price = scarabPrices_1["".concat(rarity, " ").concat(scarabType, " Scarab")] || 0;
                            var stock = scarabStocks[rarity];
                            var totalPrice = calculateTotalPrice(price, stock, parseInt(priceMultiplierSlider.value));
                            var nextRarity = scarabRarities[index + 1];
                            var nextRarityPrice = scarabPrices_1["".concat(nextRarity, " ").concat(scarabType, " Scarab")];
                            var highlightConversion = shouldHighlightConversion(rarity, price, nextRarityPrice);
                            return "\n                  <div>\n                    ".concat(rarity, ":\n                    ").concat(price, " chaos\n                    <span class=\"clipboard-text ").concat(highlightConversion ? 'highlight' : '', "\" onclick=\"copyToClipboard('").concat(totalPrice, "', ").concat(scarabStocks[rarity], ")\">\n                      (").concat(totalPrice, "/").concat(scarabStocks[rarity], ")\n                    </span>\n                  </div>");
                        })
                            .join(''), "\n            </div>\n          "); })
                            .join('');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching scarab prices:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
