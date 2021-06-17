import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { closeFunc, goToFunc } from 'utilities/BankeePlus';

/* Elements */
import { FEIBCheckbox, FEIBCheckboxLabel } from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import InfoArea from 'components/InfoArea';
import BankeeLogo from 'assets/images/logo_02.png';

/* Styles */
import OpenWrapper from './open.style';

const Open = () => {
  const [agree, setAgree] = useState(false);
  const confirmClick = () => {
    goToFunc('regularPwdModify');
  };
  const cancleClick = () => {
    closeFunc('back');
  };
  useCheckLocation();
  usePageInfo('/api/open');

  return (
    <OpenWrapper>
      <div className="logoContainer">
        <img src={BankeeLogo} alt="" />
      </div>
      <FEIBCheckboxLabel
        control={(
          <FEIBCheckbox
            className="customPadding"
            onChange={() => setAgree(!agree)}
          />
        )}
        label="同意開通行動銀行服務"
      />
      <div className="btns-container">
        <ConfirmButtons
          mainButtonOnClick={confirmClick}
          subButtonOnClick={cancleClick}
          mainButtonDisabled={!agree}
        />
      </div>
      <InfoArea>
        <div style={{ textAlign: 'justify' }}>
          提醒您，若您的密碼在網路銀行及Bankee行動銀行達3次錯誤，將無法登錄，請您持身分證至本行各分行或以晶片金融卡至本行ATM、網路ATM辦理解鎖。
        </div>
      </InfoArea>
    </OpenWrapper>
  );
};

export default Open;