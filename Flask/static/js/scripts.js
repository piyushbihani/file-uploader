const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

let selectedFiles = [];

// Open file dialog when drop zone is clicked
dropZone.addEventListener('click', () => fileInput.click());

// Handle file selection
fileInput.addEventListener('change', handleFiles);
dropZone.addEventListener('dragover', (e) => e.preventDefault());
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer);
});

function handleFiles(event) {
    const files = event.files || event.target.files;

    for (const file of files) {
        if (!selectedFiles.find(f => f.name === file.name)) {
            selectedFiles.push(file);
            displayFile(file);
        }
    }

    updateUploadButtonState();
}

function displayFile(file) {
    const li = document.createElement('li');
    li.textContent = file.name;

    const removeBtn = document.createElement('span');
    removeBtn.textContent = '✖';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => removeFile(file.name, li));

    li.appendChild(removeBtn);
    fileList.appendChild(li);
}

function removeFile(fileName, listItem) {
    selectedFiles = selectedFiles.filter(f => f.name !== fileName);
    fileList.removeChild(listItem);
    updateUploadButtonState();
}

function updateUploadButtonState() {
    uploadBtn.disabled = selectedFiles.length === 0;
}

// Upload files with progress tracking
uploadBtn.addEventListener('click', () => {
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files[]', file));

    // Disable the upload button during the upload
    uploadBtn.disabled = true;

    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    // Track progress
    xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    });

    xhr.onload = () => {
        if (xhr.status === 200) {
            // Redirect to success page after upload
            document.body.innerHTML = xhr.responseText;
        } else {
            alert('An error occurred while uploading files.');
        }
        uploadBtn.disabled = false;
    };

    xhr.onerror = () => {
        alert('An error occurred during upload.');
        uploadBtn.disabled = false;
    };

    xhr.send(formData);
});
