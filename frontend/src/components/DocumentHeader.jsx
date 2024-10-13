import { useEffect, useState } from 'react';
import { Button, Modal, Input, Table, Flex } from 'antd';
import { v4 as uuidv4 } from 'uuid';
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
            setVersions(data.versions.map((version, index) => {
                let versionNumber = index + 1;
                return {
                    key: uuidv4(),
                    data: version.data,
                    number: versionNumber,
                    revert: `Revert to version #${versionNumber}`,
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

            <Flex align='center' justify='space-between' style={{margin: '0 10px'}}>
                <h1>{title}</h1>
                <div>
                    <Button style={{margin: '0 5px'}} onClick={onSaveClicked}>Save</Button>
                    <Button style={{margin: '0 5px'}} onClick={onShareClicked}>Share</Button>
                    <Button style={{margin: '0 5px'}} onClick={onVersionClicked}>Versions</Button>
                </div>
            </Flex>
        </>
    );
};

export default DocumentHeader;
