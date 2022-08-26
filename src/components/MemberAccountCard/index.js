import { useState } from 'react';
import Avatar from 'components/Avatar';
import { DeleteIcon, EditIcon } from 'assets/images/icons';
import MemberAccountCardWrapper from './memberAccountCard.style';

/*
* ==================== MemberAccountCard 組件說明 ====================
* MemberAccountCard 組件包含了 Avatar 組合成一張會員帳號卡片
* ==================== MemberAccountCard 可傳參數 ====================
* 1. type -> 組件型態，type 若為 '常用帳號' 才有刪除選項
* 2. name -> 會員名稱
* 3. bankNo -> 銀行代碼
* 4. bankName -> 銀行名稱
* 5. account -> 會員帳號
* 6. avatarSrc -> 會員頭像的圖片路徑
* 7. noBorder -> 無框線
* 8. noOption -> 左滑時無編輯 & 刪除選項、且點擊時無狀態
* 9. hasNewTag -> 顯示NEW標籤
* 10. onSelect -> 點擊會員帳號卡片事件 (選取時)
* 11. onEdit -> 左滑帳號卡片後，點擊編輯按鈕事件
* 12. onRemove -> 左滑帳號卡片後，點擊刪除按鈕事件
* */

const MemberAccountCard = ({
  type, name, bankNo, bankName, account, avatarSrc, noBorder, noOption, hasNewTag = false, onSelect, onEdit, onRemove,
}) => {
  const [moreAction, setMoreAction] = useState({
    isMoreActionOpen: false,
    startX: 0,
    endX: 0,
  });

  const handleClickEdit = () => {
    setMoreAction({ ...moreAction, isMoreActionOpen: false });
    onEdit();
  };

  const handleClickRemove = () => {
    setMoreAction({ ...moreAction, isMoreActionOpen: false });
    onRemove();
  };

  const handleTouchStart = (event) => {
    const touch = event.targetTouches[0];
    setMoreAction({ ...moreAction, startX: touch.pageX });
    // console.info('start', moreAction.startX);
  };

  const handleTouchMove = (event) => {
    const touch = event.targetTouches[0];
    setMoreAction({ ...moreAction, endX: touch.pageX });
    // console.info('end', moreAction.endX);
  };

  const handleTouchEnd = () => {
    // console.info('result-startX', moreAction.startX);
    // console.info('result-endX', moreAction.endX);
    if (
      moreAction.startX && moreAction.endX
      && (moreAction.startX > moreAction.endX) && (moreAction.startX - moreAction.endX > 20)
    ) {
      setMoreAction({ ...moreAction, isMoreActionOpen: true });
    } else {
      setMoreAction({ startX: 0, endX: 0, isMoreActionOpen: false });
    }
  };

  // 更多選項 (編輯、刪除)
  const renderMoreActionMenu = () => (
    <div className={`moreActionMenu ${moreAction.isMoreActionOpen ? 'show' : ''}`}>
      <button type="button" className="edit" onClick={handleClickEdit}>
        <EditIcon />
        <span>編輯</span>
      </button>
      {/* 常用帳號才有刪除選項 */}
      { type === '常用帳號' && (
        <button type="button" className="remove" onClick={handleClickRemove}>
          <DeleteIcon />
          <span>刪除</span>
        </button>
      ) }
    </div>
  );

  return (
    <MemberAccountCardWrapper
      $noBorder={noBorder}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(noOption || moreAction.isMoreActionOpen) ? null : onSelect}
    >
      <Avatar small src={avatarSrc} name={name} />
      <div className="memberInfo">
        <div className="flex-auto">
          <div className="title">
            {name || '會員'}
            {hasNewTag && (<div className="new-tag">New</div>)}
          </div>
          <div className="note">
            {`${bankName}(${bankNo}) ${account}`}
          </div>
        </div>
      </div>
      { !noOption && renderMoreActionMenu() }
    </MemberAccountCardWrapper>
  );
};

export default MemberAccountCard;
