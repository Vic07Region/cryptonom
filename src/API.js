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
  // console.log("sub", ticker, cb, currency);
  // const tk = {
  //   Add: ticker,
  //   cur: currency,
  //   cb: "" + cb,
  // };
  // console.log(ticker, tk, JSON.parse(JSON.stringify(tk)));
  // channel.postMessage(JSON.parse(JSON.stringify(tk)));
};

export const unsubscribeFromTicker = (ticker, currency) => {
  tickersHandlers.delete(ticker);
  // const tk = {
  //   Del: ticker,
  //   cur: currency,
  // };
  // channel.postMessage(JSON.parse(JSON.stringify(tk)));
  unsubscribeFromTickerOnWs(ticker, currency);
};

channel.onmessage = function (e) {
  if (socket.readyState === WebSocket.CLOSED) {
    // console.log("Received", e.data);
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
