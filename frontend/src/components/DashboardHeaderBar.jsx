import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image, Layout } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;

const DashboardHeaderBar = ({ setIsUserSignedIn, user }) => {
    const [_, setCurrentUser] = useState(user);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.setItem('atticspace-token', '');
        setCurrentUser({});
        setIsUserSignedIn(false);
        navigate("/");
    }

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image alt='Logo' preview={false} src='/atticspace-white.png' width={'200px'} />
            <div>
                <Button style={{ marginRight: 10 }}><SettingOutlined /></Button>
                <Button to="/" onClick={logout}><LogoutOutlined /></Button>
            </div>
        </Header>
    );
}

export default DashboardHeaderBar;
