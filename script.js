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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements=function(movements){
  containerMovements.innerHTML='';
  movements.forEach(function(mov,index){
    const type=mov>0?'deposit':'withdrawal';
  const html=`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${index +1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}???</div>
   </div>`  //creating html element using template string
  containerMovements.insertAdjacentHTML("afterbegin",html);
});
}
const calcDisplayBalance=function(account){
  account.balance=account.movements.reduce((acc,cur)=>acc+cur,0);
  labelBalance.textContent=account.balance;
}
const calcDisplaySummary=function(account){
  const incomes=account.movements.filter(mov=>mov>0).reduce((acc,mov)=>mov+acc,0);
  labelSumIn.textContent=incomes; 
  const outcomes=account.movements.filter(mov=>mov<0).reduce((acc,mov)=>mov + acc,0);
  labelSumOut.textContent=Math.abs(outcomes);
  const interest=account.movements
  .filter(mov=>mov>0)
  .map(deposit=>deposit*account.interestRate/100)
  .filter(int=>int>=1)
  .reduce((acc,mov)=>acc+mov,0);
  labelSumInterest.textContent=interest;
}
const createUserName=function(accs){
  accs.forEach(acc=>{
    acc.userName=acc.owner
    .toLowerCase().split(' ').map(names=>names[0]).join('');
  })
}
createUserName(accounts);
const updateUI=function(account){
displayMovements(account.movements);
calcDisplayBalance(account)
calcDisplaySummary(account);
}
let currentaccount;
btnLogin.addEventListener('click',function(e){
  //prevent from submitting
   e.preventDefault();
   currentaccount=accounts.find(acc=>acc.userName===inputLoginUsername.value);
   if(currentaccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=currentaccount.owner.split(' ')[0];
    containerApp.style.opacity=100;
      inputLoginUsername.value=inputLoginPin.value='';
      inputLoginPin.blur(); // make the pin filed to loos its focus
   updateUI(currentaccount);
   } //optional chaining(?)
   });
   btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Number(inputTransferAmount.value);
    const receiveracc=accounts.find(acc=>acc.userName===inputTransferTo.value);
    inputTransferTo.value=inputTransferAmount.value='';
    if(amount>0 &&  receiveracc && amount <= currentaccount.balance && receiveracc.userName !== currentaccount.userName){
      receiveracc.movements.push(amount);
      currentaccount.movements.push(-amount);
      updateUI(currentaccount);
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
    const amount=Number(inputLoanAmount.value);
    if(amount >0 && currentaccount.movements.some(mov=>mov>=amount * 0.1)){
      currentaccount.movements.push(amount);
      updateUI(currentaccount);
    }
  })
  //for flating nested array
// const overBalance=accounts.flatMap(acc=>acc.movements).reduce((acc,mov)=>acc+mov,0);
// console.log(overBalance);
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  //ascendign
  currentaccount.movements.sort((a,b)=>a-b);
  // currentaccount.movements.sort((a,b)=>b-a);
  // updateUI(currentaccount);
  displayMovements(currentaccount.movements)
})

