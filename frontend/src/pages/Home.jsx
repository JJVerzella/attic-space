import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Image, Input, Layout, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { signIn } from '../services/apiService';

const { Content } = Layout;

function Home({ setIsUserSignedIn }) {
    const navigate = useNavigate();
    const [loginForm] = Form.useForm();
    const [formData, setFormData] = useState({});

    const onSignInFormChanged = (_, allValues) => {
        setFormData(allValues);
    };

    const onSignInFinished = async () => {
        try {
            const data = await signIn(formData);
            if (!data.token) return;
            loginForm.resetFields();
            setIsUserSignedIn(true);
            localStorage.setItem('atticspace-token', data.token);
            navigate("/dashboard", { state: { user: data } });
        } catch (e) {
            if (e.response && e.response.data) {
                message.error(e.response.data.message);
            } else {
                message.error('An error has occurred in the system. Please try again later!');
            }
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '25px', justifyContent: 'center' }}>
                <Image alt='AtticSpace Logo' preview={false} src='/atticspace-black.png' width='300px' />
                <Form form={loginForm} name="login" onFinish={onSignInFinished} onValuesChange={onSignInFormChanged}>
                    <Form.Item name='email' rules={[{ required: true, message: 'Email address required' }]}>
                        <Input prefix={<UserOutlined />} placeholder='Email' />
                    </Form.Item>
                    <Form.Item name='password' rules={[{ required: true, message: 'Password required' }]}>
                        <Input prefix={<LockOutlined />} placeholder='Password' type="password" />
                    </Form.Item>
                    <Form.Item>
                        <Button block type='primary' htmlType='submit'>
                            Sign In
                        </Button>
                        Don't have an account? <Link to='/register'>Sign Up</Link>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

export default Home;
