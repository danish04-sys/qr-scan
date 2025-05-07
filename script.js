const imageUpload = document.getElementById('image-upload');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const scanResultElement = document.getElementById('scan-result');
const errorDisplay = document.getElementById('error-display');

imageUpload.addEventListener('change', handleImageUpload);
document.getElementById('upload-container').addEventListener('click', () => imageUpload.click());

function handleImageUpload(event) {
    const file = event.target.files[0];
    errorDisplay.textContent = '';
    scanResultElement.innerHTML = 'Scanning...';
    previewContainer.style.display = 'none';

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.onload = function() {
                previewContainer.style.display = 'block';
                scanQRCode(previewImage);
            };
            previewImage.onerror = function() {
                errorDisplay.textContent = 'Error loading image.';
                scanResultElement.textContent = 'Upload failed';
                previewContainer.style.display = 'none';
            };
            previewImage.src = e.target.result;
        };
        reader.onerror = function() {
            errorDisplay.textContent = 'Error reading the file.';
            scanResultElement.textContent = 'Upload failed';
            previewContainer.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        scanResultElement.textContent = 'No file selected.';
    }
}

function scanQRCode(imageElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;
    context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
        const scannedText = code.data;
        if (scannedText.startsWith('http://') || scannedText.startsWith('https://')) {
            scanResultElement.innerHTML = `<a href="${scannedText}" target="_blank" class="scan-link">${scannedText}</a>`;
        } else {
            scanResultElement.textContent = scannedText;
        }
        errorDisplay.textContent = '';
    } else {
        scanResultElement.textContent = 'No QR code found';
    }
}
