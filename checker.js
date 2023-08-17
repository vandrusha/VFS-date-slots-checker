// Specify cities VC is located you want to monitor

const vcCities = ['Grodno', 'Lida', 'Minsk', 'Gomel', 'Mogilev'];

// specify visa categories in for each VC you want to check
const cityToCategoriesMap = {
  'Grodno': ['Other D-visa', 'Postal D-visa'],
  'Lida': ['Other D-visa', 'Postal D-visa'],
  'Minsk': ['D - National'], // , 'Postal D-visa', 'D - National Visa' - glitch
  'Gomel': ['D - National'], // 'D - National Visa'
  'Mogilev': ['D - National'] // 'D - National Visa'
}

// text of the message that will be sent to your telegram channel
const messageForError = 'Oops! Something went wrong';

// specify telegram bot and it's token
const telegramBotAddress = 'bot123123123:XXXXXYYYYYZZZZZ'

// specify id of the chat you would like to send notifications
const chatId = '-1111111111';

// do not modify below this line

const errorHandler = () => {
  const appNotification = document.getElementsByTagName('app-notification')[0];
  if (appNotification.innerText.length > 0) {
    sendMessage('IP ban!')
  }
  return;
}

const sendMessage = (text) => {
  fetch(`https://api.telegram.org/${telegramBotAddress}/sendmessage`, {
    method: 'POST',
    body: JSON.stringify({
      'chat_id': `${chatId}`,
      'text': `${messageForError}`
    }),
    headers: {
      'Content-type':
        'application/json;charset=UTF-8'
    }
  })
  return;
}
const timer = ms => new Promise(res => setTimeout(res, ms));
async function eternalChecker(values) {

  const selectors = document.getElementsByClassName('mat-form-field');
  const selectablePart = (index) => selectors[index].getElementsByClassName('mat-select')[0];

  for (const vcCity of values) {
    // visa center selector
    selectablePart(0).click();
    errorHandler();
    const centers = document.getElementsByClassName('mat-option-text');
    const findVCvalue = (city) => [...centers]
      .filter(center => center.innerText.toLowerCase().replace(/ /g, '') === `Poland Visa Application Center-${city}`.toLowerCase().replace(/ /g, ''))[0];
    if (!findVCvalue(vcCity)) {
      sendMessage('VC undefined');
    }
    findVCvalue(vcCity).click()

    // category
    await timer(5000);
    errorHandler();
    selectablePart(1).click();
    const categories = document.getElementsByClassName('mat-option-text');
    const findCatValue = (value) => [...categories]
      .filter(category => category.innerText.toLowerCase().replace(/ /g, '') === value.toLowerCase().replace(/ /g, ''))[0];
    findCatValue('National Visa D').click();

    for (const subCategory of cityToCategoriesMap[vcCity]) {
      // sub category
      await timer(5000);
      errorHandler();
      selectablePart(2).click();
      const subCats = document.getElementsByClassName('mat-option-text');
      const findSubCatValue = (value) => [...subCats]
        .filter(subCat => subCat.innerText.toLowerCase().replace(/ /g, '') === value.toLowerCase().replace(/ /g, ''))[0];
      if (!findSubCatValue(subCategory)) {
        sendMessage('Subcategory undefined');
      }
      findSubCatValue(subCategory).click();

      // set date of birth
      await timer(5000);
      errorHandler();
      const datepicker = document.getElementsByClassName('input-group-addon')[0];
      if (!datepicker) {
        sendMessage('Datepicker undefined');
      }
      datepicker.click();
      const days = document.getElementsByClassName('ngb-dp-day ng-star-inserted');
      const firstDay = [...days].filter(day => day.innerText === '1')[0];
      if (!firstDay) {
        sendMessage('Datepicker undefined');
      }
      firstDay.click()
      // set nationality
      selectablePart(3).click();
      const nationalities = document.getElementsByClassName('mat-option-text');
      const nationElement = [...nationalities].filter(nationality => nationality.innerText === 'BELARUS')[0];
      if (!nationElement) {
        sendMessage('Nationalities undefined');
      }
      nationElement.click();

      await timer(1000);
      const nextButton = document.getElementsByClassName('mat-raised-button')[0];
      if (nextButton.innerText === 'Продолжить' && nextButton.disabled !== true) {
        sendMessage(`${vcCity} ${subCategory}`);
        return;
      }
      const noDatesAvailableMessage = document.getElementsByClassName('alert-info')[0]
      if (!noDatesAvailableMessage || noDatesAvailableMessage.length === 0 || !noDatesAvailableMessage.innerText.includes('Приносим извинения')) {
        sendMessage(messageForError);
        return;
      }
    }
  }

  const returnLink = document.getElementsByClassName('navbar-brand cursor-pointer')[0];
  returnLink.click();
  await timer(5000);
  errorHandler();
  const startBookingButton = document.getElementsByClassName('mat-raised-button')[0];
  startBookingButton.click();
  await timer(5000);
  eternalChecker(vcCities);
}

eternalChecker(vcCities);
