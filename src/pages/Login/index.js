/* eslint-disable radix,no-restricted-globals */
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { userLogin } from 'apis/loginApi';
import {
  ArrowForwardRounded,
  RadioButtonUnchecked,
  RadioButtonChecked,
} from '@material-ui/icons';
import PasswordInput from 'components/PasswordInput';
import {
  FEIBInput, FEIBInputLabel, FEIBErrorMessage,
  FEIBLinkButton, FEIBCheckbox, FEIBCheckboxLabel,
} from 'components/elements';
import e2ee from 'utilities/E2ee';
import getJwtKey from 'utilities/DoGetToken';
import theme from 'themes/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import LoginWrapper from './login.style';
import { accountValidation, identityValidation, passwordValidation } from '../../utilities/validation';

const Login = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    ...identityValidation,
    ...accountValidation,
    ...passwordValidation,
  });
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    getJwtKey();
  }, []);
  const userInfo = useSelector(({ login }) => login.userInfo);

  const upperId = (e) => {
    setValue('identity', e.target.value.toUpperCase());
  };

  const onSubmit = async (data) => {
    data.identity = data.identity.toUpperCase();
    data.account = await e2ee(data.account);
    data.password = await e2ee(data.password);
    const response = await userLogin(data);
    localStorage.setItem('jwtToken', response);
  };

  useCheckLocation();
  usePageInfo('/api/login');

  return (
    userInfo
      ? <Redirect to="/shortcut" />
      : (
        <LoginWrapper fullScreen>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="title">
              <h3>Hello !</h3>
              <p>To be Friendlier & Smarter</p>
            </div>

            <div className="formItems" style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                <FEIBInputLabel
                  htmlFor="identity"
                  $color={theme.colors.basic.white}
                >
                  身分證字號
                </FEIBInputLabel>
                <Controller
                  name="identity"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FEIBInput
                      {...field}
                      id="identity"
                      name="identity"
                      $color={theme.colors.basic.white}
                      $borderColor={theme.colors.basic.white}
                      onBlur={(e) => upperId(e)}
                    />
                  )}
                />
                <FEIBErrorMessage>{errors.identity?.message}</FEIBErrorMessage>
              </div>

              <div style={{ width: '100%' }}>
                <FEIBInputLabel
                  htmlFor="account"
                  $color={theme.colors.basic.white}
                >
                  使用者代號
                </FEIBInputLabel>
                <Controller
                  name="account"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FEIBInput
                      {...field}
                      id="account"
                      name="account"
                      $color={theme.colors.basic.white}
                      $borderColor={theme.colors.basic.white}
                    />
                  )}
                />
                <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
              </div>

              <div style={{ width: '100%' }}>
                <PasswordInput
                  label="密碼"
                  id="password"
                  control={control}
                  color={theme.colors.basic.white}
                  borderColor={theme.colors.basic.white}
                  placeholder=" "
                  errorMessage={errors.password?.message}
                />
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <FEIBCheckboxLabel
                    control={(
                      <FEIBCheckbox
                        $iconColor={theme.colors.basic.white}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<RadioButtonChecked />}
                      />
                    )}
                    label="記住我的身分"
                    $color={theme.colors.basic.white}
                  />
                </div>
                <div className="forgot">
                  <FEIBLinkButton $color={theme.colors.basic.white}>忘記使用者代號或密碼</FEIBLinkButton>
                </div>
              </div>
            </div>

            <div className="controlButtons">
              <div className="login">
                <button type="submit">
                  登入
                  <ArrowForwardRounded />
                </button>
              </div>
              <div className="signup">
                <span>還沒有帳號嗎？</span>
                <FEIBLinkButton
                  className="boldLink"
                  $color={theme.colors.text.link}
                >
                  Sign up!
                </FEIBLinkButton>
              </div>
            </div>
          </form>
        </LoginWrapper>
      )
  );
};

export default Login;
