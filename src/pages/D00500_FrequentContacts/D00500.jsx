/* eslint no-use-before-define: ["error", { "variables": false }] */

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import uuid from 'react-uuid';

// import { getFavAccounts } from 'apis/transferApi';
import {
  setModal, setModalVisible, setDrawer, setDrawerVisible, setWaittingVisible,
} from 'stores/reducers/ModalReducer';

import { accountFormatter } from 'utilities/Generator';
import { AddIcon } from 'assets/images/icons';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import Badge from 'components/Badge';
import Avatar from 'components/Avatar';
import { FEIBButton, FEIBInputLabel, FEIBInput } from 'components/elements';

import {
  getAllFrequentAccount,
  addFrequentAccount,
  updateFrequentAccount,
  deleteFrequentAccount,
} from './api';

import PageWrapper, { DrawerWrapper } from './D00500.style';

// const mock = [
//   { nickName: 'Loid Forger', bankName: 'Peanuts Bank', acctId: '11122233334444' },
//   { nickName: 'Anya Forger', bankName: 'Peanuts Bank', acctId: '11122233324444' },
//   { nickName: 'Yor Forger', bankName: 'Peanuts Bank', acctId: '11122233304444' },
// ];

const uid = uuid();

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const { register, unregister, handleSubmit } = useForm();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // try {
    //   const successful = false && setCards(await getFavAccounts());
    //   if (!successful) throw new Error();
    // } catch {
    //   setCards(mock);
    // }
    // TODO: You may want to replace above try..catch block with just this single line:
    setCards(await getAllFrequentAccount());

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 處理UI流程：新增帳戶
   */
  const onAddSubmit = (data, card) => {
    const param = {...card};
    param.nickName = data.nickName;
    // TODO: Remove 'false &&' to enable API call.
    const successful = false && addFrequentAccount(param);

    if (!successful) {
      // TODO: You may want to do something with UI?
      dispatch(setDrawerVisible(false));
      return;
    }
    param.isNew = true;
    setCards([param, ...cards]);
    dispatch(setDrawerVisible(false));
  };

  const onAddClickStep1 = (card) => {
    // Note: 因為這個 Dialog 是動態產生的，所以一定要刪掉註冊的元件。
    //       否則，下次註冊將失效，而且持續傳回最後一次的輪入值，而不會改變。
    unregister('acctId', { keepDirty: false });

    const options = (
      <DrawerWrapper>
        <form className="flex-col" onSubmit={handleSubmit((data) => onAddClickStep2(data))}>
          {/* TODO: Add bank number input */}
          <div>
            <FEIBInputLabel htmlFor={`${uid}-add-acctId`}>帳號</FEIBInputLabel>
            <FEIBInput
              id={`${uid}-add-acctId`}
              defaultValue={card?.acctId ?? ''}
              {...register('acctId')}
            />
          </div>
          <FEIBButton type="submit">繼續</FEIBButton>
        </form>
      </DrawerWrapper>
    );
    dispatch(setDrawer({ title: '新增常用帳號', content: options }));
    dispatch(setDrawerVisible(true));
  };

  const onAddClickStep2 = (card) => {
    // Note: 因為這個 Dialog 是動態產生的，所以一定要刪掉註冊的元件。
    //       否則，下次註冊將失效，而且持續傳回最後一次的輪入值，而不會改變。
    unregister('nickName', { keepDirty: false });

    const options = (
      <DrawerWrapper>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">{`${card.bankName} ${accountFormatter(card.acctId)}`}</div>
        </Badge>
        <form className="flex-col" onSubmit={handleSubmit((data) => onAddSubmit(data, card))}>
          <div className="self-center">
            <Avatar name={card.nickName} src={card.headshot} />
          </div>
          <div>
            <FEIBInputLabel htmlFor={`${uid}-edit-name`}>暱稱</FEIBInputLabel>
            <FEIBInput
              id={`${uid}-edit-name`}
              placeholder="請輸入"
              defaultValue={card.nickName ?? ''}
              {...register('nickName')}
            />
          </div>
          <FEIBButton type="submit">加入</FEIBButton>
        </form>
        <FEIBButton type="button" onClick={() => onAddClickStep1(card)}>測試 返回</FEIBButton>
      </DrawerWrapper>
    );
    dispatch(setDrawer({ title: '新增常用帳號', content: options }));
  };

  /**
   * 處理UI流程：編輯帳戶
   */
  const onEditSubmit = (data, card) => {
    // TODO 轉入帳戶也可以變更。
    //  orgBankId: 變更前 常用轉入帳戶-銀行代碼，未變更也需要有值。
    //  orgAcctId: 變更前 常用轉入帳戶-帳號，未變更也需要有值。
    const param = {...card};
    const shouldUpdateNickname = card.nickName !== data.nickName;

    if (shouldUpdateNickname) param.nickName = data.nickName;
    // TODO: Do something with photo too

    // TODO: Remove 'false &&' to enable API call.
    const successful = false && updateFrequentAccount(param);
    if (!successful) {
      // TODO: You may want to do something with UI?
      dispatch(setDrawerVisible(false));
      return;
    }

    const tmpCards = cards.slice();
    tmpCards.forEach((c) => {
      if (c.acctId === card.acctId) {
        if (shouldUpdateNickname) c.nickName = data.nickName;
        // TODO: Do something with photo too
      }
    });
    setCards(tmpCards);
    dispatch(setDrawerVisible(false));
  };

  const onEditClick = (card) => {
    // Note: 因為這個 Dialog 是動態產生的，所以一定要刪掉註冊的元件。
    //       否則，下次註冊將失效，而且持續傳回最後一次的輪入值，而不會改變。
    unregister('nickName', { keepDirty: false });

    const options = (
      <DrawerWrapper>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">{`${card.bankName} ${accountFormatter(card.acctId)}`}</div>
        </Badge>
        <form className="flex-col" onSubmit={handleSubmit((data) => onEditSubmit(data, card))}>
          <div className="self-center">
            <Avatar name={card.nickName} src={card.headshot} />
          </div>
          <div>
            <FEIBInputLabel htmlFor={`${uid}-edit-name`}>暱稱</FEIBInputLabel>
            <FEIBInput
              id={`${uid}-edit-name`}
              placeholder="請輸入"
              defaultValue={card.nickName ?? ''}
              {...register('nickName')}
            />
          </div>
          <FEIBButton type="submit">完成</FEIBButton>
        </form>
      </DrawerWrapper>
    );
    dispatch(setDrawer({ title: '編輯常用帳號', content: options }));
    dispatch(setDrawerVisible(true));
  };

  /**
   * 處理UI流程：移除登記帳戶
   */
  const onRemoveClick = (card) => {
    const onRemoveConfirm = () => {
      // TODO: Remove 'false &&' to enable API call.
      const successful = false && deleteFrequentAccount(card.bankId, card.acctId);
      if (!successful) {
        // TODO: You may want to do something with UI?
      }
      const tmpCards = cards.filter((c) => c.acctId !== card.acctId);
      setCards(tmpCards);
    };

    dispatch(setModal({
      title: '系統訊息',
      content: <div style={{ textAlign: 'center' }}>您確定要刪除此帳號?</div>,
      okContent: '確定刪除',
      onOk: onRemoveConfirm,
      cancelContent: '我再想想',
    }));
    dispatch(setModalVisible(true));
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="常用帳號管理">
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增常用帳號" className="addMemberButtonArea" onClick={onAddClickStep1}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增常用帳號</span>
          </button>
          { !!cards && cards.map((card) => (
            <MemberAccountCard
              key={card.acctId}
              type="常用帳號"
              name={card.nickName}
              bankNo={card.bankId}
              bankName={card.bankName}
              account={card.acctId}
              avatarSrc={card.headshot}
              hasNewTag={card.isNew}
              onEdit={() => onEditClick(card)}
              onRemove={() => onRemoveClick(card)}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;