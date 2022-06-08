import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { RadioGroup } from '@material-ui/core';
import parse from 'html-react-parser';
import uuid from 'react-uuid';

import {
  accountFormatter,
  currencySymbolGenerator,
} from 'utilities/Generator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Theme from 'themes/theme';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import BankCodeInput from 'components/BankCodeInput';
import {
  FEIBRadioLabel,
  FEIBRadio,
  FEIBButton,
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
  FEIBSelect,
  FEIBOption,
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';

import {
  getBills,
  getCreditCardTerms,
} from './api';
import PageWrapper from './R00400.style';

const PAYMENT_OPTION = {
  INTERNAL: 'self',
  EXTERNAL: 'external',
  CSTORE: 'shop',
};

const AMOUNT_OPTION = {
  CUSTOM: 'custom',
  MIN: 'min',
  ALL: 'all',
};

/**
 * R00400 信用卡 付款頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const {
    control, watch, handleSubmit, formState: { errors }, trigger, setValue,
  } = useForm();

  const [paymentOption, setPaymentOption] = useState(PAYMENT_OPTION.INTERNAL);
  const [bills, setBills] = useState();
  const [terms, setTerms] = useState();

  const uid = Array.from({ length: 4}, () => uuid());

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBills(true);
    setBills(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleOnTabChange = (_, id) => {
    setPaymentOption(id);
  };

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  const renderBalance = () => {
    if (!bills || !watch('account')) return undefined;
    return currencySymbolGenerator(bills.currency ?? 'NTD', bills.accounts.find((a) => a.accountNo === watch('account'))?.balance);
  };

  const validateCustomAmount = (v) => {
    if (watch('amountOption') === AMOUNT_OPTION.CUSTOM) {
      return !Number.isNaN(v) && (v >= bills.minAmount) && (v <= bills.amount);
    }
    return true;
  };

  const getAmount = (data) => {
    const {
      amountOption, customAmount,
    } = data;
    switch (amountOption) {
      case AMOUNT_OPTION.CUSTOM:
        return +customAmount;
      case AMOUNT_OPTION.MIN:
        return bills.minAmount;
      case AMOUNT_OPTION.ALL:
      default:
        return bills.amount;
    }
  };

  const onSubmit = (data) => {
    let payload;

    switch (paymentOption) {
      case PAYMENT_OPTION.CSTORE:
        payload = {
          amount: getAmount(data),
        };
        break;
      case PAYMENT_OPTION.EXTERNAL:
        payload = {
          amount: getAmount(data),
          acctBranch: data.bankCode.bankNo,
          acctId: data.extAccountNo,
        };
        break;
      case PAYMENT_OPTION.INTERNAL:
      default:
        payload = {
          amount: getAmount(data),
          acctBranch: data.accountNo.slice(0, 3),
          acctId: data.accountNo,
        };
    }

    if (paymentOption === PAYMENT_OPTION.CSTORE) {
      // TODO
      console.debug('onSubmit callAPI getPaymentCodes', payload);
      return;
    }

    // TODO
    console.debug('onSubmit callAPI makePayment', payload);
  };

  return (
    <Layout title="繳款" hasClearHeader>
      <Main small>
        <PageWrapper>
          <Badge label={`${bills?.month}月應繳金額`} value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)} />

          <div className="badMargin">
            <FEIBTabContext value={paymentOption}>
              <FEIBTabList onChange={handleOnTabChange}>
                <FEIBTab label="本行帳戶" value={PAYMENT_OPTION.INTERNAL} />
                <FEIBTab label="他行帳戶" value={PAYMENT_OPTION.EXTERNAL} />
                <FEIBTab label="超商條碼" value={PAYMENT_OPTION.CSTORE} />
              </FEIBTabList>
            </FEIBTabContext>
          </div>

          <form className="flex" style={{ minHeight: 'initial' }} onSubmit={handleSubmit(onSubmit)}>

            <fieldset>
              <legend className="sr-only">請選擇繳款金額</legend>
              <Controller
                name="amountOption"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FEIBRadioLabel control={<FEIBRadio />} label={`本期應繳金額 ${currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)}`} value={AMOUNT_OPTION.ALL} />
                    <FEIBRadioLabel control={<FEIBRadio />} label={`最低應繳金額 ${currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.minAmount)}`} value={AMOUNT_OPTION.MIN} />
                    <FEIBRadioLabel control={<FEIBRadio />} label="自訂金額" value={AMOUNT_OPTION.CUSTOM} />
                  </RadioGroup>
                )}
              />
            </fieldset>

            <div className="ml-4">
              <FEIBInputLabel className="sr-only" htmlFor={uid[0]}>自訂金額</FEIBInputLabel>
              <Controller
                name="customAmount"
                control={control}
                defaultValue=""
                rules={{ validate: validateCustomAmount }}
                render={({ field }) => (
                  <FEIBInput
                    id={uid[0]}
                    type="number"
                    placeholder="請輸入金額"
                    error={!!(errors?.customAmount)}
                    $color={watch('amountOption') !== AMOUNT_OPTION.CUSTOM ? Theme.colors.text.placeholder : Theme.colors.primary.brand}
                    disabled={watch('amountOption') !== AMOUNT_OPTION.CUSTOM}
                    {...field}
                  />
                )}
              />
              <FEIBErrorMessage>
                { errors?.amountOption && '請選擇繳款金額' }
                { errors?.customAmount && '繳款金額需介於最低應繳金額和本期應繳金額之間' }
              </FEIBErrorMessage>
            </div>

            { paymentOption === PAYMENT_OPTION.INTERNAL && (
              <>
                <FEIBInputLabel htmlFor={uid[1]}>轉出帳號</FEIBInputLabel>
                <Controller
                  name="accountNo"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FEIBSelect id={uid[1]} error={!!(errors?.accountNo)} {...field}>
                      { bills?.accounts.map((v) => (
                        <FEIBOption key={uuid()} value={v.accountNo}>{accountFormatter(v.accountNo)}</FEIBOption>
                      ))}
                    </FEIBSelect>
                  )}
                />
                <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                  { renderBalance() && `可用餘額 ${renderBalance()}` }
                </FEIBErrorMessage>
              </>
            )}

            { paymentOption === PAYMENT_OPTION.EXTERNAL && (
              <>

                <BankCodeInput
                  id="bankCode"
                  setValue={setValue}
                  trigger={trigger}
                  control={control}
                  rules={{ required: true }}
                  errorMessage={errors?.bankCode && '請選擇銀行代碼'}
                />

                <FEIBInputLabel htmlFor={uid[3]}>轉出帳號</FEIBInputLabel>
                <Controller
                  name="extAccountNo"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, pattern: /\d{12,16}/ }}
                  render={({ field }) => (
                    <FEIBInput
                      id={uid[3]}
                      type="text"
                      placeholder="請輸入"
                      error={!!(errors?.extAccountNo)}
                      {...field}
                    />
                  )}
                />
                <FEIBErrorMessage />

                <Accordion title="注意事項" className="terms" onClick={lazyLoadTerms}>
                  { terms ? parse(terms) : <Loading space="both" isCentered /> }
                </Accordion>
              </>
            )}

            <FEIBButton
              className="mt-4"
              type="submit"
              disabled={bills?.amount <= 0}
            >
              {paymentOption === PAYMENT_OPTION.EXTERNAL ? '同意並送出' : '確認送出'}
            </FEIBButton>
          </form>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
