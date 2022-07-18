import uuid from 'react-uuid';

const dateToCodeString = (date) => date.toISOString().slice(0, 10).replaceAll('-', '');

const stringToDate = (date) => new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`);

export default function mockTransactions(param) {
  const start = stringToDate(param.startDate);
  const end = stringToDate(param.endDate);

  const list = [];
  while (start <= end) {
    list.push(dateToCodeString(end));
    end.setDate(end.getDate() - 1);
  }

  return list.map((l) => ({
    id: uuid(),
    index: 1,
    bizDate: l,
    txnDate: l,
    txnTime: 210156,
    description: '全家便利商店',
    memo: '',
    targetMbrId: null,
    targetNickName: null,
    targetBank: '000',
    targetAcct: '11122233334444',
    amount: Math.random() * 29_990 + 10,
    balance: 386000,
    cdType: 'cc',
    currency: 'TWD',
  }));
}