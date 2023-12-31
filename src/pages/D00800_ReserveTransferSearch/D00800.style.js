import styled from 'styled-components';

import Layout from 'components/Layout';

export const ReserveTransferSearchWrapper = styled(Layout)`
  padding: 0;
  &.searchResult {
    background: ${({ theme }) => theme.colors.background.lighterBlue};
    display: flex;
    flex-direction: column;
  }
  &.resultFail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .buttonContainer {
      width: 100%;
    }
  }
  .line {
    height: 0.8rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
  }
  .confrimDataContainer {
    padding: 2.4rem 0;
    text-align: center;
    border-bottom: .8rem solid ${({ theme }) => theme.colors.background.lighterBlue};
    .dataLabel {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      line-height: 2.4rem;
      margin-bottom: 1.1rem;
    }
    .balance {
      font-size: 2.4rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.primary.dark};
      line-height: 3.6rem;
      margin-bottom: 1.2rem;
    }
    .accountInfo {
      font-size: 2.4rem;
      color: ${({ theme }) => theme.colors.primary.dark};
      line-height: 3.6rem;
      text-align: center;
    }
  }
  .informationListContainer {
    padding: 1.6rem;
  }
  .accordionContainer {
    padding: 1.6rem;
  }
  .buttonContainer {
    margin: 2rem auto;
  }
  .cardArea {
    width: 100vw;
    padding-top: 1.6rem;

    .swiper-container {
      padding-bottom: 1.6rem;
    }

    .swiper-pagination {
      left: -0.8rem;
    }
  }
  .searchResultContainer {
    background: ${({ theme }) => theme.colors.basic.white};
    flex: 1;
    padding: 2.4rem 1.6rem 0;
    border-radius: 3rem 3rem 0 0;
    .MuiTabs-root {
      margin-bottom: 1.6rem;
    }
    .searchDateRange {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      .searchIcon{
        width: 2.745rem;
        height: 2.745rem;
        margin-right: 0.8rem;
        color: ${({ theme }) => theme.colors.text.dark};
      }
      label {
        display: none;
      }
      .rangePickerContainer {
        width: 65%;
        
        .MuiInputBase-root {
          .MuiInput-input {
            color: ${({ theme }) => theme.colors.primary.light};
          }
        }
        .MuiInput-underline {
          &::before {
            border: none;
          }
        }
        .MuiIconButton-root {
          display: none;
        }
      } 
    }
  }
`;

export const DialogContentWrapper = styled.div`
  .resultContainer {
    .stateContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 2.4rem;
      .stateImage {
        width: 14.4rem;
      }
      .stateContent {
        font-size: 2.4rem;
        font-weight: 400;
        line-height: 3.6rem;
        &.success {
          color: ${({ theme }) => theme.colors.secondary.brand};
        }
        &.fail {
          color: ${({ theme }) => theme.colors.state.error};
        }
      }
    }
    .msgLabel {
      color: ${({ theme }) => theme.colors.text.lightGray};
      text-align: center;
      margin-bottom: 1.6rem;
    }
  }
  .mainBlock {
    padding: 1.6rem 1.2rem;
    flex-direction: column;
    margin-bottom: 1.6rem;
    .dataLabel {
      font-size: 1.4rem
      line-height: 2.1rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      margin-bottom: 1.2rem;
    }
    .balance {
      font-size: 2.4rem;
      font-weight: 600;
      line-height: 3.6rem;
      color: ${({ theme }) => theme.colors.primary.dark};
      margin-bottom: 1.2rem;
    }
    .accountInfo {
      font-size: 2.4rem;
      font-weight: 400;
      line-height: 3.6rem;
      text-align: center;
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
`;
