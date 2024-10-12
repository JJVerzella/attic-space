import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Image, Input, Layout, message } from 'antd';
import { register } from '../services/apiService';

const { Content } = Layout;

function Register({ setIsUserSignedIn }) {

    const navigate = useNavigate();
    const [registrationForm] = Form.useForm();
    const [formData, setFormData] = useState({});

    const onRegistrationFormChanged = (_, allValues) => {
        setFormData(allValues);
    }

    const onRegistrationFinished = async () => {
        try {
            const data = await register(formData);
            if (!data.token) return;
            registrationForm.resetFields();
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

    const validateFirstName = (_, value) => {
        if (!value || !value.trim()) {
            return Promise.reject(new Error('Please enter a valid first name'));
        }
        return Promise.resolve();
    };

    const validateLastName = (_, value) => {
        if (!value || !value.trim()) {
            return Promise.reject(new Error('Please enter a valid last name'));
        }
        return Promise.resolve();
    };

    const validateEmailAddress = (_, value) => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!value || !emailRegex.test(value)) {
            return Promise.reject(new Error('Please enter a valid email address'));
        }
        return Promise.resolve();
    }

    const validatePassword = (_, value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value || !passwordRegex.test(value)) {
            return Promise.reject(new Error('Please enter a valid password'));
        }
        return Promise.resolve();
    }

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Content style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '25px', justifyContent: 'center' }}>
                    <Image alt='AtticSpace Logo' preview={false} src='/atticspace-black.png' width='450px' />
                    <Form
                        form={registrationForm}
                        name='Registration'
                        onFinish={onRegistrationFinished}
                        onValuesChange={onRegistrationFormChanged}
                        style={{ width: '450px' }}
                    >
                        <Form.Item name='firstName' rules={[{ required: true, validator: validateFirstName }]}>
                            <Input placeholder='First name' />
                        </Form.Item>
                        <Form.Item name='lastName' rules={[{ required: true, validator: validateLastName }]}>
                            <Input placeholder='Last name' />
                        </Form.Item>
                        <Form.Item name='email' rules={[{ required: true, validator: validateEmailAddress }]}>
                            <Input placeholder='Email' />
                        </Form.Item>
                        <Form.Item name='password' rules={[{ required: true, validator: validatePassword }]}>
                            <Input.Password placeholder='Password' />
                        </Form.Item>
                        <Form.Item><Button block htmlType='submit' type='primary'>Create Account</Button></Form.Item>
                    </Form>
                </Content>
            </Layout>
        </>
    );
}

export default Register;