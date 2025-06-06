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
        if (Array.isArray(data.quiz)) {
            // Interactive quiz logic
            let current = 0;
            let userAnswers = [];
            let quiz = data.quiz;

            function showQuestion(idx) {
                const q = quiz[idx];
                resultDiv.innerHTML = `
                    <h2>Question ${q.number} of ${quiz.length}</h2>
                    <div class="quiz-question">
                        <strong>${q.question}</strong><br>
                        <form id="quizAnswerForm">
                            <label><input type="radio" name="answer" value="A" required> A. ${q.choices.A}</label><br>
                            <label><input type="radio" name="answer" value="B"> B. ${q.choices.B}</label><br>
                            <label><input type="radio" name="answer" value="C"> C. ${q.choices.C}</label><br>
                            <label><input type="radio" name="answer" value="D"> D. ${q.choices.D}</label><br>
                            <button type="submit">Submit Answer</button>
                        </form>
                    </div>
                `;
                document.getElementById('quizAnswerForm').onsubmit = function(ev) {
                    ev.preventDefault();
                    const userAnswer = document.querySelector('input[name="answer"]:checked').value;
                    userAnswers.push(userAnswer);
                    current++;
                    if (current < quiz.length) {
                        showQuestion(current);
                    } else {
                        showResults();
                    }
                };
            }

            function showResults() {
                let user_score = 0;
                let correct_answers = [];
                for (let i = 0; i < quiz.length; i++) {
                    const correct = quiz[i].answer;
                    const user = userAnswers[i];
                    if (user === correct) user_score++;
                    correct_answers.push([quiz[i].number, correct, user]);
                }
                let result_message = correct_answers.map(
                    ([idx, correct, user]) =>
                        `Q${idx} correct answer: ${correct}<br>&gt; your answer: ${user} ` +
                        (user === correct ? "✅" : (["A","B","C","D"].includes(user) ? "❌" : ""))
                ).join("<br>");
                resultDiv.innerHTML = `
                    <h2>✅ Quiz Completed!</h2>
                    <div>${result_message}</div>
                    <br>
                    <strong>🎯 You got ${user_score}/${quiz.length} correct!</strong>
                `;
            }

            // Start the quiz
            showQuestion(current);

        } else if (typeof data.quiz === "string") {
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
