import React from 'react';
import {
    ModalOverlay,
    MetaMaskModalBox,
    MetaMaskModalTitleSpace,
    MetaMaskModalContentSpace,
    MetaMaskModalBtnSpace, MetaMaskModalConfirmBtn
} from './MetaMaskIntallElements';


const MetaMaskInstall = ({ className, visible, children }) => {

    const pageMove = () => {
        window.location.href = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ko";
    }

    return (
        <>
            {/* <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
          </ModalInner>
        </ModalWrapper> */}

            <ModalOverlay visible={visible}></ModalOverlay>
                <MetaMaskModalBox visible={visible}>
                    <MetaMaskModalTitleSpace>Install</MetaMaskModalTitleSpace>
                    <MetaMaskModalContentSpace>Metamask extension is not installed.
                        <br></br>Go to the installation page.</MetaMaskModalContentSpace>
                    <MetaMaskModalBtnSpace><MetaMaskModalConfirmBtn onClick={pageMove}>Move</MetaMaskModalConfirmBtn></MetaMaskModalBtnSpace>
                </MetaMaskModalBox>
            
        </>
    )

}

export default MetaMaskInstall;