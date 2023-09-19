const express = require('express');
const cors = require('cors'); // Importez le module CORS
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://cardowner:cardowner@cluster0.vedknks.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Carte = mongoose.model('Carte', {
    message: String,
    image: Buffer,
    lienImage: String,
});

app.use(express.json());

// Route pour créer une carte
app.post('/cartes', async(req, res) => {
    console.log('tafiditra ato')
    try {
        const { message, imageBase64 } = req.body;

        // Générez un lien unique pour accéder à l'image
        const lienImage = shortid.generate();

        // Convertissez l'image base64 en buffer
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        const nouvelleCarte = new Carte({ message, image: imageBuffer, lienImage });
        await nouvelleCarte.save();

        // Générez le lien complet
        const lienImageComplet = `http://localhost:${port}/image/${lienImage}`;
        console.log(lienImageComplet)

        // Renvoie le lien complet au format JSON
        res.status(201).json({ lienImage: lienImageComplet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: 'Erreur lors de la création de la carte' });
    }
});


// Route pour accéder à l'image via le lien complet
app.get('/image/:lienImage', async(req, res) => {
    try {
        const { lienImage } = req.params;
        const carte = await Carte.findOne({ lienImage });

        if (!carte) {
            return res.status(404).json({ erreur: 'Image introuvable' });
        }

        // Renvoyez l'image au navigateur
        res.contentType('image/jpeg'); // Vous devrez spécifier le type MIME approprié ici
        res.send(carte.image);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            erreur: 'Erreur lors de la récupération de l image '
        });
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});