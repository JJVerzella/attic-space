import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentHeader from '../components/DocumentHeader';
import axios from 'axios';
import { io } from 'socket.io-client';
import { notification } from 'antd';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


const url = import.meta.env.VITE_SERVER_URL;

function Document() {
    const quillRef = useRef(null);
    const { documentId } = useParams();
    const [content, setContent] = useState();

    /* Socket.io code */
    const [socket, setSocket] = useState();
    /* End Socket.io code*/

    const triggerNotification = ({name}) => {
        notification.open({
            message: 'User Joined Document',
            description: `${name} has entered the document`,
            placement: 'topRight'
        })
    }

    useEffect(() => {
        /* Socket.io code */
        const sock = io(`${url}`);
        setSocket(sock);
        /* End Socket.io code */

        const fetchDocument = async (documentId) => {
            const token = localStorage.getItem('atticspace-token') || '';
            const response = await axios.get(`${url}/document/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response && response.data) {
                setContent(window.atob(response.data.data));
                sock.emit('joinRoom', { documentId });
            }
        };

        fetchDocument(documentId);

        return () => {
            sock.disconnect();
            console.log('Socket disconnected');
        }
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('joined', (e) => {
                triggerNotification({name: 'JJ'})
            })
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('documentChanges', (e) => {
                setContent(e);
            })
        }
    }, [socket]);

    const onChange = (value, delta) => {
        setContent(value);
        if (!socket) return;
        socket.emit('documentUpdated', value);
    }

    return (
        <>
            {document ? (
                <>
                    <DocumentHeader socket={socket} documentId={documentId} documentTitle={document.title} documentContent={content} />
                    <ReactQuill ref={quillRef} theme='snow' onChange={onChange} value={content} />
                </>
            ) : (<p>No document found</p>)}
        </>
    );
}

export default Document;