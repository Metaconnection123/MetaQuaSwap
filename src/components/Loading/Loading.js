import React, { useState, useEffect } from 'react';

import {
    LoadingOverlay,
    LoadingPosition,
    LoadingRing,
    LoadingText,
} from '../Loading/LoadingElements'


const Loading = () => {
    return (
        <>
            <LoadingOverlay>
                <LoadingPosition>
                    <LoadingText>LOADING</LoadingText>
                    <LoadingRing></LoadingRing>
                </LoadingPosition>
            </LoadingOverlay>
        </>
    )
}


export default Loading;