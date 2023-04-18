const API_KEY =
  "16d2bf893aec5c4b0a0d8876922a5a420eabaaaaa6f16d6e7ee1de1ecf15e63b";

export const getCoins = async () =>
  await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((r) => r.json())
    .then((rawData) =>
      Object.keys(rawData.Data).map((item) => rawData.Data[item])
    );

const tickersHandlers = new Map(); // {}

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    TOSYMBOL: exchange,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice, exchange));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker, currency) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${currency}`],
  });
}

function unsubscribeFromTickerOnWs(ticker, currency) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${currency}`],
  });
}

export const subscribeToTicker = (ticker, cb, currency) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker, currency);
};

export const unsubscribeFromTicker = (ticker, currency) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker, currency);
};
