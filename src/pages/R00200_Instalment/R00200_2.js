import { useHistory, useLocation } from 'react-router';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from 'hooks/useNavigation';

/* Elements */
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Styles */
import { interestRateMap, R00200AccordionContent1, R00200AccordionContent2 } from './utils';
import InstalmentWrapper from './R00200.style';
import { setInstallmentFlag } from './api';

/**
 * R002002 晚點付 (單筆/總額_選擇期數&約定同意書)
 */

const R00200_2 = () => {
  // 目前利率是 hardcode

  const history = useHistory();
  const {state} = useLocation();
  const dispatch = useDispatch();
  const {goHome} = useNavigation();

  const schema = yup.object().shape({
    totTerm: yup.string().required('請選擇欲申請之晚點付期數'),
  });

  const { handleSubmit, control, watch } = useForm({
    defaultValues: { totTerm: '1' },
    resolver: yupResolver(schema),
  });

  const options = [
    {label: '1期', value: '1'},
    {label: '3期', value: '3'},
    {label: '6期', value: '6'},
    {label: '9期', value: '9'},
    {label: '12期', value: '12'},
  ];

  const onSubmit = async ({totTerm}) => {
    const { applType, selectedTxns } = state;
    const param = selectedTxns.map(({ purchDate, purchAmount, authCode }) => ({
      purchDate,
      purchAmount,
      authCode,
      applType,
      totTerm,
    }));

    dispatch(setWaittingVisible(true));
    if (!state.newInstRestraintFlag) await setInstallmentFlag({instRestraintFlagNew: true});
    dispatch(setWaittingVisible(false));

    // eslint-disable-next-line no-return-assign
    const installmentAmount = selectedTxns.reduce((acc, cur) => acc += cur.purchAmount, 0);

    history.push('R002003', {
      applType, installmentAmount, totTerm, param,
    });
  };

  const totTerm = watch('totTerm');

  if (!state) return goHome();
  return (
    // TODO  goBackFunc 改成回傳 cache
    <Layout title={`晚點付 (${state.applType === 'H' ? '總額' : '單筆'})`} goBackFunc={history.goBack}>
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="messageBox2">
              <p>分期利率</p>
              <h2 className="titleText">
                {`${totTerm ? `${interestRateMap[totTerm].annualRate}%` : ''}`}
              </h2>
            </div>
            <RadioGroupField
              labelName="選擇晚點付期數"
              control={control}
              options={options}
              name="totTerm"
            />
            <Accordion title="晚點付約定條款" space="both">
              <R00200AccordionContent1 />
            </Accordion>
            <Accordion space="both">
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton type="submit">同意條款並繼續</FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_2;
