import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FEIBButton, FEIBInputLabel, FEIBInput } from 'components/elements';
import Badge from 'components/Badge';
import Avatar from 'components/Avatar';
import { accountFormatter, toHalfWidth } from 'utilities/Generator';
import { DrawerWrapper } from './D00600.style';

/**
 * 編輯/新增銀行帳號。
 * @param {*} initData {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   headshot: 代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。
 * }
 * @param {*} onFinished 完成編輯時的事件。
 */
function AccountEditor({
  initData,
  onFinished,
}) {
  const [model] = useState(initData);

  // Form 欄位名稱。
  const idNickName = 'nickName'; // 暱稱

  /**
   * 表單
   */
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {...initData, nickName: toHalfWidth(initData.nickName)},
  });

  /**
   * 輸入暱稱，編輯完成。
   */
  const Page2 = () => {
    const onSubmit = (values) => {
      const newModel = {
        ...model,
        ...values,
        headshot: values.headshot,
      };
      onFinished(newModel);
    };
    return (
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">{`${model.bankName} ${accountFormatter(model.acctId, model.bankId === '805')}`}</div>
        </Badge>
        <div className="flex-col">
          <div className="self-center">
            {/* 可變更約定帳號的人的大頭貼 */}
            <Avatar editable memberId={model.headshot} name={model.nickName} onNewPhotoLoaded={(headshot) => setValue('headshot', headshot)} />
          </div>
          <FEIBInputLabel htmlFor={idNickName}>暱稱</FEIBInputLabel>
          <Controller
            name={idNickName}
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                autoComplete="off"
                placeholder="請輸入容易讓您記住此帳號的暱稱"
                inputProps={{ maxLength: 20 }}
                error={!!errors?.nickName} // 畫紅底線
              />
            )}
          />
          <FEIBButton type="submit">完成</FEIBButton>
        </div>
      </form>
    );
  };

  /**
   * HTML輸出。
   */
  return (
    <DrawerWrapper>
      <Page2 />
    </DrawerWrapper>
  );
}

/**
 * 預設值：台灣銀行(004)
 */
AccountEditor.defaultProps = {
  initData: { bankId: '', acctId: '', nickName: '' },
  onFinished: null,
};

export default AccountEditor;
