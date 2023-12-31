import { useState, useEffect } from 'react';
import BankCode from 'components/BankCodeInput/bankSelector';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';
import { ListIcon } from 'assets/images/icons';
import { Controller } from 'react-hook-form';
import { getBankCode } from 'utilities/CacheData';
import Loading from 'components/Loading';

/*
* ================== BankCodeInput 組件說明 ==================
* BankCodeInput 組件封裝了 Input 和 BankCode 清單
* ================== BankCodeInput 可傳參數 ==================
* *** 所有參數皆供表單驗證與取值用 ***
* 1. id -> Input 的 id、name、Controller 的 name 均會代入此參數
*    此組件將根據上述 4 種不同狀態而產生不同的樣式色彩，預設為 "error"
* 2. control -> 傳入 react-hook-form 的 control 參數
* 3. setValue -> 傳入 react-hook-form 的 setValue 參數
* 4. trigger -> 傳入 react-hook-form 的 trigger 參數
* 5. errorMessage -> 表單驗證的錯誤訊息
* 6. value -> 若原先就有 value 值，可傳入，若無則預設為帶有 2 個空字串的物件
* */

const BankCodeInput = ({
  name,
  control,
  setValue,
  trigger,
  rules,
  errorMessage,
  value,
  readonly,
}) => {
  const [bankList, setBankList] = useState();
  const [showSelector, setShowSelector] = useState();

  /**
   *- 初始化
   */
  useEffect(() => {
    getBankCode().then((banks) => setBankList(banks));
    // NOTE 此 Component 在某些情況下會瞬間 unmount (ex: 切換 Tab/表單時)，
    // getBankCode 屬於 asynchronous，若 unmount 會造成 memory leaks，故在此新增 teardown function
    return () => setBankList(null);
  }, []);

  /**
   * HTML輸出。
   */

  //  在 bankList 還沒準備好之前，不應該出現 Input 欄位給使用者點擊，
  // 因為 bankList 此時還是 undefined，會造成 JavaScript Crash
  if (!bankList) return <Loading space="bottom" isCentered />;

  return (
    <div style={{ pointerEvents: readonly ? 'none' : 'auto' }}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <>
            <FEIBInputLabel htmlFor={name}>銀行代碼</FEIBInputLabel>
            <FEIBInput
              {...field}
              placeholder="請選擇"
              value={`${value ?? ''} ${
                bankList?.find((b) => b.bankNo === value)?.bankName ?? ''
              }`}
              $icon={<ListIcon />}
              $iconFontSize={2.4}
              $iconOnClick={() => setShowSelector(true)}
              readOnly
              error={!!errorMessage}
              onClick={() => setShowSelector(true)}
            />
            <FEIBErrorMessage>{errorMessage}</FEIBErrorMessage>
          </>
        )}
      />
      {showSelector ? (
        <BankCode
          banks={bankList}
          onClose={() => setShowSelector(false)}
          onSelected={(bank) => {
            setValue(name, bank.bankNo);
            trigger(name);
          }}
        />
      ) : null}
    </div>
  );
};

export default BankCodeInput;
