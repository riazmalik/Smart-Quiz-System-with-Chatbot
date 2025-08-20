// // Questions data
//         let questions = [
//             {
//                 question: "Which HTML element is semantic for main page content?",
//                 options: [
//                     'div id="main"',
//                     '<section>',
//                     '<main>',
//                     '<article>'
//                 ],
//                 answer: 2
//             },
//             {
//                 question: "Which CSS property changes text color?",
//                 options: [
//                     'font-style',
//                     'color',
//                     'background-color',
//                     'text-decoration'
//                 ],
//                 answer: 1
//             },
//             {
//                 question: "Which JavaScript method writes to the console?",
//                 options: [
//                     'console.write()',
//                     'console.log()',
//                     'log.console()',
//                     'write.console()'
//                 ],
//                 answer: 1
//             },
//             {
//                 question: "Which tag is used for the largest heading?",
//                 options: [
//                     '<h6>',
//                     '<heading>',
//                     '<h1>',
//                     '<head>'
//                 ],
//                 answer: 2
//             },
//             {
//                 question: "Which symbol is used for comments in CSS?",
//                 options: [
//                     '// comment',
//                     '<!-- comment -->',
//                     '/* comment */',
//                     '** comment **'
//                 ],
//                 answer: 2
//             }
//         ];

        // DOM Elements
        const startBtn = document.querySelector('.start-btn');
        const popupInfo = document.querySelector('.popup-info');
        const exitBtn = document.querySelector('.exit-btn');
        const main = document.querySelector('.main');
        const continueBtn = document.querySelector('.continue-btn');
        const quizSection = document.querySelector('.quiz-section');
        const quizBox = document.querySelector('.quiz-box');
        const resultBox = document.querySelector('.result-box');
        const questionText = document.querySelector(".questions-text");
        const optionList = document.querySelector(".option-list");
        const nextBtn = document.querySelector(".next-btn");
        const questionTotal = document.querySelector(".question-total");
        const headerScore = document.querySelector(".header-score");
        const timeLeftDisplay = document.getElementById("time-left");
        const tryAgainBtn = document.querySelector(".tryagain-btn");
        const gotoBtn = document.querySelector(".goto-btn");
        const progressBar = document.querySelector(".progress");
        const livePercentage = document.querySelector(".live-percentage");

        let timer;
        let timeLeft = 15;
        let currentQuestion = 0;
        let score = 0;

        // Show popup
        startBtn.onclick = () => {
            popupInfo.classList.add("active");
            main.classList.add("active");
        };

        // Exit popup
        exitBtn.onclick = () => {
            popupInfo.classList.remove("active");
            main.classList.remove("active");
        };

        // Continue to quiz
        continueBtn.onclick = (e) => {
            e.preventDefault();
            popupInfo.classList.remove("active");
            quizSection.classList.add("active");
            main.classList.remove("active");
            showQuestion(currentQuestion);
        };

        // Update real-time percentage
        function updatePercentage() {
            const percentage = Math.round((score / questions.length) * 100);
            livePercentage.textContent = `${percentage}%`;
            
            // Change color based on percentage
            if (percentage >= 80) {
                livePercentage.style.color = '#4caf50';
            } else if (percentage >= 50) {
                livePercentage.style.color = '#ff9800';
            } else {
                livePercentage.style.color = '#ff4d4d';
            }
        }

        // Timer
        function startTimer() {
            clearInterval(timer);
            timeLeft = 15;
            timeLeftDisplay.textContent = timeLeft;

            timer = setInterval(() => {
                timeLeft--;
                timeLeftDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    if (currentQuestion < questions.length - 1) {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                    } else {
                        showResultBox();
                    }
                }
            }, 1000);
        }

        // Show question
        function showQuestion(index) {
            questionText.innerHTML = questions[index].question;
            optionList.innerHTML = "";

            questions[index].options.forEach((option, i) => {
                const optionTag = document.createElement("div");
                optionTag.classList.add("option");
                optionTag.textContent = option;
                optionTag.onclick = () => selectOption(i);
                optionList.appendChild(optionTag);
            });

            questionTotal.textContent = `${index + 1} of ${questions.length} Questions`;
            headerScore.textContent = `Score: ${score} / ${questions.length}`;
            nextBtn.disabled = true;
            
            // Update progress bar
            const progressPercent = ((index + 1) / questions.length) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update percentage
            updatePercentage();
            
            startTimer();
        }

        // Handle answer selection
        function selectOption(selected) {
            clearInterval(timer);
            let correct = questions[currentQuestion].answer;
            const options = document.querySelectorAll(".option");

            options.forEach(option => option.style.pointerEvents = "none");

            if (selected === correct) {
                score++;
                options[selected].classList.add("correct");
                headerScore.textContent = `Score: ${score} / ${questions.length}`;
            } else {
                options[selected].classList.add("wrong");
                options[correct].classList.add("correct");
            }

            // Update percentage after answering
            updatePercentage();
            
            nextBtn.disabled = false;
        }

        // Next button
        nextBtn.onclick = () => {
            clearInterval(timer);
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                showResultBox();
            }
        };

        // Show result
        function showResultBox() {
            quizBox.style.display = "none";
            resultBox.classList.add("active");

            let percentage = Math.round((score / questions.length) * 100);

            document.querySelector(".score-text").textContent =
                `Your Score ${score} out of ${questions.length}`;
            document.querySelector(".progress-value").textContent = `${percentage}%`;

            // Remove old message if exists
            let oldMessage = document.querySelector(".result-message");
            if (oldMessage) oldMessage.remove();

            // Create Pass/Fail message
            let message = document.createElement("div");
            message.classList.add("result-message");

            if (percentage >= 50) {
                message.textContent = "🎉 Congratulations, You Passed!";
                message.style.color = "green";
                message.style.fontSize = "24px";
                message.style.marginTop = "20px";
            } else {
                message.textContent = "❌ Sorry, You Failed!";
                message.style.color = "red";
                message.style.fontSize = "24px";
                message.style.marginTop = "20px";
            }

            resultBox.appendChild(message);
        }

        // Try Again
        tryAgainBtn.onclick = () => {
            resultBox.classList.remove("active");
            quizBox.style.display = "block";
            currentQuestion = 0;
            score = 0;
            showQuestion(currentQuestion);
            updatePercentage();
        };

        // Go to Home
        gotoBtn.onclick = () => {
            resultBox.classList.remove("active");
            main.classList.remove("active");
            quizSection.classList.remove("active");
            quizBox.style.display = "block";
            currentQuestion = 0;
            score = 0;
            updatePercentage();
        };

        // Chatbot functionality
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
        const chatbotClose = document.querySelector('.chatbot-close-btn');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.querySelector('.chatbot-messages');

        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.toggle('active');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
        });

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                addMessage(message, 'user');
                chatInput.value = '';
                
                // Simulate bot response
                setTimeout(() => {
                    let botResponse = "I'm a quiz assistant. I can help answer questions about the quiz format or rules.";
                    
                    if (message.toLowerCase().includes('score') || message.toLowerCase().includes('point')) {
                        botResponse = `Your current score is ${score} out of ${questions.length}.`;
                    } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('timer')) {
                        botResponse = "You have 15 seconds to answer each question. The timer is shown at the top of the quiz.";
                    } else if (message.toLowerCase().includes('question') && message.toLowerCase().includes('many')) {
                        botResponse = `There are ${questions.length} questions in this quiz.`;
                    } else if (message.toLowerCase().includes('help')) {
                        botResponse = "I can help with questions about: your score, the timer, number of questions, or quiz rules.";
                    }
                    
                    addMessage(botResponse, 'bot');
                }, 1000);
            }
        }

        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chatbot-message');
            messageDiv.classList.add(type === 'user' ? 'user-message' : 'bot-message');
            messageDiv.innerHTML = `<p>${text}</p>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }