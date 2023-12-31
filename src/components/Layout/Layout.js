/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from 'prop-types';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/Loading';
import Dialog from 'components/Dialog';
import BottomDrawer from 'components/BottomDrawer';
import { FEIBButton, FEIBIconButton } from 'components/elements';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import PasswordDrawer from 'components/PasswordDrawer';
import { getTransactionAuthMode, createTransactionAuth, transactionAuthVerify } from 'components/PasswordDrawer/api';
import theme from 'themes/theme';
import { ArrowBackIcon, HomeIcon } from 'assets/images/icons';
import { forceLogout, verifyBio } from 'utilities/AppScriptProxy';
import { showError } from 'utilities/MessageModal';
import { useNavigation } from 'hooks/useNavigation';
import {
  setModalVisible, setWaittingVisible, setDrawerVisible, setAnimationModalVisible,
  setDialogVisible,
} from '../../stores/reducers/ModalReducer';
import HeaderWrapper from './Header.style';

/**
 * 基本共用的頁面框架。
 * @param {{
 *   fid: { id: string }, // '{String} 此頁面的功能代碼，在各單元功能的首頁都一定要提供。', // NOTE 目前會由原生啟動的功能一定要加。
 *   title: '{string} 頁面上方主標題',
 *   children: '{*} 頁面內容',
 *   goHome: '{boolean} 表示顯示右上方的 goHome 圖示',
 *   goBack: '{boolean} 表示顯示左上方的 goBack 圖示',
 *   goBackFunc: '{function} 當 goBack 按下時的自訂處理函數',
 *   inspector: '檢查是否符合資格；若不是傳回 true 則立即執行 goBackFunc 或 closeFunc',
 *   hasClearHeader: '{boolean} 將標題設為透明的，目前用於存錢計劃',
 *   waitting: {boolean} 顯示等待畫面，直到變為 true 為止。
 * }} props
 * @returns
 */
function Layout({
  fid,
  title,
  children,
  goHome = true,
  goBack = true,
  goBackFunc,
  inspector,
  hasClearHeader,
  waitting,
}) {
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { registFunc, closeFunc, goHome: goHomeFunc } = useNavigation();
  //
  // 處理 Popup視窗、 等待中 及 Drawer。
  //
  const { overPanel, setResult, showDialog } = useSelector((state) => state.ModalReducer);
  const modalData = useSelector((state) => state.ModalReducer.modal);
  const showModal = useSelector((state) => state.ModalReducer.showModal);
  const drawerData = useSelector((state) => state.ModalReducer.drawer);
  const showDrawer = useSelector((state) => state.ModalReducer.showDrawer);
  const forceWaitting = useSelector((state) => state.ModalReducer.waitting);
  const showAnimationModal = useSelector((state) => state.ModalReducer.showAnimationModal);
  const animationModalData = useSelector((state) => state.ModalReducer.animationModal);

  // 關閉 Popup視窗。
  const onModalClose = async () => {
    if (modalData.onClose) {
      if ((await modalData.onClose() === false)) return; // 取消 Cancel 程序。
    }
    dispatch(setModalVisible(false));
    // dispatch(setWaittingVisible(false));
    if (setResult) setResult(null);
  };

  // 關閉結果動畫彈窗
  const onAnimationModalClose = async () => {
    if (animationModalData.onClose) {
      animationModalData.onClose();
    }
    dispatch(setAnimationModalVisible(false));
  };

  const onModalOk = async () => {
    if (modalData.onOk) {
      if ((await modalData.onOk() === false)) return; // 取消 Ok 程序。
    }
    // 如果有需要接續 modal 得操作，可以設定 noDismiss 為 true，以避免點擊ok按鈕後，下個 modal 遭關閉。
    if (modalData.noDismiss) return;

    dispatch(setModalVisible(false));
    dispatch(setDialogVisible(false));
    if (setResult) setResult(true); // 傳回視窗結束狀態。

    // exceptionActionMode - 1.執行Layout.goBack, 2.執行closeFunc, 3.執行forceLogout, 其他.關閉Popup
    if (modalData.exceptionActionMode) {
      // eslint-disable-next-line default-case
      switch (modalData.exceptionActionMode) {
        case 1: // 執行Layout.goBack
          if (goBackFunc) await goBackFunc();
          else closeFunc();
          break;
        case 2: // 執行closeFunc
          closeFunc();
          break;
        case 3: // 執行forceLogout
          await forceLogout();
          break;
      }
    }
  };

  //
  const onModalCancel = async () => {
    if (modalData.onCancel) {
      if ((await modalData.onCancel() === false)) return; // 取消 Cancel 程序。
    }
    dispatch(setModalVisible(false));
    dispatch(setDialogVisible(false));
    if (setResult) setResult(false); // 傳回視窗結束狀態。
  };

  // Note 如果進到此頁面時 forceWaitting 已是 true ，需將其關閉
  // 會發生的情境在於使用 goHome 或是 closeFunc 時，會預先 call setWaittingVisible(true)
  useEffect(() => {
    if (forceWaitting) {
      dispatch(setWaittingVisible(false));
    }
  }, []);

  /**
   *  監控 ModalReducer.showModal, .showAnimationModal，當開啟時立即關閉 等待中 及 Drawer
   */
  useEffect(async () => {
    // console.log('showModal -> ', showModal || showAnimationModal);
    // 強制關掉 等待畫面，才能看到 Popup 視窗。
    if (showModal || showDialog || showAnimationModal) {
      dispatch(setWaittingVisible(false));
      if (!showDialog) dispatch(setDrawerVisible(false));
    }
  }, [showModal, showDialog, showAnimationModal]);

  /**
   * 顯示訊息視窗
   */
  const MessageModal = () => (
    <div>
      <Dialog
        title={modalData.title ?? '系統訊息'}
        isOpen={showModal || showDialog}
        onClose={onModalClose}
        content={modalData.content}
        showCloseButton={modalData.showCloseButton}
        action={
          <>
            {modalData.onCancel || modalData.cancelContent ? (
              <FEIBButton
                $bgColor={theme.colors.background.cancel}
                $color={theme.colors.text.dark}
                onClick={onModalCancel}
              >
                {modalData.cancelContent ?? '取消'}
              </FEIBButton>
            ) : null}
            {/*  若沒有給 onOk 則不出現確認按鈕 */}
            {(modalData.onOk || modalData.okContent) ? (
              <FEIBButton onClick={onModalOk}>
                {modalData.okContent ?? '確認'}
              </FEIBButton>
            ) : null}
          </>
        }
      />
    </div>
  );

  /**
   *  監控 ModalReducer.showDrawer，當開啟時立即關閉 等待中 及 Popup視窗。
   */
  useEffect(async () => {
    // console.log('showDrawer -> ', showDrawer);
    if (showDrawer) {
      dispatch(setWaittingVisible(false));
      dispatch(setModalVisible(false));
    }
  }, [showDrawer]);

  /**
   * 監控 ModalReducer.waitting，當開啟時立即關閉 Drawer 及 Popup視窗。
   */
  useEffect(async () => {
    // console.log('showWaitting -> ', forceWaitting);
    // switchLoading(forceWaitting); // 關掉的情況下還是會有loading畫面，不確定這一行用意為何
    if (forceWaitting) {
      dispatch(setDrawerVisible(false));
      dispatch(setModalVisible(false));
    }
  }, [forceWaitting]);

  /**
   * Drawer GoBack
   */
  const onDrawerGoBack = async () => {
    if ((await drawerData.goBack() === false)) return; // 取消 goBack 程序。
    dispatch(setDrawerVisible(false));
  };

  /**
   * Drawer Close
   */
  const onDrawerClose = async () => {
    if (drawerData.onClose) {
      if ((await drawerData.onClose() === false)) return; // 取消 Close 程序。
    }
    dispatch(setDrawerVisible(false));
  };

  /**
   * 當 Drawer 關閉時，必需將 Result 設為 false, 才會結束 Promise
   */
  useEffect(() => {
    if (showDrawer === false && setResult) setResult(false); // 傳回視窗結束狀態。
  }, [showDrawer]);

  /**
   * 下方彈出抽屜 UI。
   */
  const Drawer = () => (
    <BottomDrawer
      title={drawerData.title}
      isOpen={showDrawer}
      onBack={drawerData.goBack ? onDrawerGoBack : null}
      onClose={onDrawerClose}
      noScrollable={drawerData.noScrollable}
      shouldAutoClose={drawerData.shouldAutoClose} // TODO 確認必要性。
    >
      {drawerData.content}
    </BottomDrawer>
  );

  const authData = useSelector((state) => state.ModalReducer.txnAuthData);
  /**
   * 模擬 APP 要求使用者進行交易授權驗證。
   */
  const TransactionAuth = ({funcCode}) => {
    const onFinished = (result) => {
      setResult(result);
      authData.showTxnAuth = false;
      forceUpdate();
    };

    const onFailed = (message) => { onFinished({ result: false, message }); };

    if (authData.showTxnAuth === null) { // 進行初始化
      authData.showTxnAuth = undefined; // 資料載入中...

      const setAuthData = async () => {
        const {authCode, otpMobile} = authData;

        // 取得需要使用者輸入驗證的項目。
        const authMode = await getTransactionAuthMode(authCode);
        if (!authMode) {
          onFailed('尚未完成行動裝置綁定，無法使用此功能！');
          return;
        }

        // 建立交易授權驗證。
        const txnAuth = await createTransactionAuth({
          funcCode,
          authCode: authCode + 0x96c1fc6b98e00,
          otpMobile,
        });
        if (!txnAuth) { // createTransactionAuth 發生異常就結束。
          onFailed('無法建立交易授權驗證。');
          return;
        }

        let needPWD = (authMode & 0x02) !== 0; // 表示需要通過 網銀密碼 驗證。
        // 進行雙因子驗證
        if (authMode & 0x01) {
          try {
            const rs = await verifyBio(txnAuth.key);
            needPWD = (rs.result !== true); // 驗證不通過，第二因子改用「網銀密碼」進行驗證。
          } catch (ex) {
            onFailed(ex);
            return;
          }

          // 沒有其他驗證需求時，就直接傳回結果。
          if (!needPWD && !((authMode & 0x08) !== 0)) {
            const verifyRs = await transactionAuthVerify({ authKey: txnAuth.key, funcCode });
            onFinished(verifyRs);
            return;
          }
        }

        authData.txnAuth = txnAuth;
        authData.allowedPWD = needPWD;
        authData.allowedOTP = ((authMode & 0x0C) !== 0);
      };

      setAuthData().then(() => {
        authData.showTxnAuth = true;
        forceUpdate();
      });
    }

    // 密碼及OTP輸入
    return (authData.allowedPWD || authData.allowedOTP) ? (
      <BottomDrawer
        title="交易授權驗證 (Web版)"
        isOpen={authData.showTxnAuth !== false}
        onBack={null}
        onClose={() => onFailed('使用者取消驗證。')}
      >
        <PasswordDrawer funcCode={funcCode} authData={authData.txnAuth} inputPWD={authData.allowedPWD} onFinished={onFinished} />
      </BottomDrawer>
    ) : <div />;
  };

  /**
   * 成功失敗動畫彈窗
   */
  const AnimationModal = () => (
    <Dialog
      isOpen={showAnimationModal}
      onClose={onAnimationModalClose}
      title=" "
      content={(
        <div className="dialogResultContent">
          <SuccessFailureAnimations
            isSuccess={animationModalData.isSuccess}
            successTitle={animationModalData.successTitle}
            successDesc={animationModalData.successDesc}
            errorTitle={animationModalData.errorTitle}
            errorCode={animationModalData.errorCode}
            errorDesc={animationModalData.errorDesc}
          />
        </div>
      )}
    />
  );

  //
  // 檢查是否可以開啟這個頁面。
  //
  const [isPassed, setPassed] = useState();
  useEffect(async () => {
    if (fid) await registFunc(fid.id); // TODO 要求所有 Layout 引用都要提供 fid 參數。

    let pass = true; // 若未設 inspector，則預設為檢查通過。
    if (inspector) {
      const errMesg = await inspector();
      // console.log(errMesg);
      pass = (errMesg === null);
      if (errMesg) {
        setPassed(errMesg); // 顯示等待中
        await showError(errMesg, (goBackFunc ?? closeFunc)); // 檢查不通過，立即關閉。
        return;
      }
    }
    setPassed(pass === true); // 必須是 true/false, 否則會一直顯示等待中的畫面。
  }, []);

  //
  // 頁面外框
  //
  if (!(waitting || forceWaitting) && isPassed === true) { // 在 isPassed 還沒有值之前，永遠顯不等待中的畫面。
    return (
      <div>
        <HeaderWrapper $isTransparent={hasClearHeader}>
          <FEIBIconButton className="goBack" $fontSize={2.4} $iconColor={theme.colors.text.dark} onClick={goBackFunc ?? closeFunc} $hide={!goBack}>
            <ArrowBackIcon />
          </FEIBIconButton>
          <h2>{title}</h2>
          <FEIBIconButton className="goHome" $fontSize={2.4} $iconColor={theme.colors.text.dark} onClick={goHomeFunc} $hide={!goHome}>
            <HomeIcon />
          </FEIBIconButton>
        </HeaderWrapper>

        <div>
          {children}
          {authData && (<TransactionAuth funcCode={fid?.id} />)}
          {showDrawer && <Drawer />}
          <MessageModal />
          <AnimationModal />
          {overPanel}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* watting 在 true 的情況下, 會因為沒有傳入 inspector 時，isPassed 變成 true，導致無法進到 Loading */}
      {/* 因此在這邊額外加入 waitting 進行判定 */}
      {isPassed === null || isPassed === undefined || waitting || forceWaitting ? (
        // TODO 美化成原生等待畫面的背景！
        <Loading isFullscreen />
      ) : (
        <MessageModal />
      )}
    </div>
  );
}

Layout.propTypes = {
  fid: PropTypes.shape({ id: PropTypes.string }),
  title: PropTypes.string,
  children: PropTypes.element,
  goHome: PropTypes.bool,
  goBack: PropTypes.bool,
  goBackFunc: PropTypes.func,
  inspector: PropTypes.func,
};

Layout.defaultProps = {
  fid: null,
  title: 'Bankee APP 2.0',
  children: <div />,
  goHome: true,
  goBack: true,
  goBackFunc: null,
  inspector: null,
};

export default Layout;
