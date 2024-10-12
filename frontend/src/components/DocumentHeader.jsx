import { useEffect, useState } from 'react';
import { Button, Modal, Input, Table } from 'antd';
import { getDocumentVersions, saveDocument, shareDocument } from '../services/apiService';

const { Search } = Input;

const DocumentHeader = ({ documentContent, documentId, documentTitle, setContent, socket }) => {
    const [id, setId] = useState();
    const [title, setTitle] = useState();
    const [versions, setVersions] = useState();

    useEffect(() => {
        setId(documentId);
        setTitle(documentTitle);
    }, [setId, setTitle, documentId, documentTitle]);

    const onSaveClicked = async () => {
        try {
            const token = localStorage.getItem('atticspace-token') || '';
            await saveDocument(token, documentId, documentContent);
        } catch (e) {
            if (e.response && e.response.data) {
                console.error(e.response.data.message);
            } else {
                console.error('Failed to save document');
            }
        }
    };

    // Share Document Modal
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const onShareClicked = () => { setIsShareModalOpen(true); };
    const onShareOk = () => { setIsShareModalOpen(false); };
    const onShareClose = () => { setIsShareModalOpen(false); };
    const onShareCancel = () => { setIsShareModalOpen(false); };

    const onSearch = async (searchString) => {
        try {
            const token = localStorage.getItem('atticspace-token') || '';
            await shareDocument(token, id, searchString);
        } catch (e) {
            if (e.response && e.response.data) {
                console.error(e.response.data.message);
            } else {
                console.error('Failed to share document');
            }
        }
    }

    // Versioning Modal
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const onVersionOk = () => { setIsVersionModalOpen(false); };
    const onVersionClose = () => { setIsVersionModalOpen(false); };
    const onVersionCancel = () => { setIsVersionModalOpen(false); };

    const onVersionClicked = async () => {
        try {
            const token = localStorage.getItem('atticspace-token') || '';
            const data = await getDocumentVersions(token, id);
            if (!data) return;
            setVersions(data.versions.map(version => {
                return {
                    data: version.data,
                    number: 1,
                    revert: 'Revert to version #',
                }
            }));
            setIsVersionModalOpen(true);
        } catch (e) {
            if (e.response && e.response.data) {
                console.error(e.response.data.message);
            } else {
                console.error('Failed to retrieve document versions');
            }
        }
    };

    const onVersionDoubleClicked = (row) => {
        setContent(window.atob(row.data));
        setIsVersionModalOpen(false);
    }

    const versionColumns = [
        { title: 'Version Number', dataIndex: 'number', key: 'number' },
        { title: 'Revert', dataIndex: 'revert', key: 'revert' }
    ];

    return (
        <>
            <Modal onCancel={onShareCancel} onClose={onShareClose} onOk={onShareOk} open={isShareModalOpen} title='Share'>
                <Search enterButton="Share" onSearch={onSearch} placeholder="Share with a user" />
            </Modal>
            <Modal onCancel={onVersionCancel} onClose={onVersionClose} onOk={onVersionOk} open={isVersionModalOpen} title='Version'>
                <Table columns={versionColumns} dataSource={versions} onRow={(row) => ({
                    onDoubleClick: () => onVersionDoubleClicked(row)
                })}></Table>
            </Modal>

            <h1>{title}</h1>
            <Button onClick={onSaveClicked}>Save</Button>
            <Button onClick={onShareClicked}>Share</Button>
            <Button onClick={onVersionClicked}>Versions</Button>
        </>
    );
};

export default DocumentHeader;
