import { useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showCustomDrawer, showCustomPrompt } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { AddIcon } from 'assets/images/icons';
import { loadFuncParams, useNavigation } from 'hooks/useNavigation';
import EmptyData from 'components/EmptyData';
import { accountFormatter } from 'utilities/Generator';
import {
  getFrequentAccount,
  addFrequentAccount,
  updateFrequentAccount,
  deleteFrequentAccount,
} from './api';
import AccountEditor from './D00500_AccountEditor';
import PageWrapper from './D00500.style';

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const {closeFunc} = useNavigation();

  const [selectorMode, setSelectorMode] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    getFrequentAccount().then(async (accts) => {
      setAccounts(accts);

      // Function Controller 提供的參數
      // startParams = {
      //   selectorMode: true, 表示選取帳號模式，啟用時要隱藏 Home 圖示。
      //   defaultAccount: 指定的帳號將設為已選取狀態
      // };
      const startParams = await loadFuncParams();
      if (startParams) {
        setSelectorMode(startParams.selectorMode ?? false);
        setSelectedAccount(startParams.defaultAccount);
      }

      dispatch(setWaittingVisible(false));
    });
  }, []);

  /**
   * 將選取的帳號傳回給叫用的單元功能，已知[轉帳]有使用。
   * @param {*} acct 選取的帳號。
   */
  const onAccountSelected = (acct) => {
    if (selectorMode) {
      const response = {
        memberId: acct.headshot,
        accountName: acct.nickName,
        bankName: acct.bankName,
        bankId: acct.bankId,
        accountNo: acct.acctId,
      };
      closeFunc(response);
    }
  };

  /**
   * 處理UI流程：新增帳戶
   */
  const addnewAccount = async () => {
    const onFinished = async (newAcct) => {
      dispatch(setWaittingVisible(true));
      const newAccounts = await addFrequentAccount(newAcct);
      dispatch(setWaittingVisible(false));
      if (newAccounts) {
        setAccounts(newAccounts);
        forceUpdate();
      }
    };

    await showCustomDrawer({
      title: '新增常用帳號',
      content: <AccountEditor onFinished={onFinished} />,
      noScrollable: true,
    });
  };

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} acct 變更前資料。
   */
  const editAccount = async (acct) => {
    const onFinished = async (newAcct) => {
      const condition = {
        orgBankId: acct.bankId,
        orgAcctId: acct.acctId,
      };
      dispatch(setWaittingVisible(true));
      const newAccounts = await updateFrequentAccount(newAcct, condition);
      dispatch(setWaittingVisible(false));
      if (newAccounts) {
        setAccounts(newAccounts);
        forceUpdate();
      }
    };

    await showCustomDrawer({
      title: '編輯常用帳號',
      content: <AccountEditor initData={acct} onFinished={onFinished} />,
      noScrollable: true,
    });
  };

  /**
   * 處理UI流程：移除登記帳戶
   */
  const removeAccount = async (acct) => {
    const onRemoveConfirm = () => {
      const newAccounts = deleteFrequentAccount({ bankId: acct.bankId, acctId: acct.acctId });
      setAccounts(newAccounts);
      forceUpdate();
    };

    await showCustomPrompt({
      title: '系統訊息',
      message: (<div className="txtCenter">您確定要刪除此帳號?</div>),
      okContent: '確定刪除',
      onOk: onRemoveConfirm,
      cancelContent: '我再想想',
      onCancel: () => {},
    });
  };

  const renderMemberCards = () => {
    if (!accounts) return null;
    if (!accounts.length) return <EmptyData content="查無常用帳號" height="70vh" />;
    return accounts.map((acct) => {
      const subTitle = `${acct.bankName}(${acct.bankId}) ${accountFormatter(acct.acctId, acct.bankId === '805')}`;
      return (
        <MemberAccountCard
          key={`${acct.bankId}_${acct.acctId}`}
          name={acct.nickName}
          subTitle={subTitle}
          memberId={acct.headshot}
          hasNewTag={acct.isNew}
          isSelected={(acct.acctId === selectedAccount?.accountNo && acct.bankId === selectedAccount?.bankId)}
          onClick={() => onAccountSelected(acct)} // 傳回值：選取的帳號。
          moreActions={[
            { lable: '編輯', type: 'edit', onClick: () => editAccount(acct) },
            { lable: '刪除', type: 'delete', onClick: () => removeAccount(acct) },
          ]}
        />
      );
    });
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout fid={Func.D005} title="常用帳號管理" goHome={!selectorMode}>
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增常用帳號" className="addMemberButtonArea" onClick={addnewAccount}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增常用帳號</span>
          </button>
          {renderMemberCards()}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
