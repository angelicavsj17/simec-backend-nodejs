const Multer = require('multer')
const multerBlob = Multer({
    storage: Multer.memoryStorage(),
});

module.exports = {
    multerBlob
}