import {
  accountFormatter,
  accountOverviewCardVarient,
  currencySymbolGenerator,
} from 'utilities/Generator';

import AccountCardWrapper from './AccountCard.style';

/*
* ==================== AccountCard 組件說明 ====================
* 帳戶總覽組件
* ==================== AccountCard 可傳參數 ====================
* 1. type -> 帳戶科目別 (ex: "004")
* 2. cardName -> 卡片名稱
* 3. accountNo -> 卡片帳號
* 4. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
* 5. color -> 卡片顏色，預設紫色
* 6. hasShadow -> 顯示影子，預設無
* 7. dollarSign -> 貨幣符號，預設為 '$'
* 8. percent -> 百分比（0~100，不含符號）
* 9. annotation -> 金額旁的備註，如：以使用額度
* 10.ariaLabel -> title for button，預設為 cardName
* 11.children
* 12. isShowAccoutNo -> boolean。是否顯示帳號，預設為true
* */

const AccountCard = ({
  type = 'M',
  cardName,
  accountNo,
  balance,
  color,
  hasShadow = false,
  dollarSign = 'NTD',
  percent,
  annotation,
  ariaLabel,
  children,
  fixHeight,
  isShowAccoutNo = true,
}) => (
  <AccountCardWrapper
    fixHeight={fixHeight}
    title={ariaLabel || cardName}
    $cardColor={color || accountOverviewCardVarient(type).color}
    $hasShadow={hasShadow}
  >
    { children ?? (
      <>
        <div className="justify-between">
          <div>{cardName}</div>
          <div>
            {percent}
            %
          </div>
        </div>
        <div style={{ visibility: isShowAccoutNo && !!accountNo ? 'visible' : 'hidden' }}>{accountFormatter(accountNo, true)}</div>
        <div className="justify-between items-end">
          <div>{annotation}</div>
          <div className={`balance ${currencySymbolGenerator(dollarSign, Math.abs(balance)).length > 12 && 'small'}`}>
            {`${currencySymbolGenerator(dollarSign, Math.abs(balance)).replace('.00', '')}`}
          </div>
        </div>
      </>
    ) }
  </AccountCardWrapper>
);

export default AccountCard;
