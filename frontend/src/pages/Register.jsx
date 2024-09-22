import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Image, Input, Layout, message } from 'antd';


const { Content } = Layout;

function Register() {

    const navigate = useNavigate();
    const [registrationForm] = Form.useForm();
    const [formData, setFormData] = useState({});

    const onRegistrationFormChanged = (_, allValues) => {
        setFormData(allValues);
    }

    const register = async () => {
        try {
            /** Remove hardcoded reference to URL */
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData);
            console.log(response)
            if (response && response.data && response.data.token) {
                registrationForm.resetFields();
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
                        name='Registration'
                        form={registrationForm}
                        style={{ width: '450px' }}
                        onFinish={register}
                        onValuesChange={onRegistrationFormChanged}
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
                        <Form.Item>
                            <Button block htmlType='submit' type='primary'>Create Account</Button>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </>
    )
}

export default Register;