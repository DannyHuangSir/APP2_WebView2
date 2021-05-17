import styled from 'styled-components';
import { IconButton as MaterialIconButton } from '@material-ui/core';

/*
* ==================== FEIBIconButton 可用選項 ====================
* 1. $iconColor -> 圖標顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */

const FEIBIconButton = styled(MaterialIconButton)`
  
  &.MuiIconButton-root {
    color: ${({ $iconColor }) => $iconColor || 'inherit'};
  }
`;

export default FEIBIconButton;
