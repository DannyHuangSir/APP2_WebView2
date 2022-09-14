import { callAPI } from 'utilities/axios';

import mockLoanSummary from './mockData/mockLoanSummary';
import mockLoanRewards from './mockData/mockRewards';
import mockLoanDetails from './mockData/mockLoanDetails';

/**
 * 貸款首頁 - 取得貸款資訊和還款紀錄
   @returns [
   {
     alias: 貸款別名
     accountNo: 卡號
     loanNo: 貸款分號
     balance: 貸款餘額
     currency: 幣別
     bonusInfo: {
       cycleTiming: 每期還款日，回傳數字1~28
       interest: 應繳本息
       rewards: 可能回饋，未參加回饋挑戰可忽略
       isJoinedRewardProgram: 是否參加回饋挑戰
       currency: 幣別
     },
     transactions: [
       {
         id: TODO 跳轉單筆繳款紀錄查詢頁需要
         txnDate: 交易日期
         amount: 還款金額
         balance: 貸款餘額
         currency: 幣別
       }, ...],
    }, ...]
 */
export const getLoanSummary = async () => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanSummary }));
  return response.data;
};

/**
 * 可能回饋 - 取得回饋紀錄
   @param {
     accountNo: 指定貸款帳號
     month: 指定月份，或null、undefined為最近的六個月
   }
   @returns {
     rewards: 可能回饋，未參加回饋挑戰可忽略
     isJoinedRewardProgram: 是否參加回饋挑戰
     currency: 幣別
     transactions: [
       {
         isSuccess: 挑戰成功或失敗
         txnDate: 交易日期
         amount: 利息金額，挑戰失敗可忽略
         rate: 利息（不含%），挑戰失敗可忽略
         currency: 幣別，挑戰失敗可忽略
       }, ...]
   }
 */
export const getLoanRewards = async (param) => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanRewards(param) }));
  return response.data;
};

/**
 * 貸款資訊 - 取得貸款資訊
   @param {
     accountNo: 指定貸款帳號
   }
   @returns {
     alias: 貸款別名
     accountNo: 貸款帳號
     loanNo: 貸款分號
     loanType: 貸款類別
     startDate: 貸款開始日
     endDate: 貸款結束日
     cycleTiming: 每期還款日，回傳數字1~28
     loanAmount: 貸款金額
     rate: 貸款利率
     loanBalance: 貸款餘額
     periodPaid: 已繳期數
     periodRemain: 剩餘期數
     initialAmount: 最初撥貸金額
     currency: 幣別
   },
 */
export const getLoanDetails = async (param) => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanDetails(param) }));
  return response.data;
};

/**
 * 下載合約
   @param {
      accountNo: 貸款號
      fileType: 1 = pdf 或 2 = excel
   }
   @returns {
     url: 檔案URL。
   }
 */
export const getContract = async (param) => {
  /* TODO
  if (fileType === 1) {
    await downloadPDF('/api/deposit/v1/getDepositBook', request, `${filename}.pdf`);
  } else if (fileType === 2) {
    await downloadCSV('/api/deposit/v1/getDepositBook', request, `${filename}.csv`);
  }
  */
  const { accountNo, format } = param;
  alert(`待串接API，下載合約貸款號：${accountNo}`, format === 1 ? '下載PDF' : '下載EXCEL');
};

/**
 * 下載清償證明
   @param {
      accountNo: 貸款號
      fileType: 1 = pdf 或 2 = excel
   }
   @returns {
     url: 檔案URL。
   }
 */
export const getStatment = async (param) => {
  /* TODO
  if (fileType === 1) {
    await downloadPDF('/api/deposit/v1/getDepositBook', request, `${filename}.pdf`);
  } else if (fileType === 2) {
    await downloadCSV('/api/deposit/v1/getDepositBook', request, `${filename}.csv`);
  }
  */
  const { accountNo, format } = param;
  alert(`待串接API，下載證明貸款號：${accountNo}`, format === 1 ? '下載PDF' : '下載EXCEL');
};

/**
 * 查詢分帳應繳摘要資訊 (用於子首頁)。
 *
 * @param token
 * @return [{
 *      account       放款帳號 (每人在遠銀只有一個)
 *      subNo         分帳序號 (每次貸款一個序號)    L0003.sqno
 *      balance       貸放餘額                      L0003.actbal
 *      payDate       應繳日期                      L0101.CNIRDT
 *      payAmount     應繳本息                      L0101.ISTPRT
 *      debitAccount  扣款帳號                      L0101.PAYACTNO
 *    }...
 * ]
 */
export const getSubSummary = async (request) => {
  const response = await callAPI('/api/loan/v1/getSubSummary', request);
  return response.data;
};

/**
 * 查詢分帳還款紀錄
 *
 * @param token
 * @param {
 *    account:    放款帳號(每人一個)   ex: 02905000006466
 *    subNo:      分帳序號            ex: 0001
 *    startDate:  查詢起日            (西元年 20220131) 統一用西元年
 *    endDate:    查詢迄日            (西元年 20220228) 統一用西元年
 *  }
 * @return [{
 *    date:           交易日期                L0106.txDate
 *    amount:         繳款金額 (=應繳金額)    L0106.txAmt
 *    balance:        貸款餘額 (=本金餘額     L0106.actBal
 *    type:           交易種類  ex: 還本付息  L0106.txCd
 *    splitPrincipal: 攤還本金                L0106.priAmt
 *    interest:       利息                    L0106.intAmt
 *    overInterest:   逾期息                  L0106.dintAmt
 *    defaultAmount:  違約金                  L0106.dfAmt
 *    rate:           計息利率                L0106.fitIrt
 *   }...
 * ]
 *
 */
export const getSubPaymentHistory = async (param) => {
  const response = await callAPI('/api/loan/v1/getSubPaymentHistory', param);
  return response.data;
};

/**
 * 查詢分帳應繳資訊
 *
 * @param token
 * @param {
 *    account:  放款帳號(每人一個)   ex: 02905000006466
 *    subNo:    分號                ex: 0001
 *   }
 * @return [{
 *    amount          本期應繳金額    L0102.PRIAMT + L0102.INTAMT + L0102.DIAMT + L0102.DFAMT
 *    startDate       計息期間起      L0102.OSDATE
 *    endDate         計息期間迄      L0102.OEDATE
 *    rate            利率%           L0102.FITIRT
 *    principal       計息本金        L0102.INTPRT
 *    splitPrincipal  攤還本金        L0102.PRIAMT
 *    interest        利息            L0102.INTAMT
 *    overInterest    逾期息          L0102.DIAMT
 *    defaultAmount   違約金          L0102.DFAMT
 * }]
 *
 */
export const getSubPayment = async (param) => {
  const response = await callAPI('/api/loan/v1/getSubPayment', param);
  return response.data;
};
