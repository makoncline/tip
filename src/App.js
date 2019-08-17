import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slider from '@material-ui/core/Slider';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  display: {
    paddingBottom: theme.spacing(1),
  },
  keypad: {
  },
  numCol: {
  },
  numRow: {

  },
  numBtn: {
  },
  noBorder: {
    borderStyle: 'none',
  },
  tipCalc: {
    paddingTop: theme.spacing(2),
  }
}));

function NumberFormatCurrency(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalScale='2'
      fixedDecimalScale
    />
  );
}

NumberFormatCurrency.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function App() {
  const classes = useStyles();
  const [state, setState] = useState({
    billAmount: 0,
    taxPercent: 0.1,
    tax:0,
    subtotal: 0,
    tipPercent: 0.18,
    tip:0,
    total: 0,
  });

  const handleChange = name => (event, value) => {
    let {billAmount, subtotal, total, tipPercent, taxPercent, tax, tip} = state;

    if (!value && !event.target.value) return;
    switch (name){
      case 'billAmount':
        billAmount = parseFloat(event.target.value);
        tax = billAmount * taxPercent;
        subtotal = billAmount - tax;
        tip = subtotal * tipPercent;
        total = billAmount + tip;
        break;
      case 'subtotal':
        subtotal = parseFloat(event.target.value);
        tax = billAmount - subtotal;
        taxPercent = tax / billAmount;
        tip = subtotal * tipPercent;
        total = billAmount + tip;
        break;
      case 'total':
        total = parseFloat(event.target.value);
        tip = total - billAmount;
        tipPercent = tip / subtotal;
        break;
      case 'tip':
        tip = parseFloat(event.target.value);
        tipPercent = tip / subtotal;
        total = billAmount + tip;
        break;
      case 'tax':
        tax = parseFloat(event.target.value);
        subtotal = billAmount - tax;
        taxPercent = tax / billAmount;
        tip = subtotal * tipPercent;
        total = billAmount + tip;
        break;
      case 'tipPercent':
        tipPercent = value/100;
        tip = subtotal * tipPercent;
        total = billAmount + tip;
        break;
      case 'taxPercent':
        taxPercent = value/100;
        tax = billAmount * taxPercent;
        subtotal = billAmount - tax;
        tip = subtotal * tipPercent;
        total = billAmount + tip;
        break;
      default:
    }

    if (billAmount < 0) return;
    if (taxPercent < 0) return;
    if (tipPercent < 0) return;
    if (total < 0) return;

    setState({ ...state,
      billAmount: billAmount,
      taxPercent: taxPercent,
      tax: tax,
      subtotal: subtotal,
      tipPercent: tipPercent,
      tip: tip,
      total: total,
    });
  };

  function handleClick(name){
    let {billAmount, subtotal, total, tipPercent, taxPercent, tax, tip} = state;
    switch (name){
      case 'reset':
        taxPercent= 0.1;
        tax= billAmount * taxPercent;
        subtotal= billAmount - tax;
        tipPercent= 0.18;
        tip= subtotal * tipPercent;
        total= billAmount + tip;
        break;
      case 'clear':
        billAmount= 0;
        taxPercent= 0.1;
        tax= 0;
        subtotal= 0;
        tipPercent= 0.18;
        tip= 0;
        total= 0;
        break;
      case 'down':
        if (!total) return;
        total = total % 1 !== 0 ? Math.floor(total) : Math.floor(total)-1;
        tip = total - billAmount;
        tipPercent = tip / subtotal;
        break;
      case 'up':
        if (!total) return;
        total = total % 1 !== 0 ? Math.floor(total)+1 : Math.floor(total)+1;
        tip = total - billAmount;
        tipPercent = tip / subtotal;
        break;
      default:
    }

    setState({ ...state,
      billAmount: billAmount,
      taxPercent: taxPercent,
      tax: tax,
      subtotal: subtotal,
      tipPercent: tipPercent,
      tip: tip,
      total: total,
    });
  }

  return (
    <React.Fragment>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <Container maxWidth='xs' className={classes.root}>
      <Grid container justify='space-between'>
          <Grid item xs={6} >
            <Typography variant='h4' component='h1'>Tip</Typography>
          </Grid>
          <Grid item xs={3} >
            <Button fullWidth onClick={() => handleClick('reset')}>Reset</Button>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth onClick={() => handleClick('clear')}>Clear</Button>
          </Grid>
        </Grid>
        
        <TextField
          id="billAmount"
          label='Bill Amount'
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.billAmount > 0 ? state.billAmount : ''}
          onChange={handleChange('billAmount')}
          InputProps={
            state.billAmount > 0 ? {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: NumberFormatCurrency,
            } : {inputComponent: NumberFormatCurrency,}
          }
        />
        <TextField
          id="subtotal"
          label='Subtotal'
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.subtotal > 0 ? state.subtotal : ''}
          onChange={handleChange('subtotal')}
          InputProps={
            state.subtotal > 0 ? {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: NumberFormatCurrency,
            } : {inputComponent: NumberFormatCurrency,}
          }
        />
        <TextField
          id="tax"
          label={`Tax (${(state.taxPercent*100).toFixed(2)}%)`}
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.tax > 0 ? state.tax : ''}
          onChange={handleChange('tax')}
          InputProps={
            state.tax > 0 ? {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            readOnly: true,
            inputComponent: NumberFormatCurrency,
            } : 
            {
              readOnly: true,
              inputComponent: NumberFormatCurrency,  
            }
          }
        />
        <Slider
          id='taxSlider'
          valueLabelDisplay="auto"
          valueLabelFormat={()=>parseInt(state.taxPercent*100)+'%'}
          step={1}
          marks
          min={0}
          max={30}
          value={parseInt(state.taxPercent*100)}
          onChange={handleChange('taxPercent')}
        />
        <TextField
          id="tip"
          label={`Tip (${(state.tipPercent*100).toFixed(2)}%)`}
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.tip > 0 ? state.tip : ''}
          onChange={handleChange('tip')}
          InputProps={
            state.tip > 0 ? {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            readOnly: true,
            inputComponent: NumberFormatCurrency,
            } : 
            {
              readOnly: true,
              inputComponent: NumberFormatCurrency,
            }
          }
        />
        <Slider
          id='tipSlider'
          valueLabelDisplay="auto"
          valueLabelFormat={()=>parseInt(state.tipPercent*100)+'%'}
          step={1}
          marks
          min={0}
          max={30}
          value={parseInt(state.tipPercent*100)}
          onChange={handleChange('tipPercent')}
        />
        <TextField
          id="total"
          label='Total'
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.total > 0 ? state.total : ''}
          onChange={handleChange('total')}
          InputProps={
            state.total > 0 ? {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: NumberFormatCurrency,
            } : 
            {
              inputComponent: NumberFormatCurrency,
            }
          }
        />
        <Grid container justify='space-between'>
          <Grid item xs={3} >
            <Button fullWidth variant='outlined' onClick={() => handleClick('down')}>Down</Button>
          </Grid>
          <Grid item xs={6} >
            <Button fullWidth >Round Total</Button>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant='outlined' onClick={() => handleClick('up')}>Up</Button>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default App;
