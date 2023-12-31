/* eslint-disable object-curly-newline */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountFormatter } from 'utilities/Generator';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
  FEIBSwitchLabel,
  FEIBSwitch,
} from 'components/elements';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import DealContent from './dealContent';

/* Styles */
import MobileTransferWrapper from './T00600.style';

const T006001 = ({ location }) => {
  const { custName, mobilesList, accountList } = location.state;

  const history = useHistory();

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    mobile: yup.string().required('請選擇手機號碼'),
    account: yup.string().required('請選擇收款帳號'),
  });
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [accountDefault, setAccountDefault] = useState(true);

  const switchAccountDefault = () => {
    setAccountDefault(!accountDefault);
  };

  // 新增收款設定
  const onSubmit = (formData) => {
    const data = {
      isDefault: accountDefault,
      ...formData,
    };
    history.push(
      '/T006002',
      {
        type: 'add',
        isModify: false,
        data,
      },
    );
  };

  const goBack = () => history.goBack();

  useEffect(() => {
    setValue('custName', custName);
    if (mobilesList && mobilesList.length) setValue('mobile', mobilesList[0]);
  }, []);

  return (
    <Layout title="手機號碼收款設定" goBackFunc={goBack}>
      <MobileTransferWrapper>
        <div className="summaryContainer lighterBlueLine">
          <p>
            手機號碼就是您的存款帳號
          </p>
          <p>
            完成設定後，親友即可透過手機號碼，轉帳到您設定的存款帳號，轉帳快速又方便！
          </p>
        </div>
        <div className="formContainer">
          <p>請輸入欲設定的手機號碼與帳號</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <FEIBInputLabel>姓名</FEIBInputLabel>
              <Controller
                name="custName"
                control={control}
                render={({ field }) => (
                  <FEIBInput
                    {...field}
                    type="text"
                    id="custName"
                    name="custName"
                    placeholder="請輸入姓名"
                    error={!!errors.custName}
                    disabled
                  />
                )}
              />
              <FEIBErrorMessage>{errors.custName?.message}</FEIBErrorMessage>
              <FEIBInputLabel>手機號碼</FEIBInputLabel>
              <Controller
                name="mobile"
                defaultValue=""
                control={control}
                placeholder="請選擇手機號碼"
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="mobile"
                    name="mobile"
                    placeholder="請選擇手機號碼"
                    error={!!errors.mobile}
                  >
                    {
                      mobilesList?.map((item) => (
                        <FEIBOption value={item} key={item}>{item}</FEIBOption>
                      ))
                    }
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.mobile?.message}</FEIBErrorMessage>
              <FEIBInputLabel>收款帳號</FEIBInputLabel>
              <Controller
                name="account"
                defaultValue=""
                control={control}
                placeholder="請選擇收款帳號"
                render={({ field }) => (
                  <FEIBSelect
                    {...field}
                    id="account"
                    name="account"
                    placeholder="請選擇收款帳號"
                    error={!!errors.account}
                  >
                    {
                      accountList?.map((item) => (
                        <FEIBOption value={item.accountNo} key={item.accountNo}>
                          {`${accountFormatter(item.accountNo, true)}  ${item.alias}`}
                        </FEIBOption>
                      ))
                    }
                  </FEIBSelect>
                )}
              />
              <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
              <FEIBSwitchLabel
                control={(
                  <FEIBSwitch
                    checked={accountDefault}
                    onChange={switchAccountDefault}
                  />
                )}
                label="設定為「預設收款帳戶」"
              />
              <div className="switchDescription">
                說明：您可以將手機號碼綁定一個帳戶做為「預設收款帳戶」，未來您的朋友只要輸入您的手機號碼，無須再選擇銀行代碼，即可立即轉帳給您！
              </div>
              <Accordion title="手機號碼收款服務使用條款" space="both">
                <DealContent />
              </Accordion>
            </div>
            <FEIBButton
              type="submit"
            >
              同意條款並繼續
            </FEIBButton>
          </form>
        </div>
      </MobileTransferWrapper>
    </Layout>
  );
};

export default T006001;
