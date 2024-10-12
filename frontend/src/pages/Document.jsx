import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { notification } from 'antd';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DocumentHeader from '../components/DocumentHeader';
import { getDocument } from '../services/apiService';

const url = import.meta.env.VITE_SERVER_URL;

function Document() {
    const { documentId } = useParams();
    const location = useLocation();
    const quillRef = useRef(null);

    const [content, setContent] = useState();
    const [documentTitle, setDocumentTitle] = useState();
    const [socket, setSocket] = useState();
    const user = location.state?.user;

    const triggerNotification = ({ name }) => {
        notification.open({
            message: 'Collaborator Entered the Document',
            description: `${name} has entered the document`,
            placement: 'topRight'
        })
    }

    useEffect(() => {
        const sock = io(`${url}`);
        setSocket(sock);

        const fetchDocument = async (documentId) => {
            try {
                const token = localStorage.getItem('atticspace-token') || '';
                const data = await getDocument(token, documentId);
                if (!data) return;
                setContent(window.atob(data.data));
                setDocumentTitle(data.title);
                sock.emit('joinRoom', { documentId });
            } catch (e) {
                if (e.response && e.response.data) {
                    console.error(e.response.data.message);
                } else {
                    console.error('Failed to retrieve document');
                }
            }
        };

        fetchDocument(documentId);
        return () => {
            sock.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket && user && user?.firstName) {
            socket.on('joined', (_) => {
                triggerNotification({ name: user.firstName });
            })
        }
    }, [socket, user]);

    useEffect(() => {
        if (socket) {
            socket.on('documentChanges', (e) => {
                setContent(e);
            })
        }
    }, [setContent, socket]);

    const onChange = (value) => {
        setContent(value);
        if (!socket) return;
        socket.emit('documentUpdated', value);
    }

    return (
        <>
            {document ? (
                <>
                    <DocumentHeader documentContent={content} documentId={documentId} documentTitle={documentTitle} setContent={setContent} socket={socket} />
                    <ReactQuill onChange={onChange} ref={quillRef} theme='snow' value={content} />
                </>
            ) : (<p>No document found</p>)}
        </>
    );
}

export default Document;
