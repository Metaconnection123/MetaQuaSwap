import React, { useState, useEffect } from 'react';
import {
    ModalOverlay,
    ModalBox,
    TitleSpace,
    ContentSpace,
    BtnSpace,
    ConfirmBtn
} from '../Modal/InsufficientCashElements'

const InsufficientCash = (props) => {
    return (
        <>
            <ModalOverlay visible={true}></ModalOverlay>
            <ModalBox visible={true}>
                <TitleSpace>Info</TitleSpace>
                <ContentSpace>
                    {props.asset === 'ETH' ? "You have more Ethereum you want to swap than Ethereum you have." : "You have more tokens to swap than you have."}
                </ContentSpace>
                <BtnSpace><ConfirmBtn onClick={props.func}>Confirm</ConfirmBtn></BtnSpace>
            </ModalBox>
       

        </>
    )
}

export default InsufficientCash;