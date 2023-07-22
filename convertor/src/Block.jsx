// Block.jsx
import React from 'react';
import './App.css';
import { FormControl, Paper, TextField} from "@material-ui/core";

const defaultCurrencies = ['RUB', 'USD', 'EUR', 'GBP'];

export const Block = ({ value, currency, onChangeValue, onChangeCurrency }) => {
  return (
    <Paper className="paper">
      <h3>Currency Converter</h3>
      <div className="block">
        <FormControl variant="outlined">
        <ul className="currencies">
        {defaultCurrencies.map((cur) => (
          <li
            onClick={() => onChangeCurrency(cur)}
            className={currency === cur ? 'active' : ''}
            key={cur}>{cur}
          </li>
        ))}
      </ul>
      <br></br>
      {/* Convert the number 0 to a string */}
      <TextField variant="outlined"
        onChange={(e) => onChangeValue(e.target.value)}
        value={value}
        type="number"
        placeholder={String(0)}
      />
        </FormControl>
      </div>
    </Paper>
  );
};
