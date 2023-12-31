import styled from 'styled-components';
import { FormHelperText as MaterialErrorMessage } from '@material-ui/core';

/*
* ==================== FEIBErrorMessage 可用選項 ====================
* 1. $noSpacing -> 無下方間距，型別為布林值
* 2. $color
 */

const FEIBErrorMessage = styled(MaterialErrorMessage).attrs({
  error: true,
})`
  &.MuiFormHelperText-root {
    margin:0;
    height: 1.8rem;
    text-align: right;
    font-size: 1.2rem;
    font-weight: 300;

    &.Mui-error {
      color: ${({ theme, $color }) => $color ?? theme.colors.state.danger};
    }
  }
`;

export default FEIBErrorMessage;
