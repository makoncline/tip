import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

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

function App() {
  const classes = useStyles();
  const [bill, setBill] = useState('');

  return (
    <React.Fragment>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <Container maxWidth='xs' className={classes.root}>
        <Typography variant='h4' component='h1'>Tip</Typography>
        <BillInput bill={bill} setBill={setBill}/>
        {/* <TipPercent /> */}
        <TipCalc billAmount={bill ? parseFloat(bill) : 0} taxPer={0.10} tipPer={0.18} />
      </Container>
    </React.Fragment>
  );
}

export default App;
