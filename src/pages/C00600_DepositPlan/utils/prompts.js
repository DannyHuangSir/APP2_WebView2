import { showCustomPrompt } from 'utilities/MessageModal';
import { currencySymbolGenerator, stringToDate } from 'utilities/Generator';
import InformationList from 'components/InformationList';

export const AlertMainDepositPlanHasBeenSetAlready = () => {
  showCustomPrompt({
    title: '設定為主要存錢計畫',
    message: '目前的計畫已設定為主要存錢計畫。',
    okContent: '了解!',
    onOk: () => {},
  });
};

export const AlertUnavailableSubAccount = () => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '目前沒有可作為綁定存錢計畫之子帳戶，請先關閉帳本，或先完成進行中的存錢計畫。',
    okContent: '了解',
    onOk: () => {},
  });
};

export const PromptShouldCloseDepositPlanOrNot = ({ endDate, onOk, type }) => {
  const isAheadOfTime = endDate && (stringToDate(endDate) > new Date());

  showCustomPrompt({
    title: '結束本計畫',
    message: (
      <p style={{ textAlign: 'left' }}>
        您確定要
        {!!isAheadOfTime && '提早'}
        結束本計畫?
        <br />
        {!!isAheadOfTime && !!type && '提前結束計畫將無法獲得加碼獎勵'}
        <br />
        本計畫帳上餘額將撥入主帳戶
      </p>
    ),
    okContent: '確認結束',
    cancelContent: '我再想想',
    onOk,
    noDismiss: true,
    showCloseButton: false,
  });
};

export const ConfirmDepositPlanHasBeenClosed = ({ email, onOk }) => {
  showCustomPrompt({
    title: '計畫結束',
    message: `本存錢計畫已結束，存錢計畫相關資訊及存錢歷程將匯出至留存信箱${email}`,
    okContent: '回首頁',
    onOk,
    showCloseButton: false,
  });
};

export const ConfirmNotToCloseDepositPlan = (goHome) => {
  showCustomPrompt({
    title: '暫不結束計畫',
    message: (
      <p style={{width: 'fit-content', margin: '0 auto'}}>
        本計畫會持續保留至主動結束
        <br />
        如計畫已到期，將不繼續扣款
      </p>
    ),
    okContent: '確認',
    onOk: goHome,
    showCloseButton: false,
  });
};

export const ConfirmToTransferSubAccountBalance = ({ onOk, inAccount, outAccount }) => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: (
      <>
        欲作為存錢計畫之子帳戶餘額須為0，是否立即將您子帳戶之餘額撥入Bankee主帳戶。
        <InformationList title="轉出帳號" content={outAccount.accountNo} remark={outAccount.alias} />
        <InformationList title="轉入帳號" content={inAccount.accountNo} remark={inAccount.alias} />
        <InformationList title="轉帳金額" content={currencySymbolGenerator('NTD', outAccount.balance)} />
      </>
    ),
    okContent: '立即撥款',
    cancelContent: '我再想想',
    onOk,
    onCancel: () => {},
  });
};

export const AlertProgramNoFound = ({ onOk, onCancel, onClose }) => {
  showCustomPrompt({
    title: '找不到計畫資訊',
    message: '可能是編輯中頁面刷新所導致，請重新建立。',
    okContent: '建立存錢計畫',
    cancelContent: '回上一頁',
    onOk,
    onCancel,
    onClose,
  });
};

export const AlertInvalidEntry = ({ goBack, goHome }) => {
  showCustomPrompt({
    title: '系統錯誤',
    message: '本頁為操作流程之分頁，不應獨立造訪，請回上一頁。',
    okContent: '回上一頁',
    cancelContent: '回首頁',
    onOk: goBack,
    onCancel: goHome,
  });
};

export const AlertReachedMaxPlans = ({ goBack, goHome }) => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '您已建立（最多）3個存錢計畫。',
    okContent: '回上一頁',
    cancelContent: '回首頁',
    onOk: goBack,
    onCancel: goHome,
  });
};

export const AlertUpdateFail = () => {
  showCustomPrompt({
    title: '更新存錢計畫',
    message: '更新失敗，請稍候重試。',
    okContent: '了解',
    onOk: () => {},
  });
};
