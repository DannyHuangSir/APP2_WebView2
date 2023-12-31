import styled from 'styled-components';
import Layout from 'components/Layout';

const TransferWrapper = styled(Layout)`
  //display: flex;
  //flex-direction: column;
  padding: 1.6rem 0 0 0;
  background: ${({ theme }) => theme.colors.background.lighterBlue};

  .insufficient {
    text-align: center;
    color: ${({ theme }) => theme.colors.state.danger};
    margin-bottom: 1.6rem;
  }

  .transferServicesArea {
    // left: -1.6rem;
    flex-grow: 1;
    padding: 2.4rem 1.6rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100vw;
    background: ${({ theme, $isDisabled }) => ($isDisabled ? theme.colors.background.light : theme.colors.basic.white)};
    pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'auto')};
  }

  form {
    padding-bottom: 0;
  }

  .memberAccountCardArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .4rem 1.2rem .4rem .4rem;
    margin-top: .8rem;
    margin-bottom: 2.4rem;
    border-radius: .6rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
  }

  .notice {
    margin-bottom: 2rem;
    font-size: 1.4rem;
  }

  .transferMode {
    // margin-bottom: 2.4rem;
  }

  .transferButtonArea {
    padding-top: 1.2rem;
    padding-bottom: 1.6rem;

    .notice {
      margin-top: 1.6rem;
      margin-bottom: 0;
      text-align: center;
    }
  }

  .memberAccountCard {
    display: flex;

    .avatar {
      width: 4.4rem;
      height: 4.4rem;
    }
  }

  .customWidth {
    width: 50%;
    margin-right: 0;
  }

  .customSpace {
    .MuiFormHelperText-root {
      margin-bottom: 0;
      &.hint{
      transform: translateY(-100%);
      }
    }



    .adornment {
      margin-right: .4rem;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.primary.dark};

      &.chinese {
        flex-grow: 1;
        margin-right: 0;
        font-size: 1.5rem;
        text-align: right;
      }

      &.empty {
        color: ${({ theme }) => theme.colors.text.placeholder};
      }
    }
  }

  .reserveOption {
    margin-top: 1.8rem;

    .dateRangePickerArea {
      margin-top: 1.6rem;
      margin-bottom: 1rem;
    }

    .datePickerLabel {
      margin-top: 1rem;
      margin-bottom: 1.8rem;
      top: 1.8rem;
    }

    .MuiFormControl-root {
      width: 100%;
    }

    .MuiInputLabel-root {
      color: transparent;
    }

    .MuiInputBase-input {
      font-size: 1.6rem;
    }

    .MuiFormControl-marginNormal {
      width: 100%;
    }

    .MuiInput-underline {
      opacity: 1;

      &:before,
      &:hover:not(.Mui-disabled):before {
        border-color: ${({ theme, $borderColor }) => $borderColor || theme.colors.border.light};
        opacity: 1;
      }
      &:after {
        border-width: .1rem;
        border-color: ${({ theme, $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || theme.colors.border.light};
      }

      &.Mui-error:after {
        border-width: .1rem;
        border-color: ${({ theme }) => theme.colors.state.danger};
      }
    }
  }

  .reserveMoreOption {
    display: flex;

    > div {
      margin-right: 1.6rem;
      width: 100%;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .warningText {
    color: ${({ theme }) => theme.colors.primary.dark};
    text-align: center;
    font-weight: 500;
    font-size: 1.8rem;
    margin: 1rem 0;
  }

  .accordionContent {
    ul {
      li {
        list-style: none;
      }
    }
  }
  .accordionContentWarning {
    color: ${({ theme }) => theme.colors.text.dark};
    font-size: 1.5rem;
    margin: 1.2rem 0;
  }

  // 轉帳確認頁
  &.transferConfirmPage,
    // 轉帳結果頁
  &.transferResultPage {
    padding: 1.6rem 0 0 0;
    background: ${({ theme }) => theme.colors.basic.white};

    section {
      padding: 1.6rem 2.4rem;
      text-align: center;

      &.transferAction {
        padding: 1.2rem 1.6rem 2.4rem 1.6rem;

        .infoArea {
          margin-top: 1.2rem;
          margin-bottom: .4rem;
        }
      }

      &.transferMainInfo {
        padding: 2.4rem 3.2rem;

        p {
          color: ${({ theme }) => theme.colors.text.lightGray};
        }

        h3 {
          color: ${({ theme }) => theme.colors.primary.dark};
          font-size: 2.4rem;
        }

        .transferAmount {
          margin: 1.2rem 0;
          font-weight: 900;
        }

        .Icon {
          margin-right: .4rem;
        }
      }

      .transferButtonArea {
        padding-top: 1.2rem;
      }
    }

    hr {
      margin: 0;
      border: 0;
      border-top: .8rem solid ${({ theme }) => theme.colors.background.lighterBlue};
    }

    .stateArea {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 1.6rem;
      padding: 0 3.2rem;
    }

    .stateImage {
      width: 14.4rem;
    }

    .stateText {
      margin-top: 1.6rem;
      font-size: 2.4rem;
      text-align: center;
      font-weight: 500;

      &.success {
        color: ${({ theme }) => theme.colors.secondary.brand};
      }
      &.error {
        color: ${({ theme }) => theme.colors.state.error};
      }
    }
  }

  // 轉帳結果頁
  &.transferResultPage {

    section {

      &.transferMainInfo {

        button {
          display: inline-flex;
          align-items: center;
          margin-top: .8rem;
          font-size: 1.4rem;

          span {
            margin-left: .4rem;
          }
        }

        .transferAmount {
          margin: .4rem 0;
          font-weight: 500;
        }
      }

      &.transactionDetailArea {
        padding-top: 0;
        padding-bottom: 7.2rem;
      }
    }
  }
`;

const TransferMOTPDialogWrapper = styled.div`
  margin-bottom: 2.4rem;
  text-align: center;

  p {
    margin-top: 1.6rem;
    font-size: 1.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }
`;

export default TransferWrapper;
export { TransferMOTPDialogWrapper };
