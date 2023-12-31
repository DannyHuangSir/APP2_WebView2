import { AccountIcon10 } from 'assets/images/icons';

import AccountCard from 'components/CreditCard';
import EmptySlideContainer from './EmptySlide.style';
/*
* ==================== EmptySlide 組件說明 ====================
* 存錢計畫的上方卡片，當沒計畫時使用。
* ==================== EmptySlide 可傳參數 ====================
* 1. title -> 標題。
* 2. slogan -> 標語。
* */

const EmptySlide = () => (
  <AccountCard color="empty">
    <EmptySlideContainer>
      <AccountIcon10 size={54} color="currentColor" />
      <h2 className="title">新增個人信用貸款</h2>
    </EmptySlideContainer>
  </AccountCard>
);

export default EmptySlide;
