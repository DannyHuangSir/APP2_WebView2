// 要錢卡/邀請卡 mock data
const data = {
  imageId: 5, // number, 1 ~ 5
  ledgerName: '這裡填入帳本名稱',
  sendMemberId: 'uuidSendMember',
  sendMemberName: '發出人',
  receiveMemberId: 'uuidReceiveMember',
  receiveMemberName: '接收人',
  amount: 12000,
  type: '2',
  memo: '要錢說明欄',
};

/**
 * 取得要錢卡相關資料
 * @param {{
 * sendid: string
 * receiveid: string
 * txid: string
 * isOwner: boolean
 * isSelf: boolean
 * }} param param
 * @returns {{
 * imageId: number
 * ledgerName: string
 * sendMemberId: string
 * sendMemberName: string
 * receiveMemberId: string
 * receiveMemberName: string
 * amount: number
 * type: string
 * memo: string
 * }}
 */
export const cardMsg = (param) => {
  console.log('cardMsg', param);
  const response = {
    code: '0000',
    data,
  };

  return response.data;
};