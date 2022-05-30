import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-uuid';
import parse from 'html-react-parser';
import { RadioGroup } from '@material-ui/core';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Accordion from 'components/Accordion';
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Loading from 'components/Loading';

import CreatePageWrapper from './CreatePage.style';
import { getDepositPlanProgram, getDepositPlanTerms } from './api';

/**
 * C00600 存錢計畫 新增頁
 */
const DepositPlanCreatePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { control, handleSubmit } = useForm();
  const [programs, setPrograms] = useState();
  const [terms, setTerms] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    setPrograms(await getDepositPlanProgram());
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getDepositPlanTerms());
  };

  const onSubmit = (data) => {
    const program = programs.find((p) => p.code === +data.code);
    history.push('/C006003', { program });
  };

  return (
    <Layout title="新增存錢計畫">
      <Main>
        <CreatePageWrapper>
          <form className="flex" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend className="title">你的專屬存錢計畫</legend>
              <Controller
                name="code"
                control={control}
                defaultValue="0"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                  >
                    <ul className="list-group">
                      { programs && programs.map((p) => (
                        <li key={uuid()} className="list">
                          <FEIBRadioLabel control={<FEIBRadio />} label={p.name} value={`${p.code}`} />
                          <div className="rate">{`${p.rate}%`}</div>
                        </li>
                      )) }
                    </ul>
                  </RadioGroup>
                )}
              />
            </fieldset>

            <Accordion title="服務條款" className="terms" onClick={lazyLoadTerms}>
              { terms ? parse(terms) : <Loading space="both" isCentered /> }
            </Accordion>

            <FEIBButton type="submit">同意條款並繼續</FEIBButton>
          </form>
        </CreatePageWrapper>
      </Main>
    </Layout>
  );
};

export default DepositPlanCreatePage;