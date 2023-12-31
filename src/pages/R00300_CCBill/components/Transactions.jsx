import { useState, useEffect } from 'react';
import uuid from 'react-uuid';

import { ArrowNextIcon } from 'assets/images/icons';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import Loading from 'components/Loading';
import InformationTape from 'components/InformationTape';
import EmptyData from 'components/EmptyData';
import { currencySymbolGenerator } from 'utilities/Generator';
import { getThisMonth, getMonthList } from 'utilities/MonthGenerator';

import { getTransactionDetails } from '../utils';
import TransactionsWrapper from './Transactions.style';

const backlogMap = new Map();

const Transactions = ({
  bills, isExpanded, onExpandClick, handleChangeMonth,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayList, setDisplayList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getThisMonth());

  useEffect(async () => {
    let log = backlogMap.get(selectedMonth);
    if (!log) {
      setIsLoading(true);
      const response = await getTransactionDetails(selectedMonth);

      backlogMap.set(selectedMonth, response);
      log = response;
    }

    const list = [];
    for (let i = 0; i < ((!isExpanded && log.length > 3) ? 3 : log.length); i++) {
      list.push((
        <InformationTape
          key={uuid()}
          topLeft={log[i].description}
          topRight={currencySymbolGenerator(log[i].currency ?? 'NTD', log[i].amount)}
          bottomLeft={(log[i].targetAcct) ? (`${log[i].txnDate} | 卡-${log[i].targetAcct.slice(-4)}`) : `${log[i].txnDate}`}
        />
      ));
    }
    setDisplayList(list);

    setIsLoading(false);
  }, [selectedMonth, isExpanded]);

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
    handleChangeMonth(id); //
  };

  return (
    <TransactionsWrapper>
      { bills ? (
        <>
          <FEIBTabContext value={selectedMonth}>
            <FEIBTabList $size="small" $type="fixed" onChange={handleOnTabChange}>
              { getMonthList().map((m) => <FEIBTab key={uuid()} label={`${m.slice(4, 6)}月`} value={m} />)}
            </FEIBTabList>
          </FEIBTabContext>
          { displayList?.length > 0 ? (
            <>
              { isLoading ? <Loading space="both" isCentered /> : displayList }
              { !isExpanded && (
              <div className="toolbar">
                <button type="button" className="btn-icon" onClick={() => onExpandClick()}>
                  更多明細
                  <ArrowNextIcon />
                </button>
              </div>
              )}
            </>
          ) : (
            <EmptyData height="30vh" />
          )}
        </>
      ) : <Loading space="both" isCentered /> }
    </TransactionsWrapper>
  );
};

export default Transactions;
