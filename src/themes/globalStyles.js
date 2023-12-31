import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* ========== Reset.css ========== */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    font-size: 100%;
    vertical-align: baseline;
  }
  
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;

    caption {
      margin-bottom: 1.6rem;
      font-size: 1.4rem;
      text-align: left;
      color: ${({ theme }) => theme.colors.text.light};
    }
    
    tbody {
      
      &.rowCenterAll {
        > tr > td {
          text-align: center;
        }
      }
      &.rowCenter1 {
        > tr > td:first-child {
          text-align: center;
        }
      }
      &.rowCenter2 {
        > tr > td:nth-child(2) {
          text-align: center;
        }
      }
      &.rowCenter3 {
        > tr > td:nth-child(3) {
          text-align: center;
        }
      }
      
      &.rowRightAll {
        > tr > td {
          text-align: right;
        }
      }
      &.rowRight1 {
        > tr > td:first-child {
          text-align: right;
        }
      }
      &.rowRight2 {
        > tr > td:nth-child(2) {
          text-align: right;
        }
      }
      &.rowRight3 {
        > tr > td:nth-child(3) {
          text-align: right;
        }
      }
    }
  }
  
  /* ========== Custom ========== */
  * {
    position: relative;
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.font} !important;
    letter-spacing: .1rem !important;
  }
  
  html {
    height: 100%;
    font-size: 62.5%;
    position: fixed;
  }
  
  body {
    height: calc(100% - 4.4rem);
    font-size: 1.6rem;
    font-family: ${({ theme }) => theme.font};
    line-height: 1.43;
    color: ${({ theme }) => theme.colors.text.dark};
  }
  
  #root {
    height: 100%;
  }
  
  button {
    border: 0;
    outline: 0;
    color: inherit;
    background: transparent;
    
    &:disabled {
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        border-radius: inherit;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, .6);
      }
    }
  }
  
  img {
    width: 100%;
  }

  table {
    // border: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    width: 100%;
    font-size: 1.4rem;
    background: white;

    thead {
      color: ${({ theme }) => theme.colors.primary.light};
      font-size: 1.2rem;
    }
    
    tbody tr {
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};
    }

    tr {
      
      th {
        padding-bottom: .4rem;
      }

      td {
        // border-right: .1rem solid ${({ theme }) => theme.colors.border.lighter};
        padding: .4rem 0;
        color: ${({ theme }) => theme.colors.text.dark};

        &:first-child {
          color: ${({ theme }) => theme.colors.text.lightGray};
        }

        &.center {
          text-align: center;
        }
      }
    }
  }
  
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, em, i {
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.dark};
  }

  a {
    text-decoration: none;
  }

  .formItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.6rem;
    width: 100%;
  }

  .material-icons {
    font-family: 'Material Icons', sans-serif !important;
  }
  
  .MuiBackdrop-root {
    background: ${({ theme }) => theme.colors.background.mask} !important;
    backdrop-filter: ${({ theme }) => `blur(${theme.filters.blur})`};
  }

  .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
    width: .6rem;
    height: .6rem;
    background: #CCC;  // TODO: 該色票未新增至全域變數，待確認
    opacity: 1;
    transition: all .2s;

    &-active {
      background: ${({ theme }) => theme.colors.primary.light};
    //  width: .8rem;
    //  height: .8rem;
    //  transform: translateY(.15rem);
    }
  }
  
  .MuiPickersModal-dialogRoot {
    border: .8rem;
  }
  
  .MuiPickersCalendarHeader-switchHeader {
    
  }
  
  .textColorPrimary {
    color: ${({ theme }) => theme.colors.primary.dark} !important;
  }

  .textColorPoint {
    color: ${({ theme }) => theme.colors.text.point} !important;
  }

  .mainBlock {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    padding: 1.6rem 1.2rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
  }

  form {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    min-height: 100%;
    // padding-bottom: 4rem;
  }

  .lighterBlueLine {
    border-top: .8rem solid ${({ theme }) => theme.colors.background.lighterBlue};
    border-bottom: .8rem solid ${({ theme }) => theme.colors.background.lighterBlue};
  }

  .txtCenter {
    text-align: center;
  }

  .dialogResultContent {
    padding: 0 1.6rem 2.4rem;
    img {
      width: 14.4rem;
    }
    .resultText {
      margin-top: 1rem;
      font-size: 2.6rem;
      color: ${({ theme }) => theme.colors.secondary.brand};
    }
  }

  .balanceLayout {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.primary.dark};
    // transform: translateY(-3.7rem);
    pointer-events: none;
    height: 3.5rem;
    line-height: 3.5rem;
    position: absolute;
    top: 0;
  }

  .noticeEditList {
    li {
      padding: 2rem 1.6rem;
      font-weight: 400;
      font-size: 2rem;
      line-height: 3rem;
      color: ${({ theme }) => theme.colors.text.dark};
      display: flex;
      align-items: center;
      .mockIcon {
        width: 2rem;
        height: 2rem;
        border: .2rem solid ${({ theme }) => theme.colors.primary.dark};
        border-radius: 1rem;
        margin-right: 1.6rem;
      }
      .downloadImg {
        width: 2rem;
      }
    }
  }

  .downloadItemList {
    li {
      justify-content: space-between;
    }
  }

  .MuiInput-underline.Mui-disabled::before,
  .MuiInput-underline.Mui-disabled::after {
    border-bottom-style: solid !important;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .drawerContainer {
    margin-top: 0;
    padding: 0 1.6rem 2.4rem;
    button {
      margin-top: 1.8rem;
    }
  }
  // 針對 螢幕寬度<340px者 做RWD：縮小所有字體至1rem相當於8px (最小符合到280px: Galaxy Fold)
  @media (max-width:336px) {
    html{
      font-size: 50%;
    }
  }
`;

export default GlobalStyles;
