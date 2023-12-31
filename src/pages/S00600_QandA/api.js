import { callAPI } from 'utilities/axios';

// 取得常見問題主類別 done
export const getQACategory = async () => {
  const response = await callAPI('/common/v1/queryQACat');
  return response.data;
};

// 取得常見問題子類別 done
export const getQASubCategory = async (param) => {
  const response = await callAPI('/common/v1/queryQASubCat', param);
  return response.data;
};
