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
