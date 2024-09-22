import { Layout } from 'antd';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardContent from '../components/DashboardContent';

function Dashboard() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardHeader />
            <Layout>
                <DashboardSidebar />
                <DashboardContent />
            </Layout>
        </Layout >
    )
}

export default Dashboard;