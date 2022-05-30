import { showCustomPrompt } from 'utilities/MessageModal';
import { stringToDate } from 'utilities/Generator';
import { goHome } from 'utilities/AppScriptProxy';

export const AlertNoMainAccount = ({ onOk }) => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '您尚未持有Bankee存款帳戶',
    onOk,
    okContent: '現在就來申請吧!',
  });
};

export const AlertMainDepositPlanHasBeenSetAlready = () => {
  showCustomPrompt({
    title: '設定為主要存錢計畫',
    message: '目前的計畫已設定為主要存錢計畫。',
    okContent: '了解!',
  });
};

export const AlertUnavailableSubAccount = () => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '目前沒有可作為綁定存錢計畫之子帳戶，請先關閉帳本後，或先完成已進行中的存錢計畫。',
    okContent: '現在就來申請吧!',
  });
};

export const PromptShouldCloseDepositPlanOrNot = ({ endDate, onOk }) => {
  const isPlanExpired = endDate && (stringToDate(endDate) < new Date());

  showCustomPrompt({
    title: '結束本計畫',
    message: (
      <p style={{ textAlign: 'left' }}>
        您確定要
        {!isPlanExpired && '提早'}
        結束本計畫?
        <br />
        本計畫帳上餘額將轉回主帳戶
      </p>
    ),
    okContent: '確認結束',
    cancelContent: '我再想想',
    onOk,
    noDismiss: true,
  });
};

export const ConfirmDepositPlanHasBeenClosed = ({ email, onOk }) => {
  showCustomPrompt({
    title: '結束本計畫',
    message: `本存錢計畫已結束，存錢計畫相關資訊及存錢歷程將匯出至留存信箱${email}`,
    okContent: '確認',
    onOk,
  });
};

export const ConfirmNotToCloseDepositPlan = () => {
  showCustomPrompt({
    title: '暫不結束計畫',
    message: (
      <p style={{ textAlign: 'left' }}>
        本計畫會持續保留至主動結束
        <br />
        本計畫帳上餘額將於結束當日轉回主帳戶
      </p>
    ),
    okContent: '回首頁',
    onOk: goHome,
  });
};

export const AlertProgramNoFound = ({ onOk, onCancel }) => {
  showCustomPrompt({
    title: '找不到計畫資訊',
    message: '可能是編輯中頁面刷新所導致，請重新建立。',
    okContent: '建立存錢計畫',
    cancelContent: '回上一頁',
    onOk,
    onCancel,
  });
};