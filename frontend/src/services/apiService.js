import axios from 'axios';

const url = import.meta.env.VITE_SERVER_URL;
console.log(url);

const CREATE_DOCUMENT_ENDPOINT = 'api/v1/documents';
const GET_FILES_ENDPOINT = 'api/v1/files';
const REGISTER_ENDPOINT = 'api/v1/users/register';
const SIGNIN_ENDPOINT = 'api/v1/users/login';
const UPLOAD_FILES_ENDPOINT = 'api/v1/files/upload';

const createDocument = async (token) => {
    try {
        const response = await axios.post(`/${CREATE_DOCUMENT_ENDPOINT}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
};

const getDocument = async (token, documentId) => {
    try {
        const response = await axios.get(`/api/v1/documents/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

const getDocumentVersions = async (token, documentId) => {
    try {
        const response = await axios.get(`/api/v1/documents/${documentId}/versions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

const getFiles = async (token) => {
    try {
        const response = await axios.get(`/${GET_FILES_ENDPOINT}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

const register = async (formData) => {
    try {
        const response = await axios.post(
            `/${REGISTER_ENDPOINT}`, formData);
        return response.data;
    } catch (e) {
        throw e;
    }
};

const saveDocument = async (token, documentId, documentContent) => {
    try {
        const response = await axios.patch(`/api/v1/documents/${documentId}`,
            { content: documentContent },
            { headers: { 'Authorization': `Bearer ${token}` }}
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};

const shareDocument = async (token, documentId, emailString) => {
    try {
        const response = await axios.put(`/api/v1/files/${documentId}/share`, {
            headers: { Authorization: `Bearer ${token}` },
            users: [{ email: emailString }]
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

const signIn = async (formData) => {
    try {
        const response = await axios.post(
            `${url}/${SIGNIN_ENDPOINT}`, formData);
        return response.data;
    } catch (e) {
        throw e;
    }
};

const uploadFiles = async (token, formData) => {
    try {
        const response = await axios.post(`/${UPLOAD_FILES_ENDPOINT}`,
            formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
};

export {
    createDocument,
    getDocument,
    getDocumentVersions,
    getFiles,
    register,
    saveDocument,
    shareDocument,
    signIn,
    uploadFiles
};
