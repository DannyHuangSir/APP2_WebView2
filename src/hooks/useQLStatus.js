import { useEffect, useState } from 'react';
import { getQLStatus } from 'utilities/AppScriptProxy';
import { Func } from 'utilities/FuncID';
import { showCustomPrompt } from 'utilities/MessageModal';
import { useNavigation } from './useNavigation';

export const useQLStatus = () => {
  const [QLResult, setQLResult] = useState(true);
  const {startFunc} = useNavigation();

  useEffect(async () => {
    const { QLStatus } = await getQLStatus();
    setQLResult(QLStatus === 2 || QLStatus === 1);
  }, []);

  const showUnbondedMsg = () => {
    showCustomPrompt({
      message: '無裝置認證，請先進行「APP裝置認證(快速登入設定)」，或致電客服。',
      okContent: '立即設定',
      onOk: () => startFunc(Func.T002.id),
      onCancel: () => {},

    });
  };

  return { QLResult, showUnbondedMsg };
};
