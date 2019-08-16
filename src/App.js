import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
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

function KeypadBtn(props) {
  const classes = useStyles();
  return (
    <Grid item xs={4} >
      <Button fullWidth variant='outlined' className={classes.numBtn} onClick={() => props.handleNumpadInput(props.value)}>{props.value}</Button>
    </Grid>
  );
}

function Keypad(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
    { props.visible &&
      <Grid container spacing={1} justify='center' alignItems='center' className={classes.numCol}>
        <Grid item xs={12}>
          <Grid container spacing={1} justify='space-between' alignItems='center' className={classes.numRow}>
            <KeypadBtn value='1' handleNumpadInput={props.handleNumpadInput} />
            <KeypadBtn value='2' handleNumpadInput={props.handleNumpadInput} />
            <KeypadBtn value='3' handleNumpadInput={props.handleNumpadInput} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} className={classes.numRow}>
            <KeypadBtn value='4' handleNumpadInput={props.handleNumpadInput} />
            <KeypadBtn value='5' handleNumpadInput={props.handleNumpadInput} />
            <KeypadBtn value='6' handleNumpadInput={props.handleNumpadInput} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} className={classes.numRow}>
            <KeypadBtn value='7' handleNumpadInput={props.handleNumpadInput} />
            <KeypadBtn value='8' handleNumpadInput={props.handleNumpadInput} />
            <KeypadBtn value='9' handleNumpadInput={props.handleNumpadInput} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} className={classes.numRow}>
            <Grid item xs={4} >
              <Button fullWidth variant='outlined' className={classes.numBtn} onClick={() => props.handleNumpadInput('back')}>back</Button>
            </Grid>
            <KeypadBtn value='0' handleNumpadInput={props.handleNumpadInput} />
            <Grid item xs={4} >
              <Button fullWidth variant='outlined' className={classes.numBtn} onClick={() => props.handleNumpadInput('clear')}>clear</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    }
    </React.Fragment>
  );
}

function Display(props) {
  const classes = useStyles();

  return (
    <TextField
      className={classes.display}
      InputProps={{
          readOnly: true,
        }}
      id="outlined-disabled"
      label={props.label}
      margin="normal"
      variant="outlined"
      fullWidth
      value={props.value}
    />
  );
}

function TipPercent(props) {
  const [percent, setPercent] = useState(0.18);

  function handleClick(val) {
    switch (val) {
      case '-':
        let newVal = percent - 0.01;
        setPercent(newVal > 0.00 && newVal);
        break;
      case '+':
        setPercent(percent + 0.01);
        break;
      default:
    }
  }

  return (
    <React.Fragment>
      <Display label='Tip Percentage' value={(percent*100).toFixed(2)+' %'} />
      <Grid container justify='space-between'>
        <Grid item xs={4} >
          <Button fullWidth variant='outlined' onClick={() => handleClick('-')}>-</Button>
        </Grid>
        <Grid item xs={4}>
          <Button fullWidth variant='outlined' onClick={() => handleClick('+')}>+</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function BillInput(props) {

  function handleNumpadInput(value) {
    let billString = props.bill.length > 0 ? (props.bill * 100).toFixed(0) + '' : ''
    console.log('bill: ' + props.bill);
    console.log('before: ' + billString);
    switch (value) {
      case 'back':
        if (billString.length > 0) {
          billString = [...billString].slice(0, billString.length - 1).join('');
        }
        break;
      case 'clear':
        billString = '';
        break;
      case '0':
        if (billString.length > 10) return;
        if (billString !== '') {
          billString = billString + value;
        }
        break;
      default:
        if (billString.length > 10) return;
        billString = billString + value;
    }
    console.log('after: ' + billString);
    props.setBill(billString ? (billString / 100).toFixed(2) + '' : '');
  }

  return (
    <React.Fragment>
      <Display 
        onFocus={()=>alert('hello')} 
        label='Enter bill amount:' 
        value={props.bill.length > 0 ? 
          parseFloat(props.bill).toLocaleString("en-US", { 
              style: "currency", 
              currency: "USD"
            }) : ''} />
      <Keypad handleNumpadInput={handleNumpadInput} />
    </React.Fragment>
  );
}

function TipCalc(props){
  const classes = useStyles();
  console.log('bill amount: '+props.billAmount);
  const tax= props.billAmount * props.taxPer;
  console.log('tax :'+tax);
  const subTotal = props.billAmount - tax;
  console.log('subTotal :'+subTotal);
  const tip = (props.billAmount-tax) * props.tipPer;
  console.log('tip :'+tip);
  const total = props.billAmount + tip;
  console.log('total :'+total);
  
  return(
    <Table >
      <TableBody>
        <TableRow >
          <TableCell align='right'className={`${classes.noBorder} ${classes.tipCalc}`}>
            <Typography variant="h5" component="h2">
              Subtotal:
            </Typography>
          </TableCell>
          <TableCell align='right'className={`${classes.noBorder} ${classes.tipCalc}`}>
            <Typography variant="h5" component="h2">
              {subTotal.toLocaleString("en-US", { 
                  style: "currency", 
                  currency: "USD"
                })}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow >
          <TableCell align='right'className={classes.noBorder}>
            <Typography variant="h6" component="h2">
              Tax ({(props.taxPer*100).toFixed(0)}%):
            </Typography>
          </TableCell>
          <TableCell align='right'className={classes.noBorder}>
            <Typography variant="h6" component="h2">
              {tax.toLocaleString("en-US", { 
                  style: "currency", 
                  currency: "USD"
                })}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow >
          <TableCell align='right'>
            <Typography variant="h5" component="h2">
              Tip ({(props.tipPer*100).toFixed(0)}%):
            </Typography>
          </TableCell>
          <TableCell align='right'>
            <Typography variant="h5" component="h2">
              {tip.toLocaleString("en-US", { 
                  style: "currency", 
                  currency: "USD"
                })}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow >
          <TableCell align='right'className={classes.noBorder}>
            <Typography variant="h5" component="h2">
              Total:
            </Typography>
          </TableCell>
          <TableCell align='right'className={classes.noBorder}>
            <Typography variant="h5" component="h2">
              {total.toLocaleString("en-US", { 
                  style: "currency", 
                  currency: "USD"
                })}
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

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
      decimalScale={2}

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
    tipPercent: 0.15,
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
        tipPercent= 0.15;
        tip= subtotal * tipPercent;
        total= billAmount + tip;
        break;
      case 'clear':
        billAmount= 0;
        taxPercent= 0.1;
        tax= 0;
        subtotal= 0;
        tipPercent= 0.15;
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
        <Keypad visible={false}/>
        <TextField
          id="subtotal"
          label='Subtotal'
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.subtotal > 0 ? formatCurrency(state.subtotal) : ''}
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
          label={`Tax (${parseInt(state.taxPercent*100)}%)`}
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.tax > 0 ? formatCurrency(state.tax) : ''}
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
          label={`Tip (${parseInt(state.tipPercent*100)}%)`}
          margin="normal"
          variant="outlined"
          fullWidth
          value={state.tip > 0 ? formatCurrency(state.tip) : ''}
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
          value={state.total > 0 ? formatCurrency(state.total) : ''}
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

function formatCurrency(val){
  return parseFloat(val.toFixed(2));
  // .toLocaleString("en-US", { 
  //   style: "currency", 
  //   currency: "USD"
  // });
}

export default App;
