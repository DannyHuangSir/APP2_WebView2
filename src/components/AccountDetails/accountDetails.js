/* eslint-disable no-use-before-define */
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import SearchCondition from 'components/AccountDetails/searchCondition';
import DebitCard from 'components/DebitCard/DebitCard';
import DetailCard from 'components/DetailCard';
import EmptyData from 'components/EmptyData';
import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';
import {
  FEIBIconButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import Loading from 'components/Loading';
import { setDrawerVisible } from 'stores/reducers/ModalReducer';
import { showDrawer } from 'utilities/MessageModal';
import { dateToString, stringToDate } from 'utilities/Generator';
import { CrossCircleIcon, DownloadIcon, SearchIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import { getDepositBook } from './api';
import AccountDetailsWrapper, { DownloadDrawerWrapper } from './accountDetails.style';

/**
 * 交易明細頁
 * mode=0 -> C00300, C00400, C00500
 * mode=1 -> C00600
 */
const AccountDetails = ({
  selectedAccount, onSearch, mode = 0, hideCopyIcon = false,
}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false); // 表示正在執行載入交易明細的 API
  const [monthes, setMonthes] = useState([]);
  const [currMonth, setCurrMonth] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [condition, setCondition] = useState(null); // 目前的查詢條件。
  const [inviewFlag, setInviewFlag] = useState();
  const txnDetailsRef = useRef();

  // 用來處理取得明細時, 同時更新上方card顯示的餘額
  const isCardBalanceUpdated = useRef(false);
  const [selectedAccountHook, setSelectedAccountHook] = useState(selectedAccount);

  // Note：要看懂這個程式的邏輯，一定要把 range 的用法弄懂！
  //       因為內容的變更會有即時性的需要，因此透過直接改 range 的值才能達成目的。
  const setEmptyRange = () => ({ min: Number.MAX_VALUE, max: -1 });
  const [range] = useState({
    inview: setEmptyRange(),
    loaded: setEmptyRange(),
    loading: setEmptyRange(),
  });

  /**
   * 建構式
   */
  useEffect(() => {
    resetView();
  }, []);

  /**
   * 重設明細清單及範圍。
   * @param {*} newCond 查詢條件。
   */
  const resetView = (cond) => {
    // setTransactions(null); // 清除畫面交易明細資料。
    setInviewFlag([]);
    range.inview = setEmptyRange();
    range.loaded = setEmptyRange();
    range.loading = setEmptyRange();
    setCondition({
      ...cond,
      accountNo: selectedAccount.accountNo,
      startIndex: null,
      direct: 0, // Note: 設為 0 才會清掉已載入的明細項目。
    });
  };

  /**
   * 載入明細資料，同時更新 loaded 及 loading 二個範圍值。
   * @param {*} cond 查詢條件。
   * @returns 由外部提供的 onSearch 方法所傳回的查詢結果。
   */
  const loadTransition = async (cond) => {
    setIsLoading(true);

    const dateRange = getDateRange(cond);
    if (!cond) return null; // 避免進入畫面打兩次 API
    const response = await onSearch({
      ...cond,
      startDate: dateToString(dateRange.startDate, ''),
      endDate: dateToString(dateRange.endDate, ''),
    });
    if (response) {
      const { acctTxDtls } = response;

      // 找出[已載入]資料的索引範圍。
      let loadedMax = range.loaded.max;
      let loadedMin = range.loaded.min;
      acctTxDtls.forEach((txn) => {
        loadedMax = Math.max(loadedMax, txn.index);
        loadedMin = Math.min(loadedMin, txn.index);
      });
      range.loaded.max = loadedMax;
      range.loaded.min = loadedMin;

      // 同步[載入中]資料的索引範圍；因為有新的資料載入了，若超過[載入中]的值，則以[已載入]的值為準。
      range.loading.max = Math.max(range.loading.max, loadedMax);
      range.loading.min = Math.min(range.loading.min, loadedMin);
    }

    setIsLoading(false);
    return response;
  };

  /**
   * 查詢條件變更時，重新查詢，並重建清單陣列。
   */
  useEffect(async () => {
    const response = await loadTransition(condition);
    if (response) {
      const { acctTxDtls, monthly, startIndex } = response;

      // 動態載入明細項目。
      // Note: 初始狀態 condition 會是 null，而且注意型別為「字串」
      const scrollDirection = Number.parseInt(condition?.direct ?? '0', 10);
      if (scrollDirection !== 0) {
        let newTransactions = [];
        if (scrollDirection === -1) {
          newTransactions = acctTxDtls.concat(transactions); // 新明細加到-前端
        } else if (scrollDirection === 1) {
          newTransactions = transactions.concat(acctTxDtls); // 新明細加到-後端
        }
        // 更新交易明細資料。
        setTransactions(newTransactions);
        return; // Note: 因為是在動態增加明細項目，所以不會變更目前可見區域，以及月份清單。
      }

      // 取得所有存款卡的初始資料後存取月份資料 (Tabs)
      const monthList = monthly.sort((a, b) => b - a);
      setCurrMonth(monthList[0]);
      setMonthes(monthList);

      // 更新交易明細資料。
      setTransactions(acctTxDtls);

      const containment = txnDetailsRef?.current; // 所有明細項目的外層 HTML 容器物件。即： <div className="transactionDetail"
      if (containment) {
        let currItem = containment.children[0]; // 預設跳至第一筆資料
        if (condition?.month) {
          // 畫面跳轉至該月份第一筆資料
          // Note: 因為 child 是 UI元素，所以要透過 getAttribute 才能拿到值，而且是字串型態。
          currItem = Array.from(containment.children).find((child) => child.getAttribute('data-index') === startIndex?.toString());
        }

        if (currItem) {
          currItem.scrollIntoView({ behavior: 'smooth' });
          setCurrMonth(currItem.id);
        }
      }
    }
  }, [condition]);

  /**
   * 彈出 進階查詢 功能。
   */
  const showSearchDrawer = () => {
    const closeDrawer = () => { dispatch(setDrawerVisible(false)); };
    const content = (
      <SearchCondition
        condition={condition}
        onSearch={(newCond) => {
          closeDrawer();
          resetView({
            ...newCond,
            month: null, // Note: 未清掉會列入查詢條件。
          });
        }}
        onCancel={closeDrawer}
      />
    );
    showDrawer('查詢條件', content);
  };

  /**
   * 彈出 查詢結果下載功能選單。
   */
  const showDownloadDrawer = () => {
    /**
     * 下載交易明細清單
     * @param {*} fileType 下載檔案類型, 1:PDF, 2:EXCEL(CSV)
     */
    const handleDownloadDetails = (fileType) => {
      // dispatch(setWaittingVisible(true)); // BUG : 打開、再關閉後，查詢條件會被清掉。
      dispatch(setDrawerVisible(false));
      const dateAdjustedCondition = {
        ...condition,
        endDate: dateToString(condition.endDate, ''),
        startDate: dateToString(condition.startDate, ''),
      };
      getDepositBook(fileType, dateAdjustedCondition);
      // dispatch(setWaittingVisible(false));
    };

    const content = (
      <DownloadDrawerWrapper>
        <li onClick={() => handleDownloadDetails(1)}>
          <p>下載 PDF</p>
          <DownloadIcon className="downloadIcon" />
        </li>
        <li onClick={() => handleDownloadDetails(2)}>
          <p>下載 EXCEL</p>
          <DownloadIcon className="downloadIcon" />
        </li>
      </DownloadDrawerWrapper>
    );
    showDrawer('', content);
  };

  /**
   * 顯示 存錢計畫 資訊卡
   * @param {*} DepositPlan 啟用查詢明細頁的帳號資料
   */
  const renderDepositPlanHero = (plan) => (
    <DepositPlanHeroSlide isSimple {...plan} />
  );

  /**
   * 顯示 啟用查詢明細頁的帳號 資訊卡
   * @param {*} account 啟用查詢明細頁的帳號資料
   */
  const renderCardArea = (account) => (
    <div className="debitCardWrapper">
      <DebitCard
        cardName={account.alias}
        account={account.accountNo}
        balance={account.balance}
        dollarSign={account.currency}
        color={account.cardColor}
        hideCopyIcon={hideCopyIcon}
      />
    </div>
  );

  const getDateRange = (cond) => {
    let startDate = null;
    let endDate = null;
    if (cond?.mode) {
      if (cond.mode === '0' && cond.startDate) {
        startDate = stringToDate(cond?.startDate); // 轉為 Date 型別。
        endDate = stringToDate(cond?.endDate);
      } else {
        /**
         * mode 0 且 沒有設定查詢日期區間: 顯示三年區間之年月日
         * mode 1~4: 顯示所選區間之年月日
         */
        endDate = new Date();
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - [36, 6, 12, 24, 36][cond.mode]);
      }
    }
    return { startDate, endDate };
  };

  /**
   * 顯示 查詢日期區間
   * @param {*} cond 目前的查詢條件。
   */
  const renderSearchBarText = (cond) => {
    // 尚未開始查詢，就不顯示
    if (!cond || cond.mode === undefined) return null;
    const dateRange = getDateRange(cond);

    return (
      <div className="searchCondition">
        <p>{`${dateToString(dateRange.startDate)} ~ ${dateToString(dateRange.endDate)}`}</p>
        <FEIBIconButton onClick={() => resetView()}>
          <CrossCircleIcon />
        </FEIBIconButton>
      </div>
    );
  };

  /**
   * 顯示 查詢結果的月份清單。
   * @param {*} items 查詢結果的月份資料。
   */
  const renderMonthTabs = (items) => {
    if (!items?.length) return null;

    // 點擊月份頁籤，以目前查詢條件再加上指定月份為新的查詢條件。
    const handleClickMonthTab = async (event) => {
      // 由點擊的月份頁籤 (Tab) 取得月份條件，固定月份時查詢資料方向為 0 (雙向)
      const month = event.currentTarget.getAttribute('data-month');
      const newCondition = {
        ...condition,
        month,
        // direct: '0', // 資料方向為0，表示取前後各50筆。
        // startIndex: null, // Note：不可指定 startIndex 否則將視為一般查詢。
      };
      resetView(newCondition);
    };

    return (
      <div className="tabsArea">
        <FEIBTabContext value={currMonth ?? items[0]}>
          <FEIBTabList onChange={(event, id) => setCurrMonth(id)} $size="small" className="tabList" $isSingleTab={items.length === 1}>
            { items.map((month) => (
              <FEIBTab
                key={month}
                label={`${month.substr(4, 2)}月`}
                value={month}
                data-month={month}
                onClick={handleClickMonthTab}
              />
            )) }
          </FEIBTabList>
        </FEIBTabContext>
      </div>
    );
  };

  /**
   * UI 明細項目被移入或移出畫面可見區域時，明細「項目」解發的事件處理。
   * @param {*} index 解發事件的明細項目的索引值，即 DetailCard.index 屬性。
   * @param {*} inVisible 移入為 true，移出為 false
   */
  const onDetailCardVisibilityChange = (index, inVisible) => {
    inviewFlag[index - range.loaded.min] = inVisible;

    // 找出目前視景內的明細項目索引範圍。
    let inviewMax = Number.MIN_VALUE;
    let inviewMin = Number.MAX_VALUE;
    let inviewFirst = null;
    inviewFlag.forEach((flag, i) => {
      if (flag === true) {
        if (inviewFirst === null) inviewFirst = i;
        inviewMax = Math.max(inviewMax, range.loaded.min + i);
        inviewMin = Math.min(inviewMin, range.loaded.min + i);
      }
    });

    // 資料方向(1:上方移出可見區域, -1.下方移出可見區域
    const scrollDirection = Math.sign((range.inview.min === Number.MAX_VALUE) ? 0 : (inviewMin - range.inview.min)); // 避掉 inview 初始值的誤判
    range.inview.max = inviewMax;
    range.inview.min = inviewMin;

    // 捲動畫面時，根據當前畫面上的第一筆明細動態切換月份標籤
    if (inviewFirst !== null) setCurrMonth(transactions[inviewFirst].txnDate.substr(0, 6));

    // Note: 非常重要！ 目的是為了避免在明細資料載入時，因為畫面自動重刷，而重覆載資料的情況。
    //       新加入的資料，會使 scrollDirection 出現非零的情況。
    if (isLoading) return;

    // 動態補充明細資料。
    // 若正在處理資料請求中，則不會再次發出請求
    let startIndex = null;
    if (scrollDirection === 1 && ((range.loaded.max + 25) > range.loading.max)) { // 上方-移出可見區域
      if ((range.inview.max + 25) > range.loaded.max) { // 25筆是保留的緩衝筆數。
        if ((range.loaded.max + 50) > range.loading.max) { // 50筆是正在載入的筆數；若已在載入中(即相差50筆)就不需要再抓資料。
          // 下方明細剩餘數量少於 25 張時，反向獲取接續 50 筆
          range.loading.max += 50;
          // console.log('*** Loading +50 ... ==> ', range.loading);
          startIndex = range.loaded.max + 1;
        }
      }
    } else if (scrollDirection === -1 && range.loading.min > 1) { // 下方-移出可見區域；若是從頭開始的，就不用再補了，因為不會有資料。
      if ((range.inview.min - 25) < range.loaded.min) { // 25筆是保留的緩衝筆數。
        if ((range.loaded.min - 50) < range.loading.min) { // 50筆是正在載入的筆數；若已在載入中(即相差50筆)就不需要再抓資料。
          // 上方明細剩餘數量少於 25 張時，反向獲取接續 50 筆
          range.loading.min = Math.max(range.loading.min - 50, 1);
          // console.log('*** Loading -50 ... ==> ', range.loading);
          startIndex = range.loaded.min - 1;
        }
      }
    }
    if (scrollDirection === 0 || startIndex == null) return; // 表示只有改變可見狀態，所以不影響。

    // 保留原本的查詢條件，改用 direct 通知補充明細資料的方向及位置。
    setCondition({
      ...condition,
      month: null, // Note：一定要清掉，因為切換月份只是一次性的行為，而且不可跟 startIndex 共存。
      direct: scrollDirection,
      startIndex,
    });
  };

  /**
   * 用查詢結果的明細清單的最新一筆資料, 來更新頁面上方的顯示餘額。
   * 使總金額與歷程一致更新
   * @param {*} details 查詢結果的明細資料。
   */
  const setCardShowBalance = (details) => {
    selectedAccount.balance = details[0].balance;
    selectedAccount.currentBalance = details[0].balance;

    setSelectedAccountHook(selectedAccount);

    isCardBalanceUpdated.current = true;
  };

  /**
   * 顯示 查詢結果的明細清單。
   * @param {*} items 查詢結果的明細資料。
   */
  const renderDetailCards = (items) => {
    if (isLoading && !items) return <Loading space="both" isCentered />;
    if (!items) return null;
    if (!items.length) return <EmptyData />;

    if (isCardBalanceUpdated.current === false) {
      setCardShowBalance(items);
    }

    return (
      <>
        {items.map((item) => (
          <VisibilitySensor
            key={item.index}
            onChange={(isVisible) => onDetailCardVisibilityChange(item.index, isVisible)}
            containment={txnDetailsRef.current}
            partialVisibility
          >
            {({ isVisible }) => (
              <DetailCard
                {...item}
                id={item.txnDate.substr(0, 6)}
                inView={isVisible ? 'Y' : 'N'}
                noShadow
              />
            )}
          </VisibilitySensor>
        ))}
        {isLoading && <Loading space="both" isCentered />}
      </>
    );
  };

  /**
   * 主頁面
   */
  return (
    <AccountDetailsWrapper>
      { (mode === 0) && renderCardArea(selectedAccountHook) }
      { (mode === 1) && renderDepositPlanHero(selectedAccountHook) }
      <div className="inquiryArea measuredHeight">

        <div className="searchBar">
          <FEIBIconButton onClick={showSearchDrawer}>
            <SearchIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
          { renderSearchBarText(condition) }
          <FEIBIconButton className="customPosition" onClick={showDownloadDrawer}>
            <DownloadIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
        </div>

        { renderMonthTabs(monthes) }

        {/* TODO transactionDetail 的 height: 500, maxHeight: 500 不應該是固定值 */}
        {/* #882 拿掉 height: 500, maxHeight: 500 進行測試  */}
        <div className="transactionDetail" ref={txnDetailsRef} style={{ overflowY: 'scroll' }}>
          { renderDetailCards(transactions) }
        </div>
      </div>
    </AccountDetailsWrapper>
  );
};

export default AccountDetails;
