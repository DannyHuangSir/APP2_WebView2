import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  padding-bottom: 13.6rem;
  & > div {
    margin-bottom: 2rem;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.basic.white};
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    line-height: 4rem;
    height: 8rem;
  }
`;

export default PageWrapper;
