import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  .content_wrapper {
    margin: 2rem 0;
  }

  .step1_form {
    margin: 2rem 0;

    .form_input_container {
      display: grid;
      align-content: flex-start;
      grid-gap: 2rem;
      margin-top: 2rem;
    }
  }

  .step2_form {
    margin: 2rem 0;
    min-height: fit-content;

    .search_form {
      display: flex;
      flex-direction: row;
      align-items: flex-end;

      .search_input {
        width: 80vw;
      }
      .search_submit {
        width: 20vw;
      }
    }
    
    .select_form {
      margin: 2rem 0;

    }
  }

  .step3_form {
    .member_amount_table {
      display: grid;
      grid-gap: 1rem;

      .title {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }
      .member_amount_column {
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;

        .member_info {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
`;

export default PageWrapper;
