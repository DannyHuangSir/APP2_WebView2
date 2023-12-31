import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import Barcode from 'react-barcode';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Theme from 'themes/theme';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator, stringToDate } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import Badge from 'components/Badge';
import Main from 'components/Layout';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import BankCodeInputField from 'pages/R00400_CCPayment/fields/BankCodeInputField';
import { CurrencyInputField, DropdownField, TextInputField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { Func } from 'utilities/FuncID';
import { getAccountsList } from 'utilities/CacheData';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import {
  getBankeeCardNo,
  payCardFee, queryCardInfo, queryPayBarcode,
} from './api';
import PageWrapper, { PopUpWrapper } from './R00400.style';
import { generateAmountOptions, generateAccountNoOptions } from './utils';
import { TabField } from './fields/TabField/tabField';
import { generateValidationSchema } from './validationSchema';
import {
  AMOUNT_OPTION, paymentMethodOptions, PAYMENT_OPTION, defaultValues, CStoreContent,
} from './constants';

/**
 * R00400 信用卡 付款頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();
  const [cardInfo, setCardInfo] = useState();
  const [bankeeCardNo, setBankeeCardNo] = useState();
  const [internalAccounts, setInternalAccounts] = useState([]);

  const {
    control, watch, handleSubmit, reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(generateValidationSchema(cardInfo)),
  });

  const watchedValues = watch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let cardNo = null;

    const funcParams = await loadFuncParams(); // Function 啟動參數
    if (funcParams) cardNo = funcParams.bankeeCardNo;
    else cardNo = await getBankeeCardNo();

    getAccountsList('M', setInternalAccounts); // 拿取本行母帳號列表
    const cardInfoResponse = await queryCardInfo(''); // 拿取應繳金額資訊

    setBankeeCardNo(cardNo);
    setCardInfo(cardInfoResponse);

    dispatch(setWaittingVisible(false));
  }, []);

  // 繳款金額選項改變時，清空自訂金額的值
  useEffect(() => {
    if (watchedValues.amountOptions) reset((formValues) => ({...formValues, customAmount: null}));
  }, [watchedValues.amountOptions]);

  const renderBalance = () => {
    if (!internalAccounts.length || !watchedValues.accountNo) return null;
    const {details} = internalAccounts.find((a) => a.accountNo === watchedValues.accountNo);
    const {currency, balance} = details[0];
    return `可用餘額 ${currencySymbolGenerator(currency, balance, true)}元`;
  };

  const renderBarCode = async (amount) => {
    const payBarCodeRes = await queryPayBarcode(amount);
    if (payBarCodeRes) {
      await showCustomPrompt({
        title: '超商條碼繳款',
        message: (
          <PopUpWrapper>
            <Badge className="badge" label="應繳金額" value={currencySymbolGenerator('NTD', amount)} />
            <p className="note">
              適用商家：
              <wbr />
              四大超商（7-ELEVEN、全家、
              <wbr />
              萊爾富和OK MART）
            </p>

            {Object.keys(payBarCodeRes).map((key) => (
              <Barcode
                key={payBarCodeRes[key]}
                value={payBarCodeRes[key]}
                width={1.5}
                height={48}
              />
            ))}

            <Accordion title="注意事項">
              <CStoreContent />
            </Accordion>
          </PopUpWrapper>
        ),
        noDismiss: true,
      });
    }
  };

  const getAmount = ({ amountOptions, customAmount }) => {
    switch (amountOptions) {
      case AMOUNT_OPTION.CUSTOM:
        return customAmount;
      case AMOUNT_OPTION.MIN:
        return cardInfo.minDueAmount;
      case AMOUNT_OPTION.ALL:
      default:
        return cardInfo.newBalance;
    }
  };

  const onSubmit = async (data) => {
    // ===== 本行帳戶繳費 =====
    if (data.paymentMethod === PAYMENT_OPTION.INTERNAL) {
      const payload = {
        amount: getAmount(data),
        account: data.accountNo,
        cardNo: bankeeCardNo,
      };
      const {result} = await transactionAuth(Func.R004.authCode);
      if (result) {
        dispatch(setWaittingVisible(true));
        const apiRs = await payCardFee(payload);
        dispatch(setWaittingVisible(false));
        if (apiRs.isSuccess) history.push('R004001', { ...apiRs.data });
      }
    }

    // ===== 他行帳戶繳費 =====
    if (data.paymentMethod === PAYMENT_OPTION.EXTERNAL) {
      dispatch(setWaittingVisible(true));
      showCustomPrompt({message: 'TODO 他行帳戶繳費API'});
      dispatch(setWaittingVisible(false));
    }

    // ===== 超商條碼繳費 =====
    if (data.paymentMethod === PAYMENT_OPTION.CSTORE) {
      renderBarCode(getAmount(data));
    }
  };

  return (
    <Layout fid={Func.R004} title="繳款" goBackFunc={closeFunc}>
      <Main small>
        <PageWrapper>
          {cardInfo && (
          <Badge
            label={`${stringToDate(cardInfo.billClosingDate).getMonth() + 1}月應繳金額`}
            value={currencySymbolGenerator('NTD', cardInfo.newBalance)}
          />
          )}

          <TabField
            name="paymentMethod"
            control={control}
            options={paymentMethodOptions}
          />

          <form className="flex" style={{ minHeight: 'initial' }} onSubmit={handleSubmit(onSubmit)}>

            <section>
              <RadioGroupField
                name="amountOptions"
                control={control}
                options={generateAmountOptions(cardInfo)}
              />

              <div className="ml-4">
                <CurrencyInputField
                  control={control}
                  name="customAmount"
                  inputProps={{inputMode: 'numeric', placeholder: '請輸入金額', disabled: watch('amountOptions') !== AMOUNT_OPTION.CUSTOM}}
                  currency="NTD"
                  $color={watchedValues.amountOptions !== AMOUNT_OPTION.CUSTOM ? Theme.colors.text.placeholder : Theme.colors.primary.brand}
                />
              </div>
            </section>

            { watchedValues.paymentMethod === PAYMENT_OPTION.INTERNAL && (
              <DropdownField
                name="accountNo"
                labelName="轉出帳號"
                control={control}
                options={generateAccountNoOptions(internalAccounts)}
                annotation={watchedValues.accountNo && renderBalance()}
              />
            )}

            { watchedValues.paymentMethod === PAYMENT_OPTION.EXTERNAL && (
              <>
                <BankCodeInputField
                  control={control}
                  name="bankId"
                />
                <TextInputField
                  name="extAccountNo"
                  labelName="轉出帳號"
                  control={control}
                  inputProps={{maxLength: 16, inputMode: 'numeric', placeholder: '請輸入轉出帳號'}}
                />
              </>
            )}

            { watchedValues.paymentMethod === PAYMENT_OPTION.CSTORE && (
              <Accordion title="注意事項">
                <CStoreContent />
              </Accordion>
            )}

            <FEIBButton type="submit" disabled={cardInfo?.newBalance <= 0}>
              {watchedValues.paymentMethod === PAYMENT_OPTION.EXTERNAL ? '同意並送出' : '確認送出'}
            </FEIBButton>
          </form>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
