import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import DashboardHeaderBar from '../components/DashboardHeaderBar';
import DashboardContent from '../components/DashboardContent';
import DashboardSidebar from '../components/DashboardSidebar';

function Dashboard({ setIsUserSignedIn }) {
    const location = useLocation();
    const user = location.state?.user;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardHeaderBar setIsUserSignedIn={setIsUserSignedIn} user={user} />
            <Layout>
                <DashboardSidebar />
                <DashboardContent user={user} />
            </Layout>
        </Layout >

    )
}

export default Dashboard;