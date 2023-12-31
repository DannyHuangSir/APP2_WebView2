import styled from 'styled-components';

const FEIBdefaultButton = styled.button`
  display: block;
  max-width: 21.5rem;
  min-width: 4.8rem;
  min-height: 4.8rem;
  margin-left: auto;
  margin-right: auto;
  border-radius: 2.4rem;
  width: ${({ $width }) => ($width && `${$width}rem`) || '100%'};
  height: ${({ $height }) => ($height && `${$height}rem`) || '3.6rem'};
  font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.5rem'};
  color: ${({ theme, $color }) => $color || theme.colors.basic.white};
  transition: all .2s;
  cursor: pointer;
`;

export default FEIBdefaultButton;
