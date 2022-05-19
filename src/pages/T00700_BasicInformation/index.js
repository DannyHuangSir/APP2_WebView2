import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetEnCrydata } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { basicInformationApi, settingApi } from 'apis';
import { closeFunc, switchLoading } from 'utilities/BankeePlus';

/* Elements */
import Header from 'components/Header';
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';

/* Styles */
import BasicInformationWrapper from './basicInformation.style';

const BasicInformation = () => {
  const dispatch = useDispatch();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    mobile: yup
      .string()
      .required('請輸入行動電話')
      .matches(/^09[0-9]{8}$/, '行動電話格式不符'),
    email: yup
      .string()
      .required('請輸入電子信箱')
      .email('電子信箱格式不符'),
    county: yup
      .string()
      .required('請選擇縣市'),
    city: yup
      .string()
      .required('請選擇鄉鎮市區'),
    addr: yup
      .string()
      .required('請輸入通訊地址'),
  });
  const {
    handleSubmit, control, formState: { errors }, reset, getValues, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [addressOptionsData, setAddressOptionsData] = useState([]);
  const [countyOptions, setCountyOptions] = useState([
    {
      countyName: '',
      countyCode: '',
    },
  ]);
  const [cityOptions, setCityOptions] = useState([
    {
      cityName: '',
      cityCode: '',
    },
  ]);

  // 取得個人資料
  const getPersonalData = async (countyListResponse) => {
    const basicInformationResponse = await basicInformationApi.getBasicInformation({});
    if (!basicInformationResponse.code) {
      const data = {
        ...basicInformationResponse,
      };
      reset(data);
      const { county } = data;
      const countyData = county.split(' ')[1] || county;
      const { cities } = countyListResponse.find((item) => item.countyName === countyData);
      setCityOptions(cities);
    } else {
      const { code, message } = basicInformationResponse;
      console.log(code, message);
    }
    switchLoading(false);
  };

  // 取得縣市列表
  const getCountyList = async () => {
    switchLoading(true);
    const countyListResponse = await settingApi.getCountyList({});
    setAddressOptionsData(countyListResponse);
    if (!countyListResponse.code) {
      const countyList = countyListResponse.map((item) => (
        {
          countyName: item.countyName,
          countyCode: item.countyCode,
        }
      ));
      setCountyOptions(countyList);
      getPersonalData(countyListResponse);
    } else {
      const { code, message } = countyListResponse;
      console.log(code, message);
      switchLoading(false);
    }
  };

  // 設定結果彈窗
  const setResultDialog = (response) => {
    // addr
    // city
    // county
    // email
    // mobile
    // zipCode
    const result = 'addr' in response
      && 'city' in response
      && 'county' in response
      && 'email' in response
      && 'mobile' in response
      && 'zipCode' in response;
    let errorCode = '';
    let errorDesc = '';
    if (result) {
      dispatch(setCloseCallBack(() => closeFunc()));
    } else {
      errorCode = response.code;
      errorDesc = response.message;
      dispatch(setCloseCallBack(() => {}));
    }
    dispatch(setResultContent({
      isSuccess: result,
      successTitle: '設定成功',
      successDesc: '基本資料變更成功',
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
    }));
    dispatch(setIsOpen(true));
  };

  // 更新個人資料
  const modifyPersonalData = async () => {
    switchLoading(true);
    const {
      county, city, zipCode, addr, email, mobile,
    } = getValues();
    const param = {
      county,
      city,
      zipCode,
      addr,
      email,
      mobile,
    };
    const modifyDataResponse = await basicInformationApi.modifyBasicInformation(param);
    setResultDialog(modifyDataResponse);
    switchLoading(false);
  };

  // 點擊儲存變更按鈕
  const onSubmit = () => {
    modifyPersonalData();
  };

  // 彈性變更鄉鎮市區選單
  const filterCityOptions = (county) => {
    const { cities } = addressOptionsData.find((item) => item.countyName === county);
    setCityOptions(cities);
  };

  // 縣市選單變更
  const handleCountyChange = (e) => {
    setValue('county', e.target.value);
    filterCityOptions(e.target.value);
  };

  // 鄉鎮市區選單變更
  const handleCityChange = (e) => {
    setValue('city', e.target.value);
    const { cityCode } = cityOptions.find((item) => item.cityName === e.target.value);
    setValue('zipCode', cityCode);
  };

  // 建立縣市選單
  const renderCountyOptions = () => countyOptions.map((item) => (<FEIBOption value={item.countyName} key={item.countyCode}>{item.countyName}</FEIBOption>));

  // 建立鄉鎮市區選單
  const renderCityOptions = () => cityOptions.map((item) => (<FEIBOption value={item.cityName} key={item.cityCode}>{item.cityName}</FEIBOption>));

  useGetEnCrydata();

  useEffect(() => {
    dispatch(setIsOpen(false));
    getCountyList();
  }, []);

  return (
    <>
      <Header title="基本資料變更" />
      <BasicInformationWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FEIBInputLabel>行動電話</FEIBInputLabel>
            <Controller
              name="mobile"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  type="text"
                  inputMode="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="請輸入行動電話"
                  error={!!errors.mobile}
                />
              )}
            />
            <FEIBErrorMessage>{errors.mobile?.message}</FEIBErrorMessage>
            <FEIBInputLabel>電子信箱</FEIBInputLabel>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  type="text"
                  inputMode="email"
                  id="email"
                  name="email"
                  placeholder="請輸入電子信箱"
                  error={!!errors.email}
                />
              )}
            />
            <FEIBErrorMessage>{errors.email?.message}</FEIBErrorMessage>
            <FEIBInputLabel>通訊地址</FEIBInputLabel>
            <div className="selectContainer">
              <div>
                <Controller
                  name="county"
                  defaultValue=""
                  control={control}
                  placeholder="請選擇縣市"
                  render={({ field }) => (
                    <FEIBSelect
                      {...field}
                      id="county"
                      name="county"
                      placeholder="請選擇縣市"
                      error={!!errors.county}
                      onChange={handleCountyChange}
                    >
                      <FEIBOption value="" disabled>請選擇縣市</FEIBOption>
                      { renderCountyOptions() }
                    </FEIBSelect>
                  )}
                />
                <FEIBErrorMessage>{errors.county?.message}</FEIBErrorMessage>
              </div>
              <div>
                <Controller
                  name="city"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <FEIBSelect
                      {...field}
                      id="city"
                      name="city"
                      error={!!errors.city}
                      onChange={handleCityChange}
                    >
                      <FEIBOption value="" disabled>請選擇鄉鎮市區</FEIBOption>
                      { renderCityOptions() }
                    </FEIBSelect>
                  )}
                />
                <FEIBErrorMessage>{errors.city?.message}</FEIBErrorMessage>
              </div>
            </div>
            <Controller
              name="addr"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  type="text"
                  inputMode="addr"
                  id="addr"
                  name="addr"
                  placeholder="請輸入通訊地址"
                  error={!!errors.addr}
                />
              )}
            />
            <FEIBErrorMessage>{errors.addr?.message}</FEIBErrorMessage>
            {/* <PasswordInput
              label="網銀密碼"
              id="password"
              name="password"
              control={control}
              errorMessage={errors.password?.message}
            /> */}
          </div>
          <FEIBButton
            type="submit"
          >
            儲存變更
          </FEIBButton>
        </form>
      </BasicInformationWrapper>
    </>
  );
};

export default BasicInformation;