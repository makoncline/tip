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
import Box from '@material-ui/core/Box';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Brightness4Icon from '@material-ui/icons/Brightness4';

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
    tipPercent: 0.18,
  });
  const [dark, setDark] = useState(true);

  const darkTheme = createMuiTheme({
    palette: {
      type: dark ? 'dark' : 'light',
    },
  });

  const handleChange = name => (event, value) => {
    let { billAmount, tipPercent, taxPercent } = state;

    if (!value && !event.target.value) return;
    switch (name) {
      case 'billAmount':
        billAmount = parseFloat(event.target.value);
        break;
      case 'subtotal':
        {
          let subtotal = parseFloat(event.target.value);
          let tax = billAmount - subtotal;
          taxPercent = tax / billAmount;
        }
        break;
      // case 'total':
      //   {
      //     let total = parseFloat(event.target.value);
      //     let tip = total - billAmount;
      //     let tax = billAmount * taxPercent;
      //     let subtotal = billAmount - tax;
      //     tipPercent = tip / subtotal;
      //   }
      //   break;
      case 'tip':
        {
          let tip = parseFloat(event.target.value);
          let tax = billAmount * taxPercent;
          let subtotal = billAmount - tax;
          tipPercent = tip / subtotal;
        }
        break;
      case 'tax':
        {
          let tax = parseFloat(event.target.value);
          taxPercent = tax / billAmount;
        }
        break;
      case 'tipPercent':
        tipPercent = value / 100;
        break;
      case 'taxPercent':
        taxPercent = value / 100;
        break;
      default:
    }

    if (billAmount < 0) return;
    if (taxPercent < 0) return;
    if (tipPercent < 0) return;

    setState({
      ...state,
      billAmount: billAmount,
      taxPercent: taxPercent,
      tipPercent: tipPercent,
    });
  };

  const TIP_PERCENT = 0.18;
  const TAX_PERCENT = 0.1;

  function handleClick(name) {
    let { billAmount, tipPercent, taxPercent } = state;
    switch (name) {
      case 'reset':
        taxPercent = TAX_PERCENT;
        tipPercent = TIP_PERCENT;
        break;
      case 'clear':
        billAmount = 0;
        taxPercent = TAX_PERCENT;
        tipPercent = TIP_PERCENT;
        break;
      case 'down':
        {
          let tax = billAmount * taxPercent;
          let subtotal = billAmount - tax;
          let tip = subtotal * tipPercent;
          let total = billAmount + tip;
          if (!total) return;
          total = total % 1 !== 0 ? Math.floor(total) : Math.floor(total) - 1;
          tip = total - billAmount;
          tipPercent = tip / subtotal;
        }
        break;
      case 'up':
        {
          let tax = billAmount * taxPercent;
          let subtotal = billAmount - tax;
          let tip = subtotal * tipPercent;
          let total = billAmount + tip;
          if (!total) return;
          total = total % 1 !== 0 ? Math.floor(total) + 1 : Math.floor(total) + 1;
          tip = total - billAmount;
          tipPercent = tip / subtotal;
        }
        break;
      case 'dark':
        setDark(!dark);
        break;
      default:
    }

    setState({
      ...state,
      billAmount: billAmount,
      taxPercent: taxPercent,
      tipPercent: tipPercent,
    });
  }

  let tax = state.billAmount * state.taxPercent;
  let subtotal = state.billAmount - tax;
  let tip = subtotal * state.tipPercent;
  let total = state.billAmount + tip;

  return (
    <React.Fragment>
    <CssBaseline />
    <Box maxWidth='xs' className={classes.root}>
    <Container maxWidth='80%'>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Grid container justify='space-between' >
          <Grid item xs={3} >
            <Typography variant='h4' component='h1'>Tip</Typography>
          </Grid>
          <Grid item xs={3} >
            <Button aria-label="Dark mode" fullWidth onClick={() => handleClick('dark')}><Brightness4Icon/></Button>
          </Grid>
          <Grid item xs={3} >
            <Button aria-label="Reset" fullWidth onClick={() => handleClick('reset')}>Reset</Button>
          </Grid>
          <Grid item xs={3}>
            <Button aria-label="Clear" fullWidth onClick={() => handleClick('clear')}>Clear</Button>
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
            } : { inputComponent: NumberFormatCurrency, }
          }
        />
        <TextField
          id="subtotal"
          label='Subtotal'
          margin="normal"
          variant="outlined"
          fullWidth
          value={subtotal > 0 ? subtotal : ''}
          onChange={handleChange('subtotal')}
          InputProps={
            state.subtotal > 0 ? {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputComponent: NumberFormatCurrency,
            } : { inputComponent: NumberFormatCurrency, }
          }
        />
        <TextField
          id="tax"
          label={`Tax (${(state.taxPercent * 100).toFixed(2)}%)`}
          margin="normal"
          variant="outlined"
          fullWidth
          value={tax > 0 ? tax : ''}
          onChange={handleChange('tax')}
          InputProps={
            state.tax > 0 ? {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputComponent: NumberFormatCurrency,
            } :
              {
                inputComponent: NumberFormatCurrency,
              }
          }
        />
        <Slider
          id='taxSlider'
          valueLabelDisplay="auto"
          valueLabelFormat={() => parseInt(state.taxPercent * 100) + '%'}
          step={1}
          marks
          min={0}
          max={30}
          value={parseInt(state.taxPercent * 100)}
          onChange={handleChange('taxPercent')}
        />
        <TextField
          id="tip"
          label={`Tip (${(state.tipPercent * 100).toFixed(2)}%)`}
          margin="normal"
          variant="outlined"
          fullWidth
          value={tip > 0 ? tip : ''}
          onChange={handleChange('tip')}
          InputProps={
            state.tip > 0 ? {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputComponent: NumberFormatCurrency,
            } :
              {
                inputComponent: NumberFormatCurrency,
              }
          }
        />
        <Slider
          id='tipSlider'
          valueLabelDisplay="auto"
          valueLabelFormat={() => parseInt(state.tipPercent * 100) + '%'}
          step={1}
          marks
          min={0}
          max={30}
          value={parseInt(state.tipPercent * 100)}
          onChange={handleChange('tipPercent')}
        />
        <TextField
          id="total"
          label='Total'
          margin="normal"
          variant="outlined"
          fullWidth
          value={total > 0 ? total : ''}
          onChange={handleChange('total')}
          InputProps={
            state.total > 0 ? {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputComponent: NumberFormatCurrency,
              readOnly: true,
            } :
              {
                inputComponent: NumberFormatCurrency,
                readOnly: true,
              }
          }
        />
        <Grid container justify='space-between'>
          <Grid item xs={3} >
            <Button aria-label="Round down" fullWidth variant='outlined' onClick={() => handleClick('down')}>Down</Button>
          </Grid>
          <Grid item xs={6} >
            <Button aria-label="Round total" fullWidth >Round Total</Button>
          </Grid>
          <Grid item xs={3}>
            <Button aria-label="Round up" fullWidth variant='outlined' onClick={() => handleClick('up')}>Up</Button>
          </Grid>
        </Grid>
    </ThemeProvider>
    </Container>
    </Box>
    </React.Fragment>
  );
}

export default App;
