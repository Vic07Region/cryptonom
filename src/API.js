const API_KEY =
  "16d2bf893aec5c4b0a0d8876922a5a420eabaaaaa6f16d6e7ee1de1ecf15e63b";
export const loadTikers = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
      ","
    )}&tsyms=USD,RUB,KZT&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) =>
      Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value])
      )
    );

export const getCoins = async () =>
  await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((r) => r.json())
    .then((rawData) =>
      Object.keys(rawData.Data).map((item) => rawData.Data[item])
    );
