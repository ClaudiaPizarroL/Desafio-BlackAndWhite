
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp'); //importo jimp

const app = express();
const PORT = 3000; 

//levanto el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});


// Configura una carpeta estática para los archivos públicos
app.use(express.static('assets'));

// Configura la carpeta para recibir datos del formulario
app.use(express.urlencoded({ extended: true }));

//acceder a la Ruta raíz que muestra el formulario HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ruta para procesar la imagen
app.get('/cargar', async (req, res) => {
    const {imagenURL} = req.query;
    console.log(req.query);
    
    // Validar que la URL de la imagen no esté vacía
    if (!imagenURL) {
        return res.status(400).send('Por favor, ingrese una URL o nombre de imagen válido.');
    }

    try {
        // Cargar la imagen desde la URL o directorio local
        const imagen = await Jimp.read(imagenURL);

        // Convertir la imagen a escala de grises
        imagen.greyscale();

        // Redimensionar la imagen a 350px de ancho (manteniendo la relación de aspecto)
        imagen.resize(350, Jimp.AUTO);

        // Generar un nombre de archivo único usando un UUID
        const fileName = `${uuidv4()}.jpeg`;

        // Guardar la imagen procesada en el servidor
        const filePath = path.join(__dirname, 'assets', fileName);
        await imagen.writeAsync(filePath);

        // Devolver la imagen procesada al clientec
        res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al procesar la imagen.');
    }
});

