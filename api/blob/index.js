const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuid } = require('uuid');
const config = require('../../config');
const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.blob.azureStorageConnectionString);
const containerClient = blobServiceClient.getContainerClient(config.azure.blob.containerName);
const streamifier = require('streamifier');

const uploadBlob = async ({ ext, data, length }) => {
    return new Promise((resolve, reject) => {
        const blobName = 'patients/' + Math.random().toString().replace(/0\./, '') + '.' + ext;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        let stream = streamifier.createReadStream(data)
        blockBlobClient.uploadStream(stream, length).then((response) => {
            resolve(blobName)
        }).catch((err) => reject(err))
    })
}

const bufferToBlob = (buff) => {
    const json = JSON.stringify({ blob: buff.toString("base64") });
    return json
}

const downloadBlob = async (blobName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const downloadBlockBlobResponse = await blockBlobClient.downloadToBuffer(0);
    return downloadBlockBlobResponse
}

const { Readable } = require('stream');

class BufferStream extends Readable {
    constructor(buffer) {
        super();
        this.buffer = buffer;
    }
    _read() {
        this.push(this.buffer);
        this.push(null);
    }
}

function bufferToStream(buffer) {
    return new BufferStream(buffer);
}


module.exports = {
    uploadBlob,
    bufferToBlob,
    downloadBlob,
    bufferToStream
}