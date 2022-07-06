import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { url } from 'inspector';

const useStyles = makeStyles((theme) => ({
    content: {
        minWidth: 255,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 3),
    },
}));

type CSVFileImportProps = {
    title: string;
};

export default function CSVFileImport({ title }: CSVFileImportProps) {
    const classes = useStyles();
    const [file, setFile] = useState<any>();
    const [uploadUrl, setUploadUrl] = useState<any>();
    const [fileName, setFileName] = useState('');

    const createFile = (file: any) => {
        let reader = new FileReader();
        reader.onload = (e: any) => {
            console.log(e.target.result);
            setFileName(file.name);
            setFile(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const onFileChange = (e: any) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        createFile(files[0]);
    };

    const removeFile = () => {
        setFile('');
    };

    const uploadFile = async (e: any) => {
        // Get the presigned URL
        const response = await axios({
            method: 'GET',
            url: `https://5j0uel8y5i.execute-api.us-east-1.amazonaws.com/dev/import/${fileName}`,
        });
        console.log('Response: ', response.data);
        console.log('Uploading: ', file);
        let binary = atob(file.split(',')[1]);
        let array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        let blobData = new Blob([new Uint8Array(array)], { type: 'text/plain' });
        console.log('Uploading to: ', response.data.url);
        const result = await fetch(response.data.url, {
            method: 'PUT',
            body: blobData,
        });
        console.log('Result: ', result);
        // Final URL for the user doesn't need the query string params
        setUploadUrl('');
        setFile('');
    };
    return (
        <div className={classes.content}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            {!file ? (
                <input type="file" onChange={onFileChange} />
            ) : (
                <div>
                    {!uploadUrl && <button onClick={removeFile}>Remove file</button>}
                    {!uploadUrl && <button onClick={uploadFile}>Upload file</button>}
                </div>
            )}
            {fileName && (
                <Typography variant="subtitle1" gutterBottom>
                    File name: {fileName}
                </Typography>
            )}
        </div>
    );
}
