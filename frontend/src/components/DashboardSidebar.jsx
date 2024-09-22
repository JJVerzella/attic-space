import { Layout, Menu } from 'antd';
import {
    CloudServerOutlined,
    DeleteOutlined,
    FileTextOutlined,
    HomeOutlined,
    StarOutlined,
    TeamOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const DashboardSidebar = () => {

    const menuItems = [
        { key: 'home', icon: <HomeOutlined />, label: 'Home' },
        { key: 'files', icon: <FileTextOutlined />, label: 'My Files' },
        { key: 'shared', icon: <TeamOutlined />, label: 'Shared' },
        { key: 'favorites', icon: <StarOutlined />, label: 'Favorites' },
        { key: 'trash', icon: <DeleteOutlined />, label: 'Trash' },
        { key: 'storage', icon: <CloudServerOutlined />, label: 'Storage' },
    ];

    return (
        <Sider theme='light'>
            <Menu items={menuItems}></Menu>
        </Sider>
    );
};

export default DashboardSidebar;