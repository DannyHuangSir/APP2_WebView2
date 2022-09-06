/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/Loading';
import Dialog from 'components/Dialog';
import BottomDrawer from 'components/BottomDrawer';
import { FEIBButton, FEIBIconButton } from 'components/elements';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import theme from 'themes/theme';
import { ArrowBackIcon, HomeIcon } from 'assets/images/icons';
import { goHome as goHomeFunc, closeFunc } from 'utilities/AppScriptProxy';
import {
  setModalVisible, setWaittingVisible, setDrawerVisible, setAnimationModalVisible,
} from '../../stores/reducers/ModalReducer';
import HeaderWrapper from './Header.style';

function Layout({
  title,
  children,
  goHome = true,
  goBack = true,
  goBackFunc,
  hasClearHeader,
}) {
  const dispatch = useDispatch();

  //
  // 處理 Popup視窗、 等待中 及 Drawer。
  //
  const { overPanel, setResult } = useSelector((state) => state.ModalReducer);
  const modalData = useSelector((state) => state.ModalReducer.modal);
  const showModal = useSelector((state) => state.ModalReducer.showModal);
  const drawerData = useSelector((state) => state.ModalReducer.drawer);
  const showDrawer = useSelector((state) => state.ModalReducer.showDrawer);
  const waitting = useSelector((state) => state.ModalReducer.waitting);
  const showAnimationModal = useSelector((state) => state.ModalReducer.showAnimationModal);
  const animationModalData = useSelector((state) => state.ModalReducer.animationModal);

  // 關閉 Popup視窗。
  const onModalClose = async () => {
    if (modalData.onClose) {
      modalData.onClose();
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
      if ((await modalData.onOk() === false)) return;
    }
    // 如果有需要接續 modal 得操作，可以設定 noDismiss 為 true，以避免點擊ok按鈕後，下個 modal 遭關閉。
    if (modalData.noDismiss) return;

    dispatch(setModalVisible(false));
    if (setResult) setResult(true);
  };

  //
  const onModalCancel = async () => {
    if (modalData.onCancel) {
      if ((await modalData.onCancel() === false)) return;
    }
    dispatch(setModalVisible(false));
    if (setResult) setResult(false);
  };

  /**
   *  監控 ModalReducer.showModal, .showAnimationModal，當開啟時立即關閉 等待中 及 Drawer
   */
  useEffect(async () => {
    // console.log('showModal -> ', showModal || showAnimationModal);
    // 強制關掉 等待畫面，才能看到 Popup 視窗。
    if (showModal || showAnimationModal) {
      dispatch(setWaittingVisible(false));
      dispatch(setDrawerVisible(false));
    }
  }, [showModal, showAnimationModal]);

  /**
   * 顯示訊息視窗
   */
  const MessageModal = () => (
    <div>
      <Dialog
        title={modalData.title ?? '系統訊息'}
        isOpen={showModal}
        onClose={onModalClose}
        content={modalData.content}
        action={
          <>
            {(modalData.onCancel || modalData.cancelContent)
              ? (
                <FEIBButton
                  $bgColor={theme.colors.background.cancel}
                  $color={theme.colors.text.dark}
                  onClick={onModalCancel}
                >
                  {modalData.cancelContent ?? '取消'}
                </FEIBButton>
              )
              : null}
            <FEIBButton onClick={onModalOk}>
              {modalData.okContent ?? '確認'}
            </FEIBButton>
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
    // console.log('showWaitting -> ', waitting);
    if (waitting) {
      dispatch(setDrawerVisible(false));
      dispatch(setModalVisible(false));
    }
  }, [waitting]);

  //
  const onDrawerCancel = async () => {
    if (drawerData.onClose) {
      if ((await drawerData.onClose() === false)) return;
    }
    dispatch(setDrawerVisible(false));
  };

  /**
   * 下方彈出抽屜 UI。
   */
  const Drawer = () => (
    <BottomDrawer
      title={drawerData.title}
      // titleColor={theme.colors.primary.dark}
      isOpen={showDrawer}
      onBack={drawerData.goBack}
      onClose={onDrawerCancel}
      content={drawerData.content}
      shouldAutoClose={drawerData.shouldAutoClose}
    />
  );

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
  // 頁面外框
  //
  if (!waitting) {
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
            {waitting ? null : children}
            <MessageModal />
            <Drawer />
            {overPanel}
            <AnimationModal />
        </div>
      </div>
    );
  }
  return <Loading isFullscreen />;
}

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  goHome: PropTypes.bool,
  goBack: PropTypes.bool,
  goBackFunc: PropTypes.func,
};

Layout.defaultProps = {
  title: 'Bankee APP 2.0',
  children: <div />,
  goHome: true,
  goBack: true,
  goBackFunc: null,
};

export default Layout;
