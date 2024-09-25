import React, { useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
    const response = await fetch('http://localhost:3000/api/upload');
    if (!response.ok) {
        throw new Error('Authentication request failed');
    }
    return response.json();
};

const Upload = ({ setImg }) => {
    const ikUploadRef = useRef(null);

    const onError = err => {
        console.error("Error", err);
        alert(`Upload failed: ${err.message}`);
    };

    const onSuccess = res => {
        console.log("Success", res);
        setImg(prev => ({
            ...prev,
            isLoading: false,
            dbData: res,
            imgUrl: res.url,
        }));
    };

    const onUploadStart = evt => {
        const file = evt.target.files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            setImg(prev => ({
                ...prev,
                isLoading: true,
                aiData: {
                    inlineData: {
                        data: reader.result.split(",")[1],
                        mimeType: file.type,
                    }
                }
            }));
        };

        reader.readAsDataURL(file);
    };

    return (
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
            <IKUpload
                fileName="test-upload.png"
                onError={onError}
                onSuccess={onSuccess}
                onUploadStart={onUploadStart}
                style={{ display: "none" }}
                ref={ikUploadRef}
            />
            <div
                onClick={() => ikUploadRef.current.click()}
                className="bg-light_gray_text dark:bg-medium_gray rounded-full py-2 px-3 cursor-pointer h-max"
            >
                <img src="/chat_icons/paperclip.svg" alt="paperclip" className="w-3 h-5" />
            </div>
        </IKContext>
    )
}

export default Upload;