import axios from 'axios';

const CREATE_DOCUMENT_ENDPOINT = 'api/v1/documents';
const GET_FILES_ENDPOINT = 'api/v1/files';
const REGISTER_ENDPOINT = 'api/v1/users/register';
const SIGNIN_ENDPOINT = 'api/v1/users/login';
const UPLOAD_FILES_ENDPOINT = 'api/v1/files/upload';

const createDocument = async (token) => {
    try {
        const response = await axios.post(`:8000/${CREATE_DOCUMENT_ENDPOINT}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
};

const getDocument = async (token, documentId) => {
    try {
        const response = await axios.get(`:8000/api/v1/documents/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

const getDocumentVersions = async (token, documentId) => {
    try {
        const response = await axios.get(`:8000/api/v1/documents/${documentId}/versions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

const getFiles = async (token) => {
    try {
        const response = await axios.get(`:8000/${GET_FILES_ENDPOINT}`, {
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
            `:8000/${REGISTER_ENDPOINT}`, formData);
        return response.data;
    } catch (e) {
        throw e;
    }
};

const saveDocument = async (token, documentId, documentContent) => {
    try {
        const response = await axios.patch(`:8000/api/v1/documents/${documentId}`,
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
        const response = await axios.put(`:8000/api/v1/files/${documentId}/share`, {
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
            `:8000/${SIGNIN_ENDPOINT}`, formData);
        return response.data;
    } catch (e) {
        throw e;
    }
};

const uploadFiles = async (token, formData) => {
    try {
        const response = await axios.post(`:8000/${UPLOAD_FILES_ENDPOINT}`,
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
