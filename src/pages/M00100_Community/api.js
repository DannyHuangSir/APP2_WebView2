import { callAPI } from 'utilities/axios';

/**
 * 取得社群圈摘要資訊
 * @returns {
 *   uuid: 使用者識別碼，用來抓大頭貼用。下載後，存 localStorage
 *   nickname: 䁥稱
 *   socailLevel: 社群竹等級
 *   memberNo: 個人專用推薦碼
 *   essay: 分享短文
 *   community: { 社群圈概況
 *     hitTimes: 點擊人數
 *     applying: 申請中人數
 *     approved: 已核可人數
 *   }
 *   bonusInfo: { 社群圈回饋
 *     amount: 優惠存款額度
 *     profit: 信用卡分潤
 *     rate: 優惠存款利率
 *   }
 * }
 */
export const getSummary = async () => {
  const response = await callAPI('/community/v1/getSummary');
  return response.data;
};

/**
 * 取得接受推薦的好友名單
 * @returns [{
 *   friendUuid: 好友大頭貼
 *   friendName: 好友姓名
 *   creditCardApproved: 核卡完成日期
 *   depositApproved: Bankee臺幣開戶完成日期
 * }, ...]
 */
export const getFriends = async () => {
  const response = await callAPI('/community/v1/getFriends');
  return response.data;
};

/**
 * 更新大頭貼
 * @param {String} newImg 新的大頭貼影像，內容為 Base64 字串。
 * @returns
 */
export const updateAvatar = async (newImg) => {
  const response = await callAPI('/personal/v1/uploadAvatar', newImg);
  return response;
};

/**
 * 更新䁥稱
 * @returns
 */
export const updateNickname = async (nickname) => {
  const response = await callAPI('/personal/v1/setNickname', nickname);
  return response;
};

/**
 * 更新分享內容
 * @returns
 */
export const updateEssay = async (content) => {
  const response = await callAPI('/community/v1/updateEssay', content);
  return response;
};
