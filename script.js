'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data 
//selecting dom element

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "Fri Jan 2 2023 21:40:05 GMT-0800",
    "Fri Jan 13 2023 13:40:05 GMT-0800",
    "Fri Jan 3 2023 21:40:05 GMT-0800",
    "Fri Jan 3 2023 21:40:05 GMT-0800",
    "Fri Jan 6 2023 21:40:05 GMT-0800",
    "Fri Jan 8 2023 21:40:05 GMT-0800",
    "Fri Jan 11 2023 21:40:05 GMT-0800",
    "Fri Jan 12 2023 21:40:05 GMT-0800",
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-13T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-16T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-13T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-16T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-13T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-16T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate=function(date){
  const caldate=(date1,date2)=>Math.round(Math.abs(date1-date2)/(1000 * 60 * 60 * 24));
  const daysPassed=caldate(new Date(),date);
    if(daysPassed===0) return 'Today';;
    if(daysPassed===1)  return 'Yestreday';
    if(daysPassed<=7) return `${daysPassed} days ago`;
    else{
  const day=`${date.getDay()}`.padStart(2,0);
  const month=`${date.getMonth() + 1}`.padStart(2,0);
  const year=date.getFullYear();
  return `${day}/${month}/${year}`;
    }
}
const startLogOutTimer=function(){
  let time=120;
  const timer=function(){
    const min=String(Math.trunc(time/60)).padStart(2,0);
    const sec=String(time%60).padStart(2,0);
    labelTimer.textContent=`${min}:${sec}`;
    if(time===0){
      clearInterval(stime);
      containerApp.style.opacity=0;
    }
    time--;
  };
  timer();
  const stime=setInterval(timer,1000);
  return stime;
};
const displayMovements=function(acc){
  containerMovements.innerHTML='';
  acc.movements.forEach(function(mov,index){
    const date=new Date(acc.movementsDates[index]);
    const displayDate=formatMovementDate(date);
    const type=mov>0?'deposit':'withdrawal';
  const html=`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${index +1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
   </div>`  //creating html element using template string
  containerMovements.insertAdjacentHTML("afterbegin",html);
});
const now=new Date();
const month=`${now.getMonth() + 1}`.padStart(2,0);
const day=`${now.getDay()}`.padStart(2,0);
const year=now.getFullYear();
const min=`${now.getMinutes()}`.padStart(2,0);
const hours=`${now.getHours()}`.padStart(2,0);
labelDate.textContent=`${day}/${month}/${year},${hours}:${min}`;
}
const calcDisplayBalance=function(account){
  account.balance=account.movements.reduce((acc,cur)=>acc+cur,0);
  labelBalance.textContent=account.balance.toFixed(2);
}
const calcDisplaySummary=function(account){
  const incomes=account.movements.filter(mov=>mov>0).reduce((acc,mov)=>mov+acc,0);
  labelSumIn.textContent=incomes.toFixed(2); 
  const outcomes=account.movements.filter(mov=>mov<0).reduce((acc,mov)=>mov + acc,0);
  labelSumOut.textContent=Math.abs(outcomes).toFixed(2);
  const interest=account.movements
  .filter(mov=>mov>0)
  .map(deposit=>deposit*account.interestRate/100)
  .filter(int=>int>=1)
  .reduce((acc,mov)=>acc+mov,0);
  labelSumInterest.textContent=interest.toFixed(2);
}
const createUserName=function(accs){
  accs.forEach(acc=>{
    acc.userName=acc.owner
    .toLowerCase().split(' ').map(names=>names[0]).join('');
  })
}
createUserName(accounts);
const updateUI=function(account){
displayMovements(account);
calcDisplayBalance(account)
calcDisplaySummary(account);
}
let currentaccount,times;
// currentaccount=account1;
// updateUI(currentaccount);
// containerApp.style.opacity=100;

btnLogin.addEventListener('click',function(e){
  //prevent from submitting
   e.preventDefault();
   currentaccount=accounts.find(acc=>acc.userName===inputLoginUsername.value);
   if(currentaccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome ${currentaccount.owner.split(' ')[0]}`;
    containerApp.style.opacity=100;
      inputLoginUsername.value=inputLoginPin.value='';
      inputLoginPin.blur(); // make the pin filed to loos its focus
      if(times) clearInterval(times);
      times=startLogOutTimer();
   updateUI(currentaccount);
   } 
   });
   btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Number(inputTransferAmount.value);
    const receiveracc=accounts.find(acc=>acc.userName===inputTransferTo.value);
    inputTransferTo.value=inputTransferAmount.value='';
    if(amount>0 &&  receiveracc && amount <= currentaccount.balance && receiveracc.userName !== currentaccount.userName){
      receiveracc.movements.push(amount);
      currentaccount.movements.push(-amount);
      currentaccount.movementsDates.push(new Date());
      receiveracc.movementsDates.push(new Date());
      updateUI(currentaccount);
      clearInterval(times);
      times=startLogOutTimer();
    }
  });
  btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(currentaccount.userName === inputCloseUsername.value && currentaccount.pin === Number(inputClosePin.value)){
      const index=accounts.findIndex(acc=>acc.userName === currentaccount.userName);
      accounts.splice(index,1);
      containerApp.style.opacity=0;
    }
    inputCloseUsername.value=inputClosePin.value='';
  });
  btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Math.floor(inputLoanAmount.value);
    if(amount >0 && currentaccount.movements.some(mov=>mov>=amount * 0.1))
      setTimeout(()=>{
        currentaccount.movements.push(amount);
        currentaccount.movementsDates.push(new Date());
        updateUI(currentaccount);
        clearInterval(times);
        times=startLogOutTimer();
    },2500);
  })
  //for flating nested array
// const overBalance=accounts.flatMap(acc=>acc.movements).reduce((acc,mov)=>acc+mov,0);
// const overBalance=accounts.map(acc=>acc.movements);
// console.log(overBalance);
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  //ascendign
  currentaccount.movements.sort((a,b)=>a-b);
  displayMovements(currentaccount)
})
