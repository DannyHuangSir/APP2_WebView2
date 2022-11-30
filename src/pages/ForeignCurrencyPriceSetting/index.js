import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CurrencyInfo, dateToString, timeSecondFormatter } from 'utilities/Generator';
import { showDrawer, closeDrawer } from 'utilities/MessageModal';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
  FEIBRadio,
  FEIBRadioLabel,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import Layout from 'components/Layout/Layout';
// import { getAllNotices, addNotice, removeNotice } from './api';
import {
  getAllNotices,
  addNotice,
  removeNotice,
  updateNotice,
  getCcyList,
} from './api';

/* Styles */
import ForeignCurrencyPriceSettingWrapper from './foreignCurrencyPriceSetting.style';
import { validationSchema } from './validationSchema';

const ForeignCurrencyPriceSetting = () => {
  const {
    handleSubmit, control, formState: { errors }, watch, setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const currencyType = watch('currencyType');

  const [drawerTitle, setDrawerTitle] = useState('');
  const [currencyInfo, setCurrencyInfo] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [notificationList, setNotificationList] = useState([]);
  const [currentSetting, setCurrentSetting] = useState({});

  // 取得外幣列表
  const getCurrencyInfo = async () => {
    const response = await getCcyList({});
    console.log(response);
    if (!response?.code) {
      setCurrencyInfo(response);
      const now = Date.now();
      const dateStr = dateToString(now);
      const timeStr = timeSecondFormatter(now);
      setCurrentTime(`${dateStr} ${timeStr}`);
      setCurrentRate(response[0].sellRate);
    }
  };

  // 取得所有已設定外幣到價通知列表
  const getAllPriceNotifications = async () => {
    const response = await getAllNotices();
    setNotificationList(response);
  };

  // 刪除外幣到價通知
  const deletePriceSetting = async (data) => {
    console.log('刪除到價通知');
    console.log(data);
    const param = {
      currency: data.currency,
      price: data.price,
      exchange_type: data.exchange_type,
    };
    await removeNotice(param);
    getAllPriceNotifications();
    // TODO：call removeNotice(notice)
    // setModel(model);
  };

  const handleCloseDrawer = () => {
    closeDrawer();
  };

  const onSubmit = async (data) => {
    if (drawerTitle === 'add') {
      const param = {
        currency: data.currencyType,
        price: data.price.toFixed(4),
        exchange_type: Number(data.priceType),
      };
      await addNotice(param);
    }
    if (drawerTitle === 'update') {
      const param = {
        currency: data.currencyType,
        price: data.price.toFixed(4),
        exchange_type: Number(data.priceType),
      };
      console.log(param);
      await updateNotice(currentSetting, param);
    }
    getAllPriceNotifications();
    handleCloseDrawer();
  };

  const renderForm = () => (
    <ForeignCurrencyPriceSettingWrapper className="drawerContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>幣別</FEIBInputLabel>
        <Controller
          name="currencyType"
          defaultValue="USD"
          control={control}
          render={({ field }) => (
            <FEIBSelect
              {...field}
              id="currencyType"
              name="currencyType"
              error={!!errors.currencyType}
            >
              {
                currencyInfo
                  .map((item) => (
                    <FEIBOption key={item.ccyCd} value={item.ccyCd}>
                      { item.ccyName }
                      &nbsp;
                      { CurrencyInfo.find((el) => el.code === item.ccyCd).symbol }
                    </FEIBOption>
                  ))
              }
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage>{errors.currencyType?.message}</FEIBErrorMessage>
        <FEIBInputLabel>換匯種類</FEIBInputLabel>
        <Controller
          name="priceType"
          control={control}
          defaultValue="0"
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-label="換匯種類"
              id="priceType"
              name="priceType"
              className="groupContainer"
            >
              <FEIBRadioLabel value="0" control={<FEIBRadio />} label="現金匯率" />
              <FEIBRadioLabel value="1" control={<FEIBRadio />} label="即期匯率" />
            </RadioGroup>
          )}
        />
        <FEIBErrorMessage />
        <FEIBInputLabel>通知匯率</FEIBInputLabel>
        <Controller
          name="price"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              inputMode="numeric"
              id="price"
              name="price"
              placeholder="請輸入匯率"
              error={!!errors.price}
            />
          )}
        />
        <div className="updateTime">
          目前匯率：
          { currentRate }
          （更新時間：
          { currentTime }
          ）
        </div>
        <FEIBErrorMessage>{errors.price?.message}</FEIBErrorMessage>
        <FEIBButton type="submit">確認</FEIBButton>
      </form>
    </ForeignCurrencyPriceSettingWrapper>
  );

  // 新增外幣到價通知
  const addPriceSetting = () => {
    setDrawerTitle('add');
    setValue('currencyType', 'USD');
    setValue('priceType', '0');
    setValue('price', '');
    showDrawer(
      '新增外幣到價通知',
      renderForm(),
    );
  };

  // 編輯外幣到價通知
  const editPriceSetting = (data) => {
    setDrawerTitle('update');
    setCurrentSetting({
      currency: data.currency,
      price: data.price,
      exchange_type: data.exchange_type,
    });
    setValue('currencyType', data.currency);
    setValue('priceType', data.exchange_type.toString());
    setValue('price', data.price);
    const rate = currencyInfo.find((item) => item.ccyCd === data.currency).sellRate;
    setCurrentRate(rate);
    showDrawer(
      '編輯外幣到價通知',
      renderForm(),
    );
  };

  const renderNotiList = () => (
    notificationList.map((item) => {
      const currency = CurrencyInfo.find((el) => el.code === item.currency);
      return (
        <SettingItem
          key={item.createTime}
          mainLable={`${currency.name} ${currency.symbol}`}
          subLabel={`匯率：${item.price}`}
          editClick={() => editPriceSetting(item)}
          deleteClick={() => deletePriceSetting(item)}
        />
      );
    })
  );

  useEffect(() => {
    // TODO: 載入所有已設定的通知。
    // model = Call getAllNotices()
    // setModel(model);
    getAllPriceNotifications();
    getCurrencyInfo();
  }, []);

  useEffect(() => {
    const newRate = currencyInfo.find((item) => item.ccyCd === currencyType)?.sellRate;
    setCurrentRate(newRate);
  }, [currencyType]);

  return (
    <Layout title="外幣到價通知">
      <ForeignCurrencyPriceSettingWrapper>
        {
          notificationList.length < 5 && (
            <AddNewItem onClick={addPriceSetting} addLabel="新增（最多可設定五筆）" />
          )
        }
        { renderNotiList() }
      </ForeignCurrencyPriceSettingWrapper>
    </Layout>
  );
};

export default ForeignCurrencyPriceSetting;
