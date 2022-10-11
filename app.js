const express = require('express')
const multer = require('multer')
const axios = require('axios')
const rpimatrix = require('rpi-led-matrix');

const upload = multer({ dest: 'uploads/' })

const matrix = new rpimatrix.LedMatrix(
	{
		...rpimatrix.LedMatrix.defaultMatrixOptions(),
		rows: 64,
		cols: 64,
		hardwareMapping: rpimatrix.GpioMapping.AdafruitHatPwm,
		limitRefreshRateHz: 150,
		pwmDitherBits: 1,
		disableHardwarePulsing: true
	},
	{
		...rpimatrix.LedMatrix.defaultRuntimeOptions(),
		gpioSlowdown: 4,
	}
);

matrix.clear().brightness(100).sync()

const app = express()
const port = 3000
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static("public"));
app.use('/images', express.static('public/images'))

app.get('/', (req, res) => {
	matrix
		.clear() // clear the display
		.brightness(100) // set the panel brightness to 100%
		.fgColor(0x0000ff) // set the active color to blue
		.fill() // color the entire diplay blue
		.fgColor(0xffff00) // set the active color to yellow
		// draw a yellow circle around the display
		.drawCircle(matrix.width() / 2, matrix.height() / 2, matrix.width() / 2 - 1)
		// draw a yellow rectangle
		.drawRect(
			matrix.width() / 4,
			matrix.height() / 4,
			matrix.width() / 2,
			matrix.height() / 2
		)
		// sets the active color to red
		.fgColor({ r: 255, g: 0, b: 0 })
		// draw two diagonal red lines connecting the corners
		.drawLine(0, 0, matrix.width(), matrix.height())
		.drawLine(matrix.width() - 1, 0, 0, matrix.height() - 1)
		.sync();

	// const baseBuffer = [...Array(matrix.width() * matrix.height() * 3).keys()];

	// url = 'https://www.theverge.com/_next/image?url=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2F1Dgd5w8TiOXzOnuZAKyQNnetDME%3D%2F0x0%3A2040x1360%2F2400x1920%2Ffilters%3Afocal(1020x680%3A1021x681)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F24099572%2F226341_Mark_Zuckerberg_Decoder_WJoel.jpg&w=640&q=75'

	// const response = await axios.get(url,  { responseType: 'arraybuffer' })
	// const buffer = Buffer.from(response.data, "utf-8")

	// matrix.afterSync(() => {
	// 	matrix.drawBuffer(buffer);
	// 	setTimeout(() => matrix.sync(), 0);
	// });

	// matrix.sync();
	res.send('Hello World!')
	// 	res.send(`<form action="/image" method="post" enctype="multipart/form-data">
	// 	<input type="file" name="uploaded_file" />
	// 	<input type="submit" value="Get me the stats!">
	// </form>`)
})

app.post('/image', upload.single('uploaded_file'), (req, res) => {
	if (!req.file) {
		console.log("No file received");
		return res.send({
			success: false
		});
	} else {
		console.log('file received');
		console.log(req.file.originalname)
		return res.send({
			success: true
		})
	}
})