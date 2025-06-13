import { useRef, useEffect, useState } from 'react';
import axios from 'axios';

//const SYMBOL = 'BINANCE:BTCUSDT';
const SYMBOL = 'AAPL';
const API_KEY = import.meta.env.VITE_FINNHUB;

export default function Chart() {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const res = await axios.get('https://finnhub.io/api/v1/stock/market-status',
          {
            params: {
              exchange: 'US',
              token: API_KEY,
            },
          }
        );
        setIsOpen(res.data.isOpen);
      } catch (err) {
        console.err(err);
      }
    };

    const connectWebSocket = () => {
      socketRef.current = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

      socketRef.current.onopen = () => {
        console.log('OPEN');
        socketRef.current.send(JSON.stringify({ type: 'subscribe', symbol: SYMBOL }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === 'trade') {
          setPrice(data.data[0].p); // 'p' is the price
        }
      };

      socketRef.current.onclose = () => {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'unsubscribe', symbol: SYMBOL }));
        }
        console.log('CLOSE');
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    fetchMarketStatus();
    const delay = setTimeout(connectWebSocket, 1000);

    return () => {
      clearTimeout(delay);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <div>Market Closed</div>
    );
  } else {
    return (
      <div>{SYMBOL} Live Price: ${price}</div>
    );
  }
};
