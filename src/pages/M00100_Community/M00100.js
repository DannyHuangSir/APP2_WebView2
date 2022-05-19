/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import Avatar from 'components/Avatar';
import CopyTextIconButton from 'components/CopyTextIconButton';
import { FEIBInput, FEIBInputLabel, FEIBButton, FEIBIconButton, FEIBTextarea } from 'components/elements';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { customPopup, showInfo } from 'utilities/MessageModal';
import { loadFuncParams, startFunc, shareMessage } from 'utilities/BankeePlus';
import { ArrowNextIcon, EditIcon } from 'assets/images/icons';
import { hideName, stringDateFormatter } from 'utilities/Generator';
import theme from 'themes/theme';
import {
  getSummary,
  getFriends,
  // TODO updateAvatar,
  updateNickname,
  updateEssay,
} from './api';
import NetworkWrapper, { EssayWrapper, RecommendListWrapper } from './M00100.style';

/**
 * 社群圈首頁
 */
const CommunityPage = () => {
  const [summary, setSummary] = useState();
  const [friends, setFriends] = useState();

  const { register, unregister, handleSubmit } = useForm();
  const renderText = (value) => value || '-';
  const defaultEssay = '點擊「成為Bankee會員」申辦Bankee數位存款帳戶，享活存利率2.6%！';
  const shareMessageContent = () => `${summary?.essay ?? defaultEssay} ${process.env.REACT_APP_RECOMMEND_URL}${summary.memberNo}`;
  const [textareaLength, setTextareaLength] = useState(0); // ???

  useEffect(async () => {
    setWaittingVisible(false);

    const startParams = loadFuncParams(); // Function Controller 提供的參數
    // 取得 Function Controller 提供的 keepDdata(model)
    let model;
    if (startParams && (typeof startParams === 'object')) {
      model = startParams;
    } else {
      model = {
        summary: null, // 社群圈摘要資訊
        friends: null, // 接受推薦的好友名單
      };
    }

    // 首次加載時取得社群圈摘要資訊
    if (!model.summary) {
      model.summary = await getSummary();
    }
    setSummary(model.summary);

    setWaittingVisible(true);
  }, []);

  /**
   * 編輯暱稱
   */
  const showNicknameEditDialog = async () => {
    // Note: 因為這個 Dialog 是動態產生的，所以一定要刪掉註冊的元件。
    //       否則，下次註冊將失效，而且持續傳回最後一次的輪入值，而不會改變。
    const fieldName = 'nickname';
    unregister(fieldName, { keepDirty: true });

    const body = (
      <div id="nickNameForm" style={{ paddingBottom: '2.4rem' }}>
        <FEIBInputLabel htmlFor="nickname">您的名稱</FEIBInputLabel>
        <FEIBInput autoFocus {...register(fieldName)} defaultValue={summary.nickname} placeholder="請輸入您的名稱" />
      </div>
    );
    const onOk = ({ nickname }) => {
      if (!nickname) return;
      setSummary({ ...summary, nickname }); // 變更暱稱(Note:一定要換新物件，否則不會觸發更新，造成畫面不會重刷！)
      updateNickname(nickname);
    };
    await customPopup('暱稱', body, handleSubmit(onOk), null, '完成');
  };

  /**
   * 編輯 您的分享文案
   */
  const showEssayEditDialog = async () => {
    // Note: 因為這個 Dialog 是動態產生的，所以一定要刪掉註冊的元件。
    //       否則，下次註冊將失效，而且持續傳回最後一次的輪入值，而不會改變。
    const fieldName = 'essay';
    unregister(fieldName, { keepDirty: true });
    // TODO: 無法做到目前輸入長度的更新。
    // const onInputChange = (e) => {
    //   const length = e.target.textLength;
    //   setTextareaLength(length);
    // };

    const body = (
      <EssayWrapper>
        <FEIBInputLabel htmlFor="essay">您的分享文案</FEIBInputLabel>
        <FEIBTextarea
          {...register(fieldName)}
          defaultValue={summary.essay ?? defaultEssay}
          placeholder="請輸入您的分享文案"
          // onChange={onInputChange}
          $borderColor={textareaLength > 200 && theme.colors.state.danger}
          rowsMin={3}
          rowsMax={10}
        />
        <span className={`limitText ${textareaLength > 200 ? 'warningColor' : ''}`}>
          { `字數限制（${textareaLength}/200）` }
        </span>
      </EssayWrapper>
    );
    const onOk = ({ essay }) => {
      const length = essay?.length;
      if (length > 200) essay = essay.substring(0, length); // 截掉超過的部份。
      if (essay) {
        if (essay === defaultEssay) essay = null;
        setSummary({ ...summary, essay }); // 變更暱稱(Note:一定要換新物件，否則不會觸發更新，造成畫面不會重刷！)
        setTextareaLength(essay.length);
        updateEssay(essay);
      }
    };
    await customPopup('分享內容', body, handleSubmit(onOk), null, '完成');
  };

  /**
   * 列出 推薦名單
   */
  const showRecommendListDialog = async (items) => {
    if (!items) {
      items = await getFriends();
      setFriends(items);
    }

    const body = (
      <RecommendListWrapper>
        <table>
          {/* <caption>說明</caption> */}
          <thead>
            <tr>
              <th>姓名</th>
              <th>核卡完成日期</th>
              <th>開戶完成日期</th>
              {/* Note 還有很多產品 */}
            </tr>
          </thead>
          <tbody>
            { items.map((item) => (
              <tr key={item.friendName}>
                <td className="center">{renderText(hideName(item.friendName))}</td>
                <td className="center">{stringDateFormatter(item.creditCardApproved)}</td>
                <td className="center">{stringDateFormatter(item.depositApproved)}</td>
              </tr>
            )) }
          </tbody>
        </table>
      </RecommendListWrapper>
    );
    customPopup('推薦名單', body);
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout title="社群圈">
      <NetworkWrapper>
        <div className="infoContainer">
          <Avatar src={summary?.avatar} name={summary?.nickname} />
          <div className="nickname">
            <span className="name">{renderText(summary?.nickname)}</span>
            <FEIBIconButton $fontSize={1.6} onClick={showNicknameEditDialog}>
              <EditIcon />
            </FEIBIconButton>
          </div>
          <span className="level">{`等級 ${renderText(summary?.socailLevel)}`}</span>
        </div>
        <div className="contentCard promo">
          <div className="title">推薦好友加入社群圈</div>
          <div className="mainBlock">
            <div className="subTitle">我的推薦碼</div>
            <div className="code">
              <span>{renderText(summary?.memberNo)}</span>
              <CopyTextIconButton copyText={summary?.memberNo || ''} displayMessage="已複製推薦碼" />
            </div>
          </div>
          <div className="subTitle shareTitle">分享內容</div>
          <div className="essay">
            <span>{renderText(summary?.essay ?? defaultEssay)}</span>
            <FEIBIconButton $fontSize={1.6} onClick={showEssayEditDialog}>
              <EditIcon />
            </FEIBIconButton>
          </div>
          <FEIBButton onClick={() => shareMessage(shareMessageContent())}>分享推薦碼</FEIBButton>
        </div>
        <div className="contentCard">
          <div className="title">
            <div className="search" onClick={() => showRecommendListDialog(friends)}>
              <span>查詢</span>
              <ArrowNextIcon />
            </div>
            社群圈概況
          </div>
          <div className="overviewContent">
            <div className="overviewItem">
              <div className="subTitle">點擊人數</div>
              <div className="num">{renderText(summary?.community.hitTimes)}</div>
            </div>
            <div className="overviewItem">
              <div className="subTitle">申請中人數</div>
              <div className="num">{renderText(summary?.community.applying)}</div>
            </div>
            <div className="overviewItem">
              <div className="subTitle">已核可人數</div>
              <div className="num">{renderText(summary?.community.approved)}</div>
            </div>
          </div>
        </div>
        <div className="contentCard">
          <div className="title">社群圈回饋</div>
          <div className="overviewContent twoColumn">
            <div className="overviewItem" onClick={() => startFunc('depositPlus', null, { summary, friends })}>
              <div className="subTitle">
                優惠存款額度
                <ArrowNextIcon />
              </div>
              <div className="num">{renderText(summary?.bonusInfo.amount)}</div>
            </div>
            {/* TODO 信用卡分潤 - 此功能尚未完成！ */}
            <div className="overviewItem" onClick={() => showInfo('此功能尚未完成！')}>
              <div className="subTitle">
                信用卡分潤
                <ArrowNextIcon />
              </div>
              <div className="num">
                {`NT$${renderText(summary?.bonusInfo.profit)}`}
              </div>
            </div>
            {/* <div className="overviewItem"> */}
            {/*  <div className="subTitle">貸款社群回饋</div> */}
            {/*  <div className="num">{renderText(feedback.loan)}</div> */}
            {/* </div> */}
          </div>
        </div>
      </NetworkWrapper>
    </Layout>
  );
};

export default CommunityPage;