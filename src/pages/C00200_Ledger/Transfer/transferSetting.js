/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { toCurrency } from 'utilities/Generator';
import { TextInputField, DropdownField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import { FEIBButton } from 'components/elements';

import {TransferPageWrapper} from './transfer.style';
import C002TransferAccordionContent from './accordionContent';
import { transferSettingInitialData } from './mockData';
import { getBonusInfo } from './api';
import { txUsageOptions } from '../utils/usgeType';

/**
 * C002 社群帳本 - 轉帳
 */
const TransferSetting = () => {
  const { state } = useLocation();
  const history = useHistory();
  const [transData, setTransData] = useState();
  const [bonusInfo, setBonusInfo] = useState();

  /**
   * 資料驗證
   */
  const schema = yup.object().shape({
    transOutAcct: yup.string().required('請輸入轉出帳號'),
    amount: yup.string().required('請輸入金額'),
    target: yup.string().required('請輸入轉出對象'),
    transInBank: yup.string().required('請輸入轉入銀行代碼'),
    transInAcct: yup.string().required('請輸入轉入帳號'),
    type: yup.string().required('請選擇性質'),
    memo: yup.string(), // TODO 字數上限
  });
  const {
    control, handleSubmit, reset, setValue, getValues, trigger,
  } = useForm({
    defaultValues: {
      transOutAcct: '',
      amount: '0',
      target: '',
      transInBank: '',
      transInAcct: '',
      type: '1',
      memo: '',
    },
    resolver: yupResolver(schema),
  });

  const warningText = (text) => (
    <div className="warning_text">
      ※
      {text}
    </div>
  );

  const handleFormatAmount = () => {
    console.log('handleFormatAmount');
    const amount = getValues('amount');
    const formattedAmount = `NTD${toCurrency(amount)}`;

    setValue('amount', formattedAmount);
  };

  const onSubmit = (data) => {
    console.log('Transfer onSubmit', {data});
    const dataToConfirm = {
      ...data,
      amount: parseInt(data.amount.replace(/[^0-9]/g, ''), 10),
      remainAmount: bonusInfo.remainAmount,
    };
    history.push('/transferConfirm', dataToConfirm);
  };

  /**
   * owner, member透過要錢卡進轉帳：帶入 '轉出帳號、金額、對象、銀行代號、轉入帳號、性質、備註'
   * owner 點擊'給錢'進轉帳：帶入 '轉出帳號'
   * 有帶入參數者皆不可修改
   */
  useEffect(() => {
    // 從 ledgerDetail 進入 (給錢): 帶整個state，欄位預設皆為空
    // 從要錢卡、owner請款管理、partner付款管理、進入: 帶要錢資訊，欄位預設皆非空
    const initialData = transferSettingInitialData; // TODO: 從前一頁面帶入
    // const initialData = state; // 從前一頁面帶入
    setTransData(initialData);

    reset(() => ({
      transOutAcct: initialData.transOut,
      amount: initialData.amount === 0 ? '' : `NTD${toCurrency(initialData.amount)}`,
      target: initialData.target,
      transInBank: initialData.transIn.bank,
      transInAcct: initialData.transIn.account,
      type: initialData.usageType,
      memo: initialData.memo,
    }));
  }, []);

  // 取得可用餘額＆跨轉優惠
  useEffect(() => {
    const result = getBonusInfo();
    setBonusInfo(result);
  }, []);

  const goBack = () => history.goBack();

  return (
    <Layout title="轉帳" goBackFunc={goBack}>
      <TransferPageWrapper>
        {transData && (
        <form className="transfer_form" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <TextInputField labelName="轉出帳號" type="text" control={control} name="transOutAcct" inputProps={{placeholder: '轉出帳號', inputMode: 'numeric', disabled: transData.transOut !== ''}} />
          <div className="transout_info_wrapper">
            <div>
              可用餘額 NTD
              {bonusInfo.remainAmount}
            </div>
            <div>
              跨轉優惠
              {bonusInfo.freeTransOutTimes}
              次
            </div>
          </div>
          {warningText('轉出帳號不能跟轉入帳號一樣呦～')}
          <div onBlur={handleFormatAmount}>
            <TextInputField labelName="金額" type="text" control={control} name="amount" inputProps={{placeholder: '金額', inputMode: 'numeric', disabled: transData.amount !== 0}} />
          </div>
          <TextInputField labelName="對象" type="text" control={control} name="target" inputProps={{placeholder: '對象', disabled: transData.target !== ''}} />
          <BankCodeInput control={control} name="transInBank" value={getValues('transInBank')} setValue={setValue} trigger={trigger} readonly={transData.transInBank !== ''} />
          {/* TODO getValues('transInBank') 取到 default value */}
          {console.log('TransferSetting', {getBankCode: getValues('transInBank')})}
          <TextInputField labelName="轉入帳號" type="text" control={control} name="transInAcct" inputProps={{placeholder: '轉入帳號', inputMode: 'numeric', disabled: transData.transInAccount !== ''}} />
          <DropdownField labelName="性質" options={txUsageOptions} name="type" control={control} inputProps={{disabled: transData.usageType !== ''}} />
          <TextInputField labelName="備註" type="text" control={control} name="memo" inputProps={{placeholder: '備註', disabled: transData.memo !== ''}} />
          {warningText('轉帳前請多思考，避免被騙更苦惱')}

          <Accordion space="both">
            <C002TransferAccordionContent />
          </Accordion>

          <FEIBButton type="submit">確認</FEIBButton>
        </form>
        )}

      </TransferPageWrapper>
    </Layout>
  );
};

export default TransferSetting;
