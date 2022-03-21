import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Header from 'components/Header';
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Accordion from 'components/Accordion';
import InstallmentTerms from './installmentTerms';
import AccordionContent from './accordionContent';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment2 = () => {
  const stagingPercentage = '6%';

  useCheckLocation();
  usePageInfo('/api/instalment');

  const renderSelectList = () => {
    const list = ['3期', '6期', '9期', '12期'];
    return (
      <div className="selectList">
        <div>
          選擇消費分期期數
        </div>
        { list.map((item, index) => (
          <p>
            <FEIBRadioLabel value={index} control={<FEIBRadio />} label={item} />
          </p>
        )) }
      </div>
    );
  };

  return (
    <>
      <Header title="消費分期 (總額)" />
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="messageBox2">
              <p style={{ width: '100%', textAlign: 'center' }}>
                分期利率
              </p>
              <h2 className="titleText">{ stagingPercentage }</h2>
            </div>
            {renderSelectList()}
            <Accordion title="消費分期約定條款" space="both">
              <InstallmentTerms />
            </Accordion>
            <Accordion space="both">
              <AccordionContent />
            </Accordion>
          </div>
          <FEIBButton onClick={() => {}}>
            同意條款並繼續
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </>
  );
};

export default Instalment2;
