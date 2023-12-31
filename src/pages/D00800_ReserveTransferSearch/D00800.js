import {
  useEffect, useMemo, useState, useRef,
} from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';

import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBIconButton, FEIBTabContext, FEIBTabPanel } from 'components/elements';
import FailImage from 'assets/images/failIcon.png';
import SuccessImage from 'assets/images/successIcon.png';
import { currencySymbolGenerator, dateToString, dateToYMD } from 'utilities/Generator';
import { showCustomPrompt } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';

import { getAccountsList, getBankCode } from 'utilities/CacheData';
import SearchIcon from '@material-ui/icons/Search';

import DateRangePicker from 'components/DateRangePicker';
import uuid from 'react-uuid';
import { loadFuncParams } from 'hooks/useNavigation';
import { CrossCircleIcon } from 'assets/images/icons';
import { TabField } from './fields/tabField';
import DetailContent from './components/detailContent';
import ResultContent from './components/resultContent';
import { ReserveTransferSearchWrapper } from './D00800.style';
import {
  defaultValues, tabOptions, RESERVE_DATE_RANGE, TAB, RESULT_DATE_RANGE, panelOptions,
} from './constants';
import { getReservedTransDetails, getResultTransDetails } from './api';
import { generatePeriodText } from './utils';

/* Swiper modules */
SwiperCore.use([Pagination]);

const D00800 = () => {
  const history = useHistory();
  const [accountsList, setAccountsList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const swiperRef = useRef();
  const [searchList, setSearchList] = useState({ reserve: {}, result: {}});
  const [banks, setBanks] = useState();
  const {
    control, handleSubmit, watch, resetField, formState: {dirtyFields},
  } = useForm({ defaultValues });
  const [curTab, curReserveRange, curResultRange] = watch([TAB, RESERVE_DATE_RANGE, RESULT_DATE_RANGE]);
  const isSingleCard = accountsList.length === 1; // 單張卡時卡片寬度需與首頁卡片寬度相同

  const currentList = useMemo(() => {
    const startDay = dateToString(curTab === '1' ? curReserveRange[0] : curResultRange[0], '');
    const endDay = dateToString(curTab === '1' ? curReserveRange[1] : curResultRange[1], '');
    const searchObj = curTab === '1' ? searchList.reserve : searchList.result;
    const key = `${selectedAccount?.accountNo}_${startDay}_${endDay}`;
    return searchObj[key];
  }, [curTab, curReserveRange, curResultRange, searchList, selectedAccount]);

  const onSearch = async ({ tab, reserveDateRange, resultDateRange }) => {
    const startDay = dateToYMD(tab === '1' ? reserveDateRange[0] : resultDateRange[0]);
    const endDay = dateToYMD(tab === '1' ? reserveDateRange[1] : resultDateRange[1]);
    const { accountNo } = selectedAccount;
    const param = { accountNo, startDay, endDay };

    // ??? 不同帳號的 reservedTransDetails 與 getResultTransDetails 回傳的資料結構不一樣.... 後續需請後端更正
    const type = tab === '1' ? 'reserve' : 'result';
    const detailsRes = tab === '1' ? await getReservedTransDetails(param) : await getResultTransDetails(param);

    if (detailsRes) {
      const bankCodeList = await getBankCode(); // 若 redux 內沒有資料，會是非同步
      if (!banks) setBanks(bankCodeList);

      // detailsRes 加入 periodic & bankName properties
      const updatedDetailsRes = detailsRes.map((res) => {
        const { bankName } = bankCodeList.find(({ bankNo }) => bankNo === res.receiveBank);
        if (res.cycle) return {...res, periodic: res.cycle !== '1', bankName};
        return {...res, bankName};
      });

      setSearchList((prevSearchList) => ({
        ...prevSearchList,
        [type]: { ...prevSearchList[type], [`${accountNo}_${startDay}_${endDay}`]: updatedDetailsRes },
      }));
    }
  };

  const toConfirmPage = (data) => {
    history.push('/D008001', { reserveData: data, selectedAccount });
  };

  // 轉出帳號卡片 swiper，卡片顏色由acctType決定
  const renderCard = () => accountsList.map((item) => (
    <SwiperSlide key={item.accountNo}>
      <DebitCard accountObj={item} />
    </SwiperSlide>
  ));

  const openReserveDialog = async (data) => {
    showCustomPrompt({
      title: '預約轉帳',
      message: (
        <DetailContent
          reserveData={data}
          selectedAccount={selectedAccount}
        />
      ),
      onOk: () => toConfirmPage(data),
      okContent: '取消交易',
      onClose: () => {},
    });
  };
  // 打開結果彈窗
  const openResultDiaglog = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳結果',
      message: (
        <ResultContent resultData={data} selectedAccount={selectedAccount} />
      ),
    });
  };

  // 預約轉帳查詢列表
  const renderSearchList = (tabValue) => {
    if (!selectedAccount?.accountNo || !currentList || !banks) return <Loading space="both" isCentered />;
    if (!currentList.length) return <div className="emptyConatiner"><EmptyData /></div>;

    const isReserveTab = tabValue === '1';
    const onTapeClick = (item) => (isReserveTab ? () => openReserveDialog(item) : () => openResultDiaglog(item));
    const showImg = (result) => {
      if (isReserveTab) return undefined;
      return result === 'OK' ? SuccessImage : FailImage;
    };

    const generateTransDate = (data) => {
      if (!isReserveTab) return `交易日期 : ${dateToString(data.runDay)}`; // 「預約轉帳結果」的交易日
      if (data.periodic) return `預約轉帳日 : ${generatePeriodText(data)}`; // 「週期性預約交易」的預約轉帳日
      return `預約轉帳日 : ${dateToString(data.nextBookDate)}`; // 「單次預約交易」的預約轉帳日
    };
    return currentList.map((item) => (
      <InformationTape
        key={uuid()} // TODO 拿後端回傳的資訊替代
        topLeft={`${item.receiveBank}-${item.receiveAccountNo}`}
        topRight={currencySymbolGenerator('NTD', parseFloat(item.transferAmount))}
        bottomLeft={generateTransDate(item)}
        // eslint-disable-next-line no-nested-ternary
        bottomRight={isReserveTab ? (item.periodic ? '週期' : '單筆') : undefined}
        onClick={onTapeClick(item)}
        img={showImg(item.result)}
      />
    ));
  };

  const renderTabPanels = () => {
    const dateInputName = curTab === '1' ? RESERVE_DATE_RANGE : RESULT_DATE_RANGE;

    return panelOptions.map((panel) => (
      <FEIBTabPanel key={panel.tabValue} value={panel.tabValue}>
        <div className="searchDateRange">
          <SearchIcon className="searchIcon" />
          <div className="rangePickerContainer">
            <DateRangePicker // 本身也可以是 Field
              {...panel.datePickerLimit}
              control={control}
              name={panel.formName}
              label=" "
              value={watch(panel.formName)}
            />
          </div>
          {/* 若日期範圍是預設值，則不顯示清除按鈕 */}
          {!!dirtyFields[dateInputName] && (
            <FEIBIconButton onClick={() => resetField(dateInputName)}>
              <CrossCircleIcon />
            </FEIBIconButton>
          )}
        </div>
        {renderSearchList(panel.tabValue)}
      </FEIBTabPanel>
    ));
  };

  const handleChangeSlide = ({ activeIndex }) => setSelectedAccount(accountsList[activeIndex]);

  // 拿取帳號列表，若有從其他頁面帶資料過來，則預設帶過來的帳號
  useEffect(() => {
    getAccountsList('MSC', async (accts) => {
      accts.forEach((acct) => { acct.balance = acct.details[0].balance; });
      setAccountsList(accts);

      const params = await loadFuncParams();
      if (params) {
        const foundIndex = accts.findIndex(({accountNo}) => accountNo === params.accountNo);
        if (swiperRef) swiperRef.current.swiper.slideTo(foundIndex);
        setSelectedAccount(accts[foundIndex]);
      } else setSelectedAccount(accts[0]);
    });
  }, []);

  // 切換帳號/Tab/日期範圍時 會檢查 searchList 有無特定的 key，若沒有就執行搜尋
  useEffect(() => {
    if (!selectedAccount) return;
    if (!currentList) handleSubmit(onSearch)();
  }, [selectedAccount?.accountNo, curTab, curReserveRange, curResultRange]);

  return (
    <Layout fid={Func.D008} title="預約轉帳查詢/取消">
      <ReserveTransferSearchWrapper className="searchResult">
        <div className="cardArea">
          <Swiper
            ref={swiperRef}
            slidesPerView={isSingleCard ? 1.06 : 1.14}
            spaceBetween={8}
            centeredSlides
            pagination
            onSlideChange={handleChangeSlide}
          >
            {renderCard()}
          </Swiper>
        </div>
        <div className="searchResultContainer">
          <FEIBTabContext value={curTab}>
            <TabField control={control} name="tab" options={tabOptions} />
            {renderTabPanels()}
          </FEIBTabContext>
        </div>
      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default D00800;
