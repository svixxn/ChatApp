import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import ChatPage from "../pages/ChatPage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ChatPage">
                <ChatPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;