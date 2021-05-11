module.exports = {

    uploadSiteLogo: async (req, res, next) => {
        console.log('POST /post_pdf/');
        console.log('Files: ', req.files);
        const sharp = require('sharp');
        sharp(req.files[0].buffer).resize({
            fit: sharp.fit.contain,
            width: 200
        }).toBuffer(function (err, buf) {
            if (err) return next(err);

            const encoded = buf.toString('base64');
            console.log(encoded);
            console.log("-....");
            res.status(200).send(encoded);
            // Do whatever you want with `buf`
        });
    }
}