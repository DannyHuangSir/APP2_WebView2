import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import CipherUtil from 'utilities/CipherUtil';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { Func } from 'utilities/FuncID';
import { PasswordInputField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { changeUserName } from 'pages/T00800_ChangeUserName/api';

import { showAnimationModal } from 'utilities/MessageModal';
import { useNavigation } from 'hooks/useNavigation';
import ChangeUserNameWrapper from './T00800.style';
import { validationSchema } from './validationSchema';

/**
 * T00800 使用者代號變更
 */
const ChangeUserName = () => {
  const placeholderText = '請輸入使用者代號（6-20位英數字）';
  const { closeFunc } = useNavigation();
  const { handleSubmit, control } = useForm({
    defaultValues: { userName: '', newUserName: '', newUserNameCheck: '' },
    resolver: yupResolver(validationSchema),
  });

  // 點擊儲存變更按鈕，表單驗證 呼叫變更使用者代號 API
  const onSubmit = async ({ userName, newUserName }) => {
    const jsRs = await transactionAuth(Func.T008.authCode);

    if (jsRs.result) {
      const param = {
        userName: CipherUtil.e2ee(userName),
        newUserName: CipherUtil.e2ee(newUserName),
        // newUserNameCheck: e2ee(newUserNameCheck),
      };

      const { isSuccess, code, message } = await changeUserName(param);

      showAnimationModal({
        isSuccess,
        successTitle: '設定成功',
        successDesc: '您已成功變更使用者代號',
        errorTitle: '設定失敗',
        errorCode: code,
        errorDesc: message,
        onClose: closeFunc,
      });
    }
  };

  return (
    <Layout fid={Func.T008} title="使用者代號變更">
      <ChangeUserNameWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PasswordInputField
            name="userName"
            control={control}
            labelName="您的使用者代號"
            inputProps={{ placeholder: placeholderText, autoComplete: 'off', maxLength: 20 }}
          />
          <PasswordInputField
            name="newUserName"
            control={control}
            labelName="新的使用者代號"
            inputProps={{ placeholder: placeholderText, autoComplete: 'off', maxLength: 20 }}
          />
          <PasswordInputField
            name="newUserNameCheck"
            control={control}
            labelName="請確認新的使用者代號"
            inputProps={{ placeholder: placeholderText, autoComplete: 'off', maxLength: 20 }}
          />
          <FEIBButton type="submit">儲存變更</FEIBButton>
        </form>
      </ChangeUserNameWrapper>
    </Layout>
  );
};

export default ChangeUserName;
