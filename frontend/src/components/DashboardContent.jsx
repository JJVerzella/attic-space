import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Image, Layout, Modal, Table, Upload } from 'antd';
import {
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    HistoryOutlined,
    InboxOutlined,
    InfoCircleOutlined,
    MoreOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { createDocument, getFiles, uploadFiles } from '../services/apiService';

const { Content } = Layout;
const { Dragger } = Upload;

const DashboardContent = ({ user }) => {
    const [currentUser] = useState(user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [image, setImage] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const token = localStorage.getItem('atticspace-token') || '';
                const data = await getFiles(token);
                if (!data) return;
                setFiles(data.map(file => {
                    return {
                        base64: file.data,
                        contentType: file.contentType,
                        fileSize: file.size,
                        id: file.id,
                        key: uuidv4(),
                        lastModified: file.lastModified,
                        name: file.title,
                        userId: file.userId,
                    };
                }));
            } catch (e) {
                if (e.response && e.response.data) {
                    console.error(e.response.data.message);
                } else {
                    console.error('Failed to retrieve file(s)');
                }
            }
        };

        fetchFiles();
    }, []);

    const onCreateDocument = async () => {
        try {
            const token = localStorage.getItem('atticspace-token') || '';
            const data = await createDocument(token);
            if (data && data?.id) {
                const documentId = data.id;
                navigate(`/document/${documentId}/`, { state: { user: data } });
            }
        } catch (e) {
            if (e.response && e.response.data) {
                console.error(e.response.data.message);
            } else {
                console.error('Failed to create document');
            }
        }
    }

    const uploadFile = async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const token = localStorage.getItem('atticspace-token') || '';
            const data = await uploadFiles(token, formData);
            if (!data) return;
            setFiles((existingFiles) => [...existingFiles, {
                key: uuidv4(),
                id: data.id,
                name: data.title,
                contentType: data.contentType,
                base64: data.data,
                fileSize: data.size,
                userId: data.userId,
                lastModified: data.lastModified
            }]);
        } catch (e) {
            if (e.response && e.response.data) {
                console.error(e.response.data.message);
            } else {
                console.error('Failed to upload file(s)');
            }
        }
    }

    const items = [
        { label: 'Share', key: 'share', icon: <TeamOutlined /> },
        { label: 'Download', key: 'download', icon: <DownloadOutlined /> },
        { label: 'Rename', key: 'rename', icon: <EditOutlined /> },
        { label: 'Copy', key: 'copy', icon: <CopyOutlined /> },
        { label: 'Version History', key: 'versionHistory', icon: <HistoryOutlined /> },
        { type: 'divider' },
        { label: 'Information', key: 'information', icon: <InfoCircleOutlined /> },
        { label: 'Delete', key: 'delete', icon: <DeleteOutlined /> }
    ];

    const columns = [
        {
            title: 'Name', dataIndex: 'name', key: 'name', render: (fileName, row) => (
                <span style={{ cursor: 'pointer' }} onClick={() => onFileClicked(row)}>{fileName}</span>
            )
        },
        { title: 'File Size', dataIndex: 'fileSize', key: 'fileSize' },
        { title: 'Owner', dataIndex: 'userId', key: 'owner' },
        { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
        {
            title: 'Action', dataIndex: 'action', key: 'action', render: () => (
                <Dropdown menu={{ items }}>
                    <a><MoreOutlined /></a>
                </Dropdown>
            )
        }
    ];

    const onFileClicked = (row) => {
        const { contentType, id } = row;
        if (contentType == 'text/plain') {
            navigate(`/document/${id}`, { state: { user: currentUser } });
        } else if (contentType == 'image/png') {
            setImage(`data:image/png;base64,${row.base64}`);
            setIsModalOpen(true);
        }
    }

    const onImagePreviewModelCancel = () => {
        setIsModalOpen(false);
        setImage();
    };

    const onImagePreviewModelClose = () => {
        setIsModalOpen(false);
        setImage();
    };

    const onImagePreviewModelOk = () => {
        setIsModalOpen(false);
        setImage();
    };

    return (
        <>
            <Modal
                onCancel={onImagePreviewModelCancel}
                onClose={onImagePreviewModelClose}
                onOk={onImagePreviewModelOk}
                open={isModalOpen}
                title='Image Preview'
            >
                <Image src={image} preview={false} />
            </Modal>

            <Layout style={{ height: '100%', padding: 10 }}>
                <h1>Welcome {currentUser ? currentUser.firstName : ''}!</h1>
                <Content style={{ margin: 10, backgroundColor: '#fff', padding: '20px', borderRadius: 10 }}>
                    <div>
                        <h2>Import Files</h2>
                        <Dragger customRequest={uploadFile} name='file' showUploadList={false}>
                            <p className='ant-upload-drag-icon'><InboxOutlined /></p>
                            <p className='ant-upload-text'>Click or drag files to upload</p>
                        </Dragger>
                    </div>
                </Content>
                <Content style={{ margin: 10, backgroundColor: '#fff', padding: '20px', borderRadius: 10 }}>
                    <Button onClick={onCreateDocument}>Create Document</Button>
                    <h2>Files</h2>
                    <Table columns={columns} dataSource={files} />
                </Content>
            </Layout>
        </>
    );
};

export default DashboardContent;
