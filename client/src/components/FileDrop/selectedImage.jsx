/* eslint-disable react/prop-types */

import FileDropZone from '@/components/FileDrop';


const ImageInput = ({ setSelectFile }) => {
    const handleFilesSelected = (filetype, files) => {
        setSelectFile(files[0]);
    };
    return (
        <FileDropZone
            fileType="landing"
            onFilesSelected={handleFilesSelected}
            title="2D image"
        />
    );
};

export default ImageInput;