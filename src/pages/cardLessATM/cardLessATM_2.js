import { useHistory } from 'react-router';

/* Elements */
// import theme from 'themes/theme';
import {
  FEIBButton,
} from 'components/elements';

/* Styles */
import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM2 = () => {
  const history = useHistory();

  const withdrawalConfirm = () => {
    history.push('/cardLessATM/cardLessATM3');
  };

  return (
    <CardLessATMWrapper>
      <div className="account-info">
        <h1>
          活儲帳戶 04304099001568
        </h1>
        <h1>
          提款金額 NT $ 10,000
        </h1>
      </div>
      <div className="tip">
        免費跨提次數
        <span> 6 </span>
        次 / 免費跨轉次數
        <span> 6 </span>
        次
      </div>
      <div className="tip">注意事項</div>
      <FEIBButton
        $color={theme.colors.basic.white}
        $bgColor={theme.colors.primary.brand}
        $pressedBgColor={theme.colors.primary.dark}
        onClick={withdrawalConfirm}
      >
        確認提款
      </FEIBButton>
    </CardLessATMWrapper>
  );
};

export default CardLessATM2;