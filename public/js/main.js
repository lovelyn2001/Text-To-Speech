// public/scripts.js

let currentUtterance = null; // Track the current speech utterance

document.getElementById('speak-button').addEventListener('click', function() {
    const textInput = document.getElementById('text-input').value;
    if (textInput.trim() === '') {
        alert('Please enter text to speak.');
        return;
    }
    
    // Create a new SpeechSynthesisUtterance
    currentUtterance = new SpeechSynthesisUtterance(textInput);
    currentUtterance.rate = document.getElementById('speed').value; // Set speed from the slider
    
    // Show audio controls
    document.getElementById('audioControls').style.display = 'block';

    // Speak the text
    window.speechSynthesis.speak(currentUtterance);
});

// Event listener for file upload
document.getElementById('upload-button').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            currentUtterance = new SpeechSynthesisUtterance(data.text);
            currentUtterance.rate = document.getElementById('speed').value; // Set speed from the slider
            
            // Show audio controls
            document.getElementById('audioControls').style.display = 'block';

            window.speechSynthesis.speak(currentUtterance);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please select a file to upload.');
    }
});

// Audio speed adjustment functionality
document.getElementById('speed').addEventListener('input', function() {
    if (currentUtterance) {
        currentUtterance.rate = this.value; // Update the rate of the current speech
    }
});

// Play and Pause Control
document.getElementById('play-button').addEventListener('click', function() {
    if (currentUtterance && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume(); // Resume speaking
    } else if (currentUtterance) {
        window.speechSynthesis.speak(currentUtterance); // Speak if not currently speaking
    }
});

document.getElementById('pause-button').addEventListener('click', function() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause(); // Pause speaking
    }
});

// Optional: Hide controls when speech ends
window.speechSynthesis.onend = function() {
    document.getElementById('audioControls').style.display = 'none'; // Hide controls after speech ends
};
