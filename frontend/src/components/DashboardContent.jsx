import { useEffect, useState } from 'react';
import { Layout, Table, Upload } from 'antd';
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
                        return { key: uuidv4(), name: file.title };
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
        /*
            { title: 'URL', dataIndex: 'imageUrl', key: 'imageUrl', render: (text) => <img src={text} /> },
            { title: 'Owner', dataIndex: 'owner', key: 'owner' },
            { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
            { title: 'File Size', dataIndex: 'fileSize', key: 'fileSize' },
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

    return (
        <Layout style={{ padding: 10, height: '100%' }}>
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
                <h2>Files</h2>
                <Table columns={columns} dataSource={files} />
            </Content>
        </Layout>
    );
};

export default DashboardContent;