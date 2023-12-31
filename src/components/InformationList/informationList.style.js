import styled from 'styled-components';

const InformationListWrapper = styled.div`
  padding: 1.6rem 0.8rem;
  border-bottom: 0.1rem dashed ${({ theme }) => theme.colors.text.light};

  &:last-child {
    border-bottom: 0;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .text-title {
    font-size: 1.6rem;
    line-height: 2.4rem;
    min-height: 2.4rem;
  }

  .text-remark {
    font-size: 1.2rem;
    line-height: 1.8rem;
    min-height: 1.8rem;
  }

  .text-gray {
    color: ${({ theme }) => theme.colors.text.lightGray} !important;
  }

  .text-dark {
    color: ${({ theme }) => theme.colors.text.dark} !important;
  }

  .text-light {
    color: ${({ theme }) => theme.colors.text.light} !important;
  }

  .text-green {
    color: ${({ theme }) => theme.colors.state.success} !important;
    margin-left: 1rem;
  }

  .text-error {
    color: ${({ theme }) => theme.colors.state.error} !important;
    margin-left: 1rem;
  }

  .text-primary {
    color: ${({ theme }) => theme.colors.primary.brand} !important;
  }

  .text-nowrap {
    white-space: nowrap;
  }

  .text-align-end {
    text-align: end;
  }
`;

export default InformationListWrapper;
