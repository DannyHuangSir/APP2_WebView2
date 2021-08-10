import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const ForeignCurrencyAccountsWrapper = styled(Layout)`
  .userCardArea {
    left: -1.6rem;
    width: 100vw;
    
    .swiper-container {
      padding-bottom: 1.6rem;
    }
    
    .swiper-pagination {
      left: -.8rem;
    }
  }

  .transactionDetail {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-grow: 1;
    margin: 1.6rem 0;

    .moreButton {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-top: .4rem;
      font-size: 1.4rem;
      letter-spacing: .1rem;
      
      .MuiSvgIcon-root {
        margin-left: .2rem;
        font-size: 1.4rem;
      }
    }
  }
`;

export default ForeignCurrencyAccountsWrapper;