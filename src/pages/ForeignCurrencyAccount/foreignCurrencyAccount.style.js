import styled from 'styled-components';
import Layout from 'components/Layout';

const ForeignCurrencyAccountWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  
  .userCardArea {
    ${({ $multipleCardsStyle }) => $multipleCardsStyle && (`
      left: -1.6rem;
      width: 100vw;
    `)}
    
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
    margin-bottom: 1.6rem;

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

export default ForeignCurrencyAccountWrapper;