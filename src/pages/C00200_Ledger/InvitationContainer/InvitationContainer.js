/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import Layout from 'components/Layout/Layout';
import { FEIBBorderButton } from 'components/elements';
import { useHistory, useLocation } from 'react-router';
import { loadFuncParams } from 'hooks/useNavigation';
import { Func } from 'utilities/FuncID';
import InvitationCard from '../InvitationCard/InvitationCard';
import PageWrapper from './InvitationContainer.style';
import { cardMsg, getLedger } from './api';

/**
 * 要錢卡/邀請卡 容器
 */
const InvitationContainer = (props) => {
  // const { location } = props;
  const [isInviteCard, setIsInviteCard] = useState();
  const [model, setModel] = useState();
  const history = useHistory();
  const { state } = useLocation(); // 要錢卡使用

  const onClick = () => {
    console.log('onClick');
    if (isInviteCard === true) {
      // 跳轉至 JoinSetting
      console.log('to /joinSetting', {param: model.inviteToken});
      history.push('/joinSetting', model.inviteToken);
    } else {
      // 跳轉至 Transfer
      const param = {
        transOut: 'myBindedAccount',
        amount: model.amount,
        transIn: {
          bank: model.transInBank,
          account: model.transInAccount,
        },
        target: model.ledgerName,
        usageType: model.type,
        memo: model.memo,
      };
      console.log('to /transferSetting', {param});
      history.push('/transferSetting', param);
    }
  };

  /* 判斷是否為邀請卡，取得頁面資料 */
  useEffect(async () => {
    const startParams = loadFuncParams(); // 自startFunc進入且帶參數則為自邀請卡進入
    if (startParams) {
      /* app open -> startFunc(C002, param: invite_token) -> 邀請卡被開啟 */
      console.log('邀情卡');
      setIsInviteCard(true);
      const { inviteToken } = startParams; // 自 startFunc 取得 inviteToken TODO 確認startParams格式
      const response = await getLedger(inviteToken); // 取邀請卡內容
      setModel({inviteToken, ...response});
    } else {
      // 要錢卡
      console.log('要錢卡');
      setIsInviteCard(false);
      const response = await cardMsg(state);
      setModel(response);
    }
  }, []);
  return (
    model ? (
      <Layout title={isInviteCard === true ? '加入帳本' : '你的成員來要錢嚕'} fid={Func.C002} goBackFunc={() => {}}>
        <PageWrapper>
          <InvitationCard data={{model, isInviteCard}} />
          {isInviteCard ? <FEIBBorderButton onClick={onClick}>加入帳本</FEIBBorderButton> : <FEIBBorderButton onClick={onClick}>立即轉帳</FEIBBorderButton>}
        </PageWrapper>
      </Layout>
    ) : <></>
  );
};

export default InvitationContainer;
