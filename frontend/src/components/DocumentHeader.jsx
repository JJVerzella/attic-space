import { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;
const url = import.meta.env.VITE_SERVER_URL;

const DocumentHeader = ({ socket, documentId, documentTitle, documentContent }) => {
    const [id, setId] = useState();
    const [title, setTitle] = useState(documentTitle);

    useState(() => { setId(documentId); }, [setId]);

    const onSave = async () => {
        const token = localStorage.getItem('atticspace-token') || '';
        const response = await axios.patch(`${url}/document/${id}`, {
            content: documentContent
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const onShare = () => {
        setIsShareModalOpen(true);
    };

    const onShareOk = () => { setIsShareModalOpen(false); };
    const onShareClose = () => { setIsShareModalOpen(false); };
    const onShareCancel = () => { setIsShareModalOpen(false); };
    const onSearch = async (searchString) => {
        const token = localStorage.getItem('atticspace-token') || '';
        const response = await axios.put(`${url}/api/v1/files/${id}/share`, {
            headers: { Authorization: `Bearer ${token}` },
            users: [{email: searchString}]
        });
        if (socket && response) {
            socket.emit('fileShared', {documentId, email: 'jane.doe@gmail.com'})
        }
    }

    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const onVersion = () => {
        setIsVersionModalOpen(true);
    };

    const onVersionOk = () => { setIsVersionModalOpen(false); };
    const onVersionClose = () => { setIsVersionModalOpen(false); };
    const onVersionCancel = () => { setIsVersionModalOpen(false); };


    return (
        <>
            <Modal open={isShareModalOpen} onOk={onShareOk} onClose={onShareClose} onCancel={onShareCancel} title='Share'>
                <Search placeholder="Search for user" enterButton="Share" onSearch={onSearch} />
            </Modal>
            <Modal open={isVersionModalOpen} onOk={onVersionOk} onClose={onVersionClose} onCancel={onVersionCancel} title='Version'></Modal>

            <h1>{title}</h1>
            <Button onClick={onSave}>Save</Button>
            <Button onClick={onShare}>Share</Button>
            <Button onClick={onVersion}>Versions</Button>
        </>
    );
};

export default DocumentHeader;