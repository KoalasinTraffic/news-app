import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../contexts';

const SYMBOL = 'BINANCE:BTCUSDT';
//const SYMBOL = 'AAPL';
const API_KEY = import.meta.env.VITE_FINNHUB;

export default function Chart() {
  const navigate = useNavigate();
  const socketRef = useRef<WebSocket | null>(null);
  const { authLogout } = useAuthContext();

  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const res = await axios.get('https://finnhub.io/api/v1/stock/market-status', {
          params: {
            exchange: 'US',
            token: API_KEY,
          },
        });
        setIsOpen(res.data.isOpen);
      } catch (err) {
        console.error(err);
      }
    };

    const connectWebSocket = () => {
      socketRef.current = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

      socketRef.current.onopen = () => {
        console.log('OPEN');
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({ type: 'subscribe', symbol: SYMBOL }));
        }
      };

      socketRef.current.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.type === 'trade') {
          setPrice(data.data[0].p); // 'p' is the price
        }
      };

      socketRef.current.onclose = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
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

  const handleLogout = async () => {
    await authLogout();
    navigate('/login');
  };

  return (
    <>
      <button onClick={handleLogout}>Log out</button>
      <div>{isOpen ? 'Market Open' : 'Market Closed'}</div>
      <div>
        {SYMBOL} Live Price: ${price}
      </div>
    </>
  );
}
