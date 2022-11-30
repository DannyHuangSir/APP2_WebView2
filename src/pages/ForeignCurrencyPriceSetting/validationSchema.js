import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  currencyType: yup.string().required('請選擇幣別'),
  price: yup.number().typeError('匯率須為數字').positive('匯率必須大於 0'),
});
