import styled from 'styled-components';

const FavoriteBlockButtonStyle = styled.button.attrs({
  type: 'button',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor:pointer;
  min-height: 9.6rem;
  padding: 1.6rem .4rem .8rem .4rem;
  border: ${({ $noBorder, theme }) => ($noBorder ? '0' : `.2rem solid ${theme.colors.background.lighterBlue}`)};
  border-radius: .8rem;
  transition: all .2s;

  &.selected {
    border-color: ${({ theme }) => theme.colors.primary.light};
    background: ${({ theme }) => theme.colors.primary.light};
    
    p, .Icon {
       color: ${({ theme }) => theme.colors.basic.white};
    }

    .selectedIcon {
      display: block;
    }
  }
  
  &:disabled {
    pointer-events: none;
    touch-action: none;

    p, .Icon {
      color: ${({ theme }) => theme.colors.text.light};
      opacity: .8;
    }
    
    &:hover {
      border-color: ${({ theme }) => theme.colors.background.lighterBlue};
      background: unset;
    }
  }

  p {
    margin-top: .8rem;
    font-size: 1.4rem;
    color: ${({ $noBorder, theme }) => ($noBorder ? theme.colors.text.dark : theme.colors.text.light)};
  }

  .Icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary.light};
  }
  
  .selectedIcon {
    display: none;
    position: absolute;
    top: .8rem;
    left: .8rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.basic.white};
  }
`;

export default FavoriteBlockButtonStyle;
