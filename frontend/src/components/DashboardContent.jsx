import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image, Layout, Modal, Table, Upload } from 'antd';
import {
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    HistoryOutlined,
    InboxOutlined,
    InfoCircleOutlined,
    TeamOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const { Content } = Layout;
const { Dragger } = Upload;
const url = import.meta.env.VITE_SERVER_URL;

const DashboardContent = () => {

    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                /** Remove hardcoded reference to URL */
                const token = localStorage.getItem('atticspace-token') || '';
                const response = await axios.get(`${url}/api/v1/files/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response && response.data) {
                    setFiles(response.data.map(file => {
                        return {
                            key: uuidv4(),
                            id: file.id,
                            name: file.title,
                            contentType: file.contentType,
                            base64: file.data,
                            fileSize: file.size,
                        };
                    }));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchFiles();
    }, [])

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'File Size', dataIndex: 'fileSize', key: 'fileSize' },
        /*
            { title: 'URL', dataIndex: 'imageUrl', key: 'imageUrl', render: (text) => <img src={text} /> },
            { title: 'Owner', dataIndex: 'owner', key: 'owner' },
            { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
            {
                title: 'Action', dataIndex: 'action', key: 'action', render: () => (
                    <Dropdown menu={{ items }}>
                        <a><MoreOutlined /></a>
                    </Dropdown>
                ),
            }
        */
    ];

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

    const uploadFile = async ({ file }) => {
        const token = localStorage.getItem('atticspace-token') || '';
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(
                `${url}/api/v1/files/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
        } catch (e) {
            console.error('Failed to upload file');
        }
    }

    const createDocument = async () => {
        const token = localStorage.getItem('atticspace-token') || '';
        const response = await axios.post(`${url}/document`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response.data && response.data.id) {
            const documentId = response.data.id;
            navigate(`/document/${documentId}/`);
        }
    }

    const onRowClicked = (row) => {
        const { id, contentType } = row;
        if (contentType == 'text/plain') {
            navigate(`/document/${id}`);
        }
        if (contentType == 'image/png') {
            setIsModalOpen(true);
            setImage('data:image/png;base64,' + row.base64);
        }
    }

    return (
        <>
            <Modal title="Image" open={isModalOpen}>
                <Image src={image} preview={false} />
            </Modal>

            <Layout style={{ padding: 10, height: '100%' }}>
                <h1>Welcome</h1>
                <Content style={{ margin: 10, backgroundColor: '#fff', padding: '20px', borderRadius: 10 }}>
                    <div>
                        <h2>Import Files</h2>
                        <Dragger
                            customRequest={uploadFile}
                            name='file'
                            showUploadList={false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag files to upload</p>
                        </Dragger>
                    </div>
                </Content>
                <Content style={{ margin: 10, backgroundColor: '#fff', padding: '20px', borderRadius: 10 }}>
                    <Button onClick={createDocument}>Create Document</Button>
                    <h2>Files</h2>
                    <Table columns={columns} dataSource={files} onRow={(row) => ({
                        onClick: () => onRowClicked(row)
                    })} />
                </Content>
            </Layout>
        </>
    );
};

export default DashboardContent;