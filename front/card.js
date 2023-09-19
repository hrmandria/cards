document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message');
    const userMessage = document.getElementById('userMessage');
    const surpriseTextInput = document.getElementById('surpriseText');
    const scratchText = document.getElementById('scratchText');

    // Écoutez les changements dans l'input text pour le message sur la carte
    messageInput.addEventListener('input', function() {
        const message = messageInput.value;
        userMessage.textContent = message;
    });

    // Écoutez les changements dans l'input text pour le texte à gratter
    surpriseTextInput.addEventListener('input', function() {
        const scratch = surpriseTextInput.value;
        scratchText.textContent = scratch;
    });

    // Sélectionnez le bouton "Sauvegarder l'Image"
    const saveImageButton = document.getElementById('saveImage');

    // Sélectionnez l'élément image que vous avez ajouté
    const cardImage = document.getElementById('cardImage');

    // Ajoutez un écouteur d'événement sur le clic du bouton
    saveImageButton.addEventListener('click', function(event) {
        event.preventDefault();
        // Maintenant, vous pouvez dessiner l'image et les textes sur le canvas
        const canvas = document.getElementById('cardCanvas');
        const context = canvas.getContext('2d');

        var img = new Image();
        img.crossOrigin = "anonymous";
        //img.src = "https://www.dropbox.com/scl/fi/dcpvf60sx8f1yue1wbzsm/img.jpg?rlkey=w3izx551fhd540oxey5lc8fyx&dl=0";
        img.src = "https://drive.google.com/file/d/15B2dLrPqIN0aLXcFPQeENlu6TgprQT9D/view?usp=sharing"
            // Sélectionnez l'image de fond
        const backgroundImage = document.getElementById('cardImage');

        // Effacez le canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Dessinez l'image de fond
        context.drawImage(img, 0, 0, canvas.width, canvas.height);


        // Appliquez le texte sur le canvas
        context.font = '24px Arial';
        context.fillStyle = 'black';
        context.fillText(userMessage.textContent, 20, 50); // Ajustez les coordonnées
        context.font = '20px Arial';
        context.fillStyle = 'red'; // Couleur du texte à gratter
        context.fillText(scratchText.textContent, 20, canvas.height - 20); // Ajustez les coordonnées

        // Récupérez l'image du canvas au format base64
        const imageDataURL = canvas.toDataURL('image/jpeg'); // Vous pouvez spécifier le format souhaité

        // Récupérez le message et le texte à gratter
        const message = messageInput.value;
        const scratch = surpriseTextInput.value;

        // Préparez les données à envoyer
        const data = {
            message,
            scratch,
            imageBase64: imageDataURL, // Image au format base64
        };

        // Envoyez une requête POST au serveur pour sauvegarder l'image
        fetch('http://localhost:3000/cartes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                // Le résultat contiendra le lien complet vers l'image sauvegardée
                const lienImageComplet = result.lienImage;
                console.log(`L'image a été sauvegardée avec succès. Lien : ${lienImageComplet}`);

                // Affichez l'image générée après avoir cliqué sur le bouton
                cardImage.src = lienImageComplet;
            })
            .catch(error => {
                console.error(error);
                alert('Une erreur s\'est produite lors de la sauvegarde de l\'image.');
            });
    });
});