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

const channel = new BroadcastChannel("TikersData");

const AGGREGATE_INDEX = "5";
const covertedCoins = new Map();

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
  if (covertedCoins.get(`5~CCCAGG~${ticker.name}~${currency}`)) {
    covertedCoins.delete(`5~CCCAGG~${ticker.name}~${currency}`);
    unsubscribeFromTickerOnWs(ticker.name, "BTC");
    console.log(ticker.name, currency, covertedCoins);
  }
  unsubscribeFromTickerOnWs(ticker.name, currency);
};
let btcUSD = 0.0;
let btcRUB = 0.0;
let btcKZT = 0.0;
socket.addEventListener("message", (e) => {
  let {
    MESSAGE: message,
    TYPE: type,
    FROMSYMBOL: currency,
    TOSYMBOL: exchange,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (currency === "BTC" && exchange === "USD" && newPrice !== undefined) {
    btcUSD = newPrice;
  }
  if (currency === "BTC" && exchange === "RUB" && newPrice !== undefined) {
    btcRUB = newPrice;
  }
  if (currency === "BTC" && exchange === "KZT" && newPrice !== undefined) {
    btcKZT = newPrice;
  }
  if (message === "INVALID_SUB") {
    console.log(covertedCoins);
    const data = JSON.parse(e.data);
    let paramSplit = data.PARAMETER.split("~");
    if (covertedCoins.get(data.PARAMETER) === undefined) {
      covertedCoins.set(data.PARAMETER, paramSplit[3]);
      subscribeToTickerOnWs(paramSplit[2], "BTC");
      switch (paramSplit[3]) {
        case "USD":
          subscribeToTickerOnWs("BTC", "USD");
          break;
        case "RUB":
          subscribeToTickerOnWs("BTC", "RUB");
          break;
        case "KZT":
          subscribeToTickerOnWs("BTC", "KZT");
          break;
        case "BTC":
          break;
      }
    }
  }
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }
  if (exchange === "BTC" && currency !== "BTC") {
    if (covertedCoins.get(`5~CCCAGG~${currency}~USD`) === "USD") {
      newPrice = btcUSD * newPrice;
      exchange = "USD";
    } else {
      if (covertedCoins.get(`5~CCCAGG~${currency}~RUB`) === "RUB") {
        newPrice = btcRUB * newPrice;
        exchange = "RUB";
      } else {
        if (covertedCoins.get(`5~CCCAGG~${currency}~KZT`) === "KZT") {
          newPrice = btcKZT * newPrice;
          exchange = "KZT";
        }
      }
    }
  }
  const handlers = tickersHandlers.get(currency) ?? [];

  if (socket.readyState === WebSocket.OPEN) {
    const tickerCast = {
      Sym: currency,
      Price: newPrice,
      Cur: exchange,
    };
    channel.postMessage(tickerCast);
  }
  handlers.forEach((fn) => fn(newPrice, exchange));
});

channel.onmessage = function (e) {
  if (socket.readyState === WebSocket.CLOSED) {
    if (!e.data.Del && !e.data.Add) {
      const handlers = tickersHandlers.get(e.data.Sym) ?? [];
      handlers.forEach((fn) => fn(e.data.Price, e.data.Cur));
    }
    // if (e.data.Del) {
    //   console.log("delete", e.data.Del, e.data.cur);
    //   unsubscribeFromTicker(e.data.Del, e.data.cur);
    // }
    // if (e.data.Add) {
    //   console.log("add", e.data.Add, e.data.cb, e.data.cur);
    //   subscribeToTicker(e.data.Add, eval(e.data.cb), e.data.cur);
    // }
  }
};
