import styled from 'styled-components';

const MemberAccountCardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1.2rem .8rem;
  overflow: hidden;
  border-bottom: ${({ $noBorder, theme }) => ($noBorder ? '' : `.1rem solid ${theme.colors.border.lighter}`)};
  &:first-child {
    border-top: ${({ $noBorder, theme }) => ($noBorder ? '' : `.1rem solid ${theme.colors.border.lighter}`)};
  }
  
  .Avatar {
    margin-left: unset;
    margin-right: unset;
  }
  
  .memberInfo {
    margin-left: 1.2rem;

    .title {
      font-size: 1.8rem;
      line-height: 2.7rem;
    }

    .new-tag {
      display: inline-block;
      margin-inline-start: 0.5rem;
      padding-inline: 0.8rem;
      font-size: 1.2rem;
      font-weight: 400;
      vertical-align: text-bottom;
      background-color: ${({ theme }) => theme.colors.primary.light};
      color: ${({ theme }) => theme.colors.basic.white};
    }

    .note {
      font-size: 1.2rem;
      line-height: 1.8rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
  
  .changeMemberButton {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .moreActionMenu {
    display: flex;
    position: absolute;
    top: 0;
    right: -100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.basic.white};
    transition: all .3s ease-out;

    &.show {
      right: 0;
    }

    button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 6.8rem;

      &.edit {
        background: ${({ theme }) => theme.colors.primary.light};
      }
      &.remove {
        background: ${({ theme }) => theme.colors.state.danger};
      }

      .Icon {
        margin-bottom: .4rem;
        font-size: 2rem;
        color: white;
      }

      span {
        font-size: 1.2rem;
      }
    }
  }
`;

export default MemberAccountCardWrapper;
