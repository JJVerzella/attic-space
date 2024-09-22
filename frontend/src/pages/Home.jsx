import { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Layout, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Content } = Layout;

function Home() {

    const navigate = useNavigate();
    const [loginForm] = Form.useForm();
    const [formData, setFormData] = useState({});

    const onSignInFormChanged = (_, allValues) => {
        setFormData(allValues);
    };

    const signIn = async () => {
        try {
            /** Remove hardcoded reference to URL */
            const response = await axios.post('http://localhost:8000/api/v1/users/login', formData);
            if (response && response.data && response.data.token) {
                loginForm.resetFields();
                localStorage.setItem('atticspace-token', response.data.token);
                navigate("/dashboard");
            }
        } catch (e) {
            if (e.response && e.response.data) {
                message.error(e.response.data.message);
            } else {
                message.error('An error has occurred in the system. Try again later!')
            }
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '25px', justifyContent: 'center' }}>
                <Image alt='AtticSpace Logo' preview={false} src='/atticspace-black.png' width='300px' />
                <Form
                    name="login"
                    form={loginForm}
                    onValuesChange={onSignInFormChanged}
                    onFinish={signIn}
                >
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
    )
}

export default Home;