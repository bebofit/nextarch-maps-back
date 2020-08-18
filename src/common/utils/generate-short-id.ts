const generateShortId = () => {
  const numbers = '0123456789';
  const ID_LENGTH = 4;
  let rtn = '';
  let num: number = 0;
  // tslint:disable-next-line: no-increment-decrement
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  rtn = rtn + new Date().valueOf();
  num = parseInt(rtn.slice(0, 6), 10);
  return num;
};

export { generateShortId };
