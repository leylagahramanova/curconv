
import React, { useCallback, useEffect } from 'react';
import './App.css';
import { Block } from './Block';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const [fromCurrency, setFromCurrency] = React.useState('RUB');
  const [toCurrency, setToCurrency] = React.useState('USD');
  const [toPrice, setToPrice] = React.useState(1);
  const [fromPrice, setFromPrice] = React.useState(0);
  const ratesRef = React.useRef({});

  const onChangeFromPrice = useCallback((value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency];
    setToPrice(result.toFixed(3));
    setFromPrice(value);
  }, [fromCurrency, toCurrency]);

  const onChangeToPrice = useCallback((value) => {
    const result =
      (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const currentDate = new Date();

    const fetchXmlData = async () => {
      try {
        const formattedDate = formatDate(currentDate);
        const response = await fetch(
          `http://localhost:5000/currencies/${formattedDate}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const xmlText = await response.text();
        // Convert XML data to JSON
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const json = {};
        const currencies = xmlDoc.getElementsByTagName('Valute');
        for (let i = 0; i < currencies.length; i++) {
          const code = currencies[i].getElementsByTagName('Code')[0].textContent;
          const rate = parseFloat(
            currencies[i].getElementsByTagName('Value')[0].textContent
          );
          if (!isNaN(rate) && isFinite(rate)) {
            json[code] = rate;
          }
        }

        ratesRef.current = json;
        
        onChangeToPrice(1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchXmlData();
  }, [onChangeToPrice]);

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency, fromPrice, onChangeFromPrice]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency, toPrice, onChangeToPrice]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
