/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useHistory } from 'react-router';
import { forceLogout, getOsType } from 'utilities/AppScriptProxy';
import { Func, isEnterFunc } from 'utilities/FuncID';
import store from 'stores/store';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

const funcStack = {
  getStack: () => {
    if (!window.FuncStack) window.FuncStack = [];
    return window.FuncStack;
  },

  clear: () => { window.FuncStack = []; },

  push: (startItem) => {
    const stack = funcStack.getStack();
    stack.push(startItem);
  },

  pop: () => {
    const stack = funcStack.getStack();
    return stack.pop();
  },

  peek: () => {
    const stack = funcStack.getStack();
    const lastItem = stack[stack.length - 1];
    return lastItem;
  },
};

const useNavigation = () => {
  const history = useHistory();

  /**
   * 取得目前執行中的單元功能代碼。
   * @returns {String} 單元功能代碼。
   */
  const getActiveFuncID = async () => {
    const appJsRs = await callAppJavaScript('getActiveFuncID', null, true);
    return appJsRs.funcID;
  };

  /**
   * 網頁通知APP跳轉指定功能
   * @param {String} funcID 單元功能代碼。
   * @param {*} funcParams 提共給啟動的單元功能的參數，被啟動的單元功能是透過 loadFuncParams() 取回。
   * @param {*} keepData 當啟動的單元功能結束後，返回原功能啟動時取回的資料。
   */
  const startFunc = async (funcID, funcParams, keepData) => {
    funcID = funcID.replace(/^\/*/, '');

    if (funcStack.getStack().length === 0 && funcID !== Func.B001.id) {
      // 只有在 Web 測試模式 才需要加入首頁(B001);
      if (getOsType(true) === 3) {
        funcStack.push({ funcID: Func.B001.id, isFunction: true });
      } else {
        // 由原生直接啟動的第一個功能，因為不是透過 Web 的 startFunc 執行
        // 所以不會出現在 funcStack 中；需要由 Web端補上。
        funcStack.push({ funcID: await getActiveFuncID(), isFunction: true });
      }
    }

    let funcInfo;
    let isFunction = /^[A-Z]\d{3}$/.test(funcID);
    if (isFunction) {
      funcInfo = Object.values(Func).find((value) => value.id === funcID);
      if (!funcInfo) isFunction = false;
    }

    delete window.FuncParams;
    // 外開或原生功能不需納入 funcStack 管理，因為外開的功能沒有 Back 回原功能的需要。
    if (!isFunction || !(funcInfo.isOpenExternalBrowser || funcInfo.isAppFunc)) {
      funcStack.push({ funcID, funcParams, keepData, isFunction });
      window.FuncParams = funcParams;
    }

    if (isFunction) {
      // 檢查是否可以進入頁面
      const isEnter = await isEnterFunc(funcInfo);
      if (!isEnter) {
        funcStack.pop(); // 不允許進入需將 funcStack 還原
        return;
      }

      // 只有原生及外開功能需透過APP啟動，其他功能都由 Web 自行控制。
      if (funcInfo.isAppFunc || funcInfo.isOpenExternalBrowser) {
        const appJsRq = {
          funcID,
          funcParams: funcParams ? JSON.stringify(funcParams) : null,
          keepData: keepData ? JSON.stringify(keepData) : null,
        };
        const appJsRs = await callAppJavaScript('startFunc', appJsRq, true, async () => await webStartFunc(funcInfo));
        // TODO 從 appJsRs 取得 URL
        console.log('******>> startFunc 傳回值：', appJsRs); // DEBUG
      } else {
        await webStartFunc(funcInfo);
      }
    } else {
      history.push(`/${funcID}`);
    }
  };

  /**
   * 啟動 Web 單元功能。
   * @param {*} funcInfo 功能代碼等資訊。
   * @returns
   */
  const webStartFunc = async (funcInfo) => {
    const funcID = funcInfo.id;

    // DEBUG 開發時以 Browser 測試時才會用到。
    if (funcInfo.isOpenExternalBrowser) {
      let prodCode;
      switch (funcID) {
        case Func.F00100.id: prodCode = 'DEPOSIT'; break; // 申請台幣數存
        case Func.F00200.id: prodCode = 'S01a'; break; // 申請證券交割戶
        case Func.F00300.id: prodCode = 'Fa'; break; // 申請外幣數存
        case Func.F00400.id: prodCode = 'La'; break; // 申請貸款
        case Func.F00500.id: prodCode = 'Ca'; break; // 申請信用卡
        default:
          alert(`尚未支援的的外開功能代碼: ${funcID}`);
          return { result: false }; // 無效的功能代碼，不外開直接結束。
      }
      // 外開瀏覽器，要提示用戶，詢問同意後才可以進行。
      window.open(`http://localhost:3006/F00000/${prodCode}`, '_blank');
    } else {
      // TODO 暫時用固定版本 '00', 因為目前不是透過 API 取得，所以無法得到真實的URL
      history.push(`/${funcID}00`);
    }

    return {
      result: true,
    };
  };

  /**
   * 觸發APP返回上一頁功能，並將指定的資料透過 loadFuncParams() 傳回給啟動目前功能的單元功能。
   * @param {*} response 傳回值
   */
  const closeFunc = async (response) => {
    if (response?.target || response?.type) response = null;

    // 由原生直接啟動的第一個功能，因為不是透過 Web 的 startFunc 執行
    // 所以不會出現在 funcStack 中；需要由 Web端補上。
    if (funcStack.getStack().length === 0) {
      const funcID = await getActiveFuncID();
      if (funcID) funcStack.push({ funcID, isFunction: true });
    }

    delete window.FuncParams;

    const closedItem = funcStack.pop();
    if (!closedItem) return;
    console.log(`Close Function (${closedItem.funcID})`); // DEBUG

    // 建立要返回功能的啟動參數。
    const startItem = funcStack.peek();

    if (!startItem) {
      await callAppJavaScript('closeFunc', null, false);
      // NOTE 因為回到「原生首頁」時，Webview 內容仍存在，下次開啟 Webview 時會先看到上次的內容，先在前端以此方式解決
      // history.push('/'); // Webview 被隱藏時，將畫面導向空白頁，避免看到前一頁的內容
      store.dispatch(setWaittingVisible(true));
      if (closedItem.funcID === Func.B001.id) forceLogout();
      return;
    }
    console.log(`Restore Function (${startItem.funcID})`); // DEBUG

    const params = closedItem.keepData ?? startItem.funcParams ?? null;
    window.FuncParams = {
      ...params,
      response, // 前一單元功能的 傳回值
    };

    if (startItem.isFunction) {
      const funcInfo = Func[startItem.funcID];
      await webStartFunc(funcInfo);
    } else {
      history.push(`/${startItem.funcID}`);
    }
  };

  const goHome = async () => {
    funcStack.clear();
    delete window.FuncParams;
    // NOTE 因為回到「原生首頁」時，Webview 內容仍存在，下次開啟 Webview 時會先看到上次的內容，先在前端以此方式解決
    // history.push('/'); // Webview 被隱藏時，將畫面導向空白頁，避免看到前一頁的內容
    store.dispatch(setWaittingVisible(true));
    await callAppJavaScript('goHome', null, false, () => {
      startFunc(Func.B001.id);
      funcStack.push({ funcID: Func.B001.id, isFunction: true });
    });
  };

  const registFunc = async (funcID) => {
    const lastFunc = funcStack.peek();
    if (lastFunc?.funcID !== funcID) {
      funcStack.push({ funcID, isFunction: true });
    }
  };

  /**
   * 取得目前單元功能啟動資訊。
   */
  function getCurrentFunc() {
    const stack = funcStack;
    return stack.peek();
  }

  /**
   * 取得啟動目前單元功能的功能代碼。
   * @returns {String} 功能代碼。
   */
  function getCallerFunc() {
    const stack = funcStack.getStack();
    if (stack.length <= 1) return null;

    return stack[stack.length - 2].funcID;
  }

  return {
    registFunc,
    startFunc,
    closeFunc,
    goHome,
    getCurrentFunc,
    getCallerFunc,
  };
};

/**
 * 篩掉不要顯示的 APP JS Script log
 * @param {*} appJsName APP提供的JavaScript funciton名稱。
 */
function showLog(appJsName) {
  switch (appJsName) {
    case 'onLoading':
    case 'setAuthdata':
    case 'getAPPAuthdata':
    case 'getStorageData':
    case 'setStorageData':
      return false;

    default: return true;
  }
}

/**
 * 執行 APP 提供的 JavaScript（ jstoapp ）
 * @returns
 */
async function callAppJavaScript(appJsName, jsParams, needCallback, webDevTest) {
  const jsToken = `A${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
  if (showLog(appJsName)) console.log(`\x1b[33mAPP-JS://${appJsName}[${jsToken}] \x1b[37m - Params = `, jsParams);

  if (!window.AppJavaScriptCallback) {
    window.AppJavaScriptCallback = {};
    window.AppJavaScriptCallbackPromiseResolves = {};
  }

  const CallbackFunc = (token, value) => {
    const resolve = window.AppJavaScriptCallbackPromiseResolves[token];
    delete window.AppJavaScriptCallbackPromiseResolves[token];
    delete window.AppJavaScriptCallback[token];

    let response = value;
    if (!(value instanceof Object)) {
      try {
        response = JSON.parse(value);
      } catch {
        response = value;
      }
    }

    if (response) {
      if (response.result === 'true') response.result = true;
      if (response.result === 'false') response.result = false;
      if (response.result === 'null') response.result = null;
      if (response.exception === 'null' || response.exception?.trim() === '') response.exception = null;
    }

    resolve(response);
  };

  const promise = new Promise((resolve) => {
    window.AppJavaScriptCallback[jsToken] = (value) => CallbackFunc(jsToken, value);
    window.AppJavaScriptCallbackPromiseResolves[jsToken] = resolve;

    const request = {
      ...jsParams,
      callback: (needCallback ? `AppJavaScriptCallback['${jsToken}']` : null),
    };

    switch (getOsType(true)) {
      case 1: // 1.iOS
        window.webkit.messageHandlers.jstoapp.postMessage(JSON.stringify({ name: appJsName, data: JSON.stringify(request) }));
        break;
      case 2: // 2.Android
        window.jstoapp[appJsName](JSON.stringify(request));
        break;
      default: // 3.其他
        window.AppJavaScriptCallback[jsToken](webDevTest ? webDevTest() : null);
        return;
    }

    if (!needCallback) resolve(null);
  });

  const response = await promise;
  if (response?.exception) {
    throw new Error(response.message);
  }

  if (showLog(appJsName)) console.log(`\x1b[33mAPP-JS://${appJsName}[${jsToken}] \x1b[37m - Response = `, response);
  return response;
}

/**
 * 取得 APP Function Controller 提供的功能啟動參數。
 * @returns {Promise<{
 *   ...params: '被啟動時的 funcParams 或是啟動下一個功能時，要求 startFunc 暫存的 keepData。 這裡的 params 並不是一個物件',
 *   response: '前一功能的傳回的資料',
 * }>} 若參數當時是以 JSON 物件儲存，則同樣會轉成物件傳回。
 */
async function loadFuncParams() {
  let params = window.FuncParams; // 由 startFunc 或 closeFunc 所存入的資料。
  if (!params) { // 由原生直接開啟單元功能時，window.FuncParams 不會有值。
    const data = await callAppJavaScript('getPagedata', null, true);
    console.log('>> getPagedata : ', data);
    if (data) {
      // 解析由 APP 傳回的資料, 只要有 keepData 就表示是由叫用的功能結束返回
      // 因此，要以 keepData 為單元功能的啟動參數。
      // 反之，表示是單元功能被啟動，此時才是以 funcParams 為單元功能的啟動參數。
      const dataStr = data.keepData || data.funcParams;
      params = dataStr?.startsWith('{') ? JSON.parse(dataStr) : null; // NOTE 只支援APP JS傳回JSON格式資料！
    }
  }

  console.log('>> Function 啟動參數 : ', params);
  return params;
}

export {
  useNavigation,
  callAppJavaScript,
  loadFuncParams,
};
