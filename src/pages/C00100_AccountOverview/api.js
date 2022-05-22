import { callAPI } from 'utilities/axios';

/**
 * 取得個人資產(Assets)及負債(Debts)總覽資訊。
 * @returns {object}
 {
    // 資產清單
    assets: [{
      type, // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo, // 帳號
      balance, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias, // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    }, ...],
    // 負債清單
    debts: [{
      type, // 類型 CC:信用卡, L:貸款
      accountNo, // 卡號 或 貸款帳戶號
      balance, // 帳戶餘額（雖為負債，但金額「不會」是負值）
    }, ...],
 */
export const getBalanceInfo = async () => {
  const response = await callAPI('/api/deposit/v1/balanceInfo');
  return response.data;
};