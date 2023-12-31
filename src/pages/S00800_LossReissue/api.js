import { callAPI } from 'utilities/axios';

/**
 * 個人基本資料變更
 * @param {{
 *    zipCode:  郵遞區號
 *    city:   縣市
 *    county:     鄉鎮市區
 *    addr:     地址
 * }} cifData
* @returns {Promise<{ isSuccess, code, message }>} 更新成功與否的旗標。
 */
export const updateProfile = async (cifData) => {
  const response = await callAPI('/personal/v1/updateProfile', { mode: 3, ...cifData });
  return response;
};

/**
 * 查詢金融卡的卡況
 *
 * @param token
 * @return {
 *    status:       卡片狀態 1.新申請, 2.製卡 , 4.啟用, 5.掛失, 6.註銷, 7.銷戶, 8.臨時掛失, 9.整批申請
 *    statusDesc:   狀態描述 (1, 9) '申請中', (2) '尚未開卡', (4) '已啟用', (5) '已掛失', (6) '已註銷', (7) '已銷戶', (8) '已暫掛'
 *    addrCity:     通訊地址(縣市)    g0101.ADR2-CT
 *    addrDistrict: 通訊地址(區)      g0101.ADR2-AR
 *    addrStreet:   通訊地址(街道路)   g0101.ADR2-RD
 *    account:      臺幣數存母帳號
 * }
 * @throws Exception
 *
 */
export const getStatus = async (params) => {
  const response = await callAPI('/deposit/withdraw/card/v1/getStatus', params);
  return response.data;
};

/**
 * 金融卡掛失
 * 條件: 卡況 需要 2製卡 4已啟用 8臨時掛失中 這三種時，才可以掛失
 */
export const reissueOrLost = async () => {
  const response = await callAPI('/deposit/withdraw/card/v1/reissueOrLost');
  return response;
};
