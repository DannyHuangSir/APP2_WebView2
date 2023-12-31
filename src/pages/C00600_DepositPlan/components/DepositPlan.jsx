import InfoArea from 'components/InfoArea';
import ProgressBar from 'components/ProgressBar';
import FEIBButton from 'components/elements/FEIBButton';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';
import {
  weekNumberToChinese, dateToString, stringToDate, switchZhNumber, toCurrency,
} from 'utilities/Generator';

import { showPrompt } from 'utilities/MessageModal';
import DepositPlanWrapper from './DepositPlan.style';
import { getStage } from './DepositPlan.utils';

/*
* ==================== DepositPlan 組件說明 ====================
* 存錢計畫下方資訊卡
* ==================== DepositPlan 可傳參數 ====================
* 1. currentBalance: number -> 目前金額，預設NTD。
* 2. goalAmount: number -> 目標金額，預設NTD。
* 3. endDate: string -> YYYYMMDD
* 4. progInfo -> 存錢計劃適用方案(Program)資訊
* 5. amount -> 每期存入金額，格式：99999。
* 6. cycleMode -> 存入週期（1.每周、2.每月）
* 7. cycleTiming -> 存入時機；每周：0～6(周日～周六)、每月：1~28及月底(31)
* 8. onShowDetailClick: function -> 點擊「存錢歷程」觸發。
* 9. onTerminatePlanClick: function -> 點擊「結束本計畫」觸發。
* */

const DepositPlan = ({
  currentBalance = 0,
  goalAmount = 1000000,
  endDate,
  progInfo,
  amount,
  cycleMode,
  cycleTiming,
  onShowDetailClick,
  onTerminatePlanClick,
}) => {
  const progressPercentage = Math.round((currentBalance / goalAmount) * 100);
  const isPlanCompleted = progressPercentage >= 100;
  const isPlanExpired = endDate && (stringToDate(endDate) < new Date());
  const isPlanFailed = progressPercentage < 100 && isPlanExpired;
  const shouldShowButton = isPlanExpired || isPlanCompleted;
  const stage = getStage(isPlanFailed, progressPercentage);

  const {
    type, extraRate, baseRate, rate,
  } = progInfo;
  const fancyCycleTimming = () => {
    if (cycleMode === 1) {
      return `周${weekNumberToChinese(cycleTiming === 0 ? 7 : cycleTiming)}`;
    }
    return `${cycleTiming}號`;
  };
  const bonusInfo = [
    {
      label: '適用利率',
      value: `${rate}%`,
      onClick: () => {
        const text = type ? `
        適用利率=${baseRate}%(基本利率)+${extraRate}%(專案加碼利率)，基本利率以官網公告為主，專案加碼利率將於存錢計畫達成指定條件後回饋`
          : `適用利率=${baseRate}%(基本利率)，基本利率以官網公告為主`;

        showPrompt(<p className="txtCenter">{text}</p>);
      },
    },
    { label: `每${cycleMode === 1 ? '周' : '月'}存款日`, value: fancyCycleTimming()},
    { label: '每次存款金額', value: switchZhNumber(amount)},
  ];

  return (
    <DepositPlanWrapper>
      <div className="pad flex">
        <img src={stage.animation} className="object-contain" alt="" width="124" height="120" />
        <InfoArea variant="top" position="top" space="auto" {...stage.infoAreaStyles}>
          {stage.text}
        </InfoArea>
        <ProgressBar value={progressPercentage} />
        <div>
          目前金額
          {' '}
          <em>{`＄${toCurrency(currentBalance)}`}</em>
          /
          {switchZhNumber(goalAmount)}
        </div>
        { endDate && (
        <div>
          {dateToString(endDate)}
          到期
        </div>
        )}

      </div>
      {shouldShowButton ? (
        <>
          <FEIBButton className="mt-3" onClick={onTerminatePlanClick}>結束本計畫</FEIBButton>

          {/* Use as indicator to overwrite goBackFunc (in Layout) or not. */}
          <div className="blockGoBack" />
        </>
      ) : (
        <>
          <hr />
          <div className="pad">
            <ThreeColumnInfoPanel content={bonusInfo} />
            <ArrowNextButton onClick={onShowDetailClick}>存錢歷程</ArrowNextButton>
          </div>
        </>
      )}
    </DepositPlanWrapper>
  );
};

export default DepositPlan;
