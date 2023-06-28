import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalBox,
  TitleSpace,
  ContentSpace,
  BtnSpace,
  ConfirmBtn,
  CancelBtn,
} from "../Modal/CheckAmountElements";

const CheckAmount = (props) => {
  return (
    <>
      <ModalOverlay visible={true}></ModalOverlay>
      <ModalBox visible={true}>
        <TitleSpace>Info</TitleSpace>
        <ContentSpace>
          {props.asset === "ETH"
            ? `I want to swap BWE for ${props.inputAmount} ETH right?`
            : `I want to swap ETH using  ${props.inputAmount}BWE token. Is that correct?`}
        </ContentSpace>
        <BtnSpace>
          <ConfirmBtn onClick={props.func1}>Yes</ConfirmBtn>
          <CancelBtn onClick={props.func2}>No</CancelBtn>
        </BtnSpace>
      </ModalBox>
    </>
  );
};
export default CheckAmount;
