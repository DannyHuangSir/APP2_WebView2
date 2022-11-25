/* eslint-disable no-unused-vars */
import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
  FEIBBorderButton,
} from 'components/elements';
import { AddCircleRounded, RemoveCircleRounded } from '@material-ui/icons';
import { toCurrency } from 'utilities/Generator';

export const CustomInputSelectorField = ({
  labelName,
  type = 'text',
  placeholder,
  disabled,
  $color,
  ...controlProps
}) => {
  const amountArr = [1000, 2000, 3000, 5000, 10000, 20000];

  const { field, fieldState } = useController(controlProps);
  const { onChange, value, name } = field;

  const changeAmount = (isAdd) => {
    if (isAdd && value < 20000) onChange(value + 1000);
    if (!isAdd && value > 1000) onChange(value - 1000);
  };

  return (
    <>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBInput
        className="withdrawAmount"
        value={value || ''}
        type="number"
        id={name}
        disabled={disabled}
        error={!!fieldState.error}
        placeholder={placeholder || ''}
        $color={$color}
      />
      <div className="addMinusIcons">
        <RemoveCircleRounded onClick={() => changeAmount(false)} />
        <AddCircleRounded onClick={() => changeAmount(true)} />
      </div>
      <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage>

      <FEIBInputLabel className="limit-label">
        以千元為單位，單日單次上限＄20,000
      </FEIBInputLabel>

      <div className="amountButtonsContainer">
        {amountArr.map((item) => (
          <div key={item} className="withdrawalBtnContainer">
            <FEIBBorderButton
              type="button"
              className="withdrawal-btn customSize"
              onClick={() => onChange(item)}
            >
              {toCurrency(item)}
            </FEIBBorderButton>
          </div>
        ))}
      </div>
    </>
  );
};