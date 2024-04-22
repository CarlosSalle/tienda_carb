export const formatToMoney = (number) => {
    return parseFloat(number).toLocaleString('en', { minimumFractionDigits: 2 });
  }