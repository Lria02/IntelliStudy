// Tab switching logic
const reviewerTab = document.getElementById('reviewerTab');
const quizTab = document.getElementById('quizTab');
const reviewerContent = document.getElementById('reviewerContent');
const quizContent = document.getElementById('quizContent');

reviewerTab.addEventListener('click', () => {
    reviewerTab.classList.add('active');
    quizTab.classList.remove('active');
    reviewerContent.style.display = '';
    quizContent.style.display = 'none';
});

quizTab.addEventListener('click', () => {
    quizTab.classList.add('active');
    reviewerTab.classList.remove('active');
    quizContent.style.display = '';
    reviewerContent.style.display = 'none';
});


document.getElementById('fileInput').addEventListener('change', function() {
    const fileNameSpan = document.getElementById('fileName');
    if (this.files.length > 0) {
        fileNameSpan.textContent = this.files[0].name;
    } else {
        fileNameSpan.textContent = "Choose PDF or PPTX";
    }
});

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = "Uploading and generating reviewer...";

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('https://intellistudy.onrender.com/reviewer/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.reviewer) {
            resultDiv.innerHTML = `<h2>Reviewer Output:</h2><pre>${data.reviewer}</pre>`;
        } else if (data.error) {
            // Show detailed error if available
            let errorMsg = data.error;
            if (typeof data.api_response === "object") {
                errorMsg += "<br><pre>" + JSON.stringify(data.api_response, null, 2) + "</pre>";
            }
            resultDiv.innerHTML = "Error: " + errorMsg;
        } else {
            resultDiv.textContent = "Unknown error occurred.";
        }
    } catch (err) {
        resultDiv.textContent = "Request failed: " + err;
    }
});



// Reviewer file input label
document.getElementById('fileInputReviewer').addEventListener('change', function() {
    const fileNameSpan = document.getElementById('fileNameReviewer');
    if (this.files.length > 0) {
        fileNameSpan.textContent = this.files[0].name;
    } else {
        fileNameSpan.textContent = "Choose PDF or PPTX";
    }
});

// Quiz file input label
document.getElementById('fileInputQuiz').addEventListener('change', function() {
    const fileNameSpan = document.getElementById('fileNameQuiz');
    if (this.files.length > 0) {
        fileNameSpan.textContent = this.files[0].name;
    } else {
        fileNameSpan.textContent = "Choose PDF or PPTX";
    }
});

// Reviewer form submit
document.getElementById('uploadFormReviewer').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInputReviewer');
    const resultDiv = document.getElementById('resultReviewer');
    resultDiv.textContent = "Uploading and generating reviewer...";

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('https://intellistudy.onrender.com/reviewer/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.reviewer) {
            resultDiv.innerHTML = `<h2>Reviewer Output:</h2><pre>${data.reviewer}</pre>`;
        } else if (data.error) {
            let errorMsg = data.error;
            if (typeof data.api_response === "object") {
                errorMsg += "<br><pre>" + JSON.stringify(data.api_response, null, 2) + "</pre>";
            }
            resultDiv.innerHTML = "Error: " + errorMsg;
        } else {
            resultDiv.textContent = "Unknown error occurred.";
        }
    } catch (err) {
        resultDiv.textContent = "Request failed: " + err;
    }
});

// Quiz form submit
document.getElementById('uploadFormQuiz').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInputQuiz');
    const resultDiv = document.getElementById('resultQuiz');
    resultDiv.textContent = "Uploading and generating quiz...";

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('https://intellistudy.onrender.com/quiz/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.quiz) {
            resultDiv.innerHTML = `<h2>Quiz Output:</h2><pre>${data.quiz}</pre>`;
        } else if (data.error) {
            let errorMsg = data.error;
            if (typeof data.api_response === "object") {
                errorMsg += "<br><pre>" + JSON.stringify(data.api_response, null, 2) + "</pre>";
            }
            resultDiv.innerHTML = "Error: " + errorMsg;
        } else {
            resultDiv.textContent = "Unknown error occurred.";
        }
    } catch (err) {
        resultDiv.textContent = "Request failed: " + err;
    }
});
