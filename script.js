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
        let answered = false;

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
            answered = false;

            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    timeLeftDisplay.textContent = timeLeft;
                } else if (!answered) {
                    clearInterval(timer);
                    answered = true;
                    // Auto move to next question if time runs out
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
            nextBtn.style.cursor = "not-allowed";
            
            // Update progress bar
            const progressPercent = ((index + 1) / questions.length) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update percentage
            updatePercentage();
            
            startTimer();
        }

        // Handle answer selection
        function selectOption(selected) {
            if (answered) return;
            
            answered = true;
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
            nextBtn.style.cursor = "pointer";
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
     // Arduino Integration
let serialPort = null;
let reader = null;
let writer = null;
let arduinoConnected = false;

// DOM Elements for Arduino
const arduinoModal = document.querySelector('.arduino-modal');
const portSelector = document.getElementById('port-selector');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const closeModalBtn = document.getElementById('close-modal');
const connectionStatus = document.getElementById('connection-status');
const arduinoStatus = document.querySelector('.arduino-status');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');
const arduinoConnectBtn = document.getElementById('arduino-connect-btn');

// Check if Web Serial API is available
if ('serial' in navigator) {
    // Show modal when Arduino button is clicked
    arduinoConnectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        arduinoModal.classList.add('active');
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', () => {
        arduinoModal.classList.remove('active');
    });
    
    // Connect to Arduino
    connectBtn.addEventListener('click', async () => {
        try {
            // Request the user to select a port
            serialPort = await navigator.serial.requestPort({
                filters: [
                    { usbVendorId: 0x2341 }, // Arduino LLC
                    { usbVendorId: 0x2a03 }, // Arduino.org
                    { usbVendorId: 0x1b4f }  // SparkFun
                ]
            });
            
            // Wait for the port to open with specific baud rate
            await serialPort.open({ baudRate: 9600 });
            
            // Set up reader and writer
            writer = serialPort.writable.getWriter();
            reader = serialPort.readable.getReader();
            
            // Update UI
            arduinoConnected = true;
            connectionStatus.textContent = 'Connected to Arduino!';
            connectionStatus.style.color = '#4caf50';
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
            statusDot.classList.add('connected');
            statusText.textContent = 'Arduino: Connected';
            
            // Send initial test command
            sendToArduino('S');
            
            // Listen for data from Arduino
            readSerialData();
            
        } catch (error) {
            console.error('Error connecting to Arduino:', error);
            connectionStatus.textContent = 'Error: ' + error.message;
            connectionStatus.style.color = '#ff4d4d';
        }
    });
    
    // Disconnect from Arduino
    disconnectBtn.addEventListener('click', async () => {
        try {
            if (writer) {
                await writer.releaseLock();
            }
            if (reader) {
                await reader.cancel();
                await reader.releaseLock();
            }
            if (serialPort) {
                await serialPort.close();
            }
            
            // Update UI
            arduinoConnected = false;
            connectionStatus.textContent = 'Disconnected from Arduino';
            connectionStatus.style.color = '#ff4d4d';
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
            statusDot.classList.remove('connected');
            statusText.textContent = 'Arduino: Not Connected';
            
            serialPort = null;
            reader = null;
            writer = null;
            
        } catch (error) {
            console.error('Error disconnecting from Arduino:', error);
            connectionStatus.textContent = 'Error: ' + error.message;
            connectionStatus.style.color = '#ff4d4d';
        }
    });
    
    // Read data from Arduino
    async function readSerialData() {
        try {
            while (serialPort && serialPort.readable) {
                const { value, done } = await reader.read();
                if (done) {
                    reader.releaseLock();
                    break;
                }
                
                // Convert received value to text
                const textDecoder = new TextDecoder();
                const text = textDecoder.decode(value);
                
                // Handle incoming data from Arduino if needed
                console.log('Received from Arduino:', text);
                
                // You can add code here to handle specific commands from Arduino
                if (text.includes('BUTTON_PRESSED')) {
                    // Example: Handle button press from Arduino
                    console.log('Button pressed on Arduino');
                }
            }
        } catch (error) {
            console.error('Error reading from Arduino:', error);
            if (reader) {
                reader.releaseLock();
            }
        }
    }
    
    // Send command to Arduino
    async function sendToArduino(command) {
        if (!arduinoConnected || !writer) {
            console.log('Arduino not connected, cannot send:', command);
            return;
        }
        
        try {
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(command + '\n')); // Add newline for Arduino parsing
            console.log('Sent to Arduino:', command);
        } catch (error) {
            console.error('Error sending to Arduino:', error);
        }
    }
    
    // Send Arduino commands based on quiz events
    function setupArduinoQuizEvents() {
        // Override or extend quiz functions to send Arduino commands
        const originalShowQuestion = showQuestion;
        showQuestion = function(index) {
            originalShowQuestion(index);
            if (arduinoConnected) sendToArduino('QUIZ_STARTED');
        };
        
        const originalSelectOption = selectOption;
        selectOption = function(selected) {
            const result = originalSelectOption(selected);
            if (arduinoConnected) {
                const correct = questions[currentQuestion].answer;
                if (selected === correct) {
                    sendToArduino('CORRECT_ANSWER');
                } else {
                    sendToArduino('WRONG_ANSWER');
                }
            }
            return result;
        };
        
        // Add time warning event
        const originalStartTimer = startTimer;
        startTimer = function() {
            originalStartTimer();
            // Set up time warning at 5 seconds
            if (timer && arduinoConnected) {
                setTimeout(() => {
                    if (timeLeft <= 5 && !answered) {
                        sendToArduino('TIME_WARNING');
                    }
                }, (15 - 5) * 1000);
            }
        };
        
        // Quiz finished event
        const originalShowResultBox = showResultBox;
        showResultBox = function() {
            originalShowResultBox();
            if (arduinoConnected) {
                let percentage = Math.round((score / questions.length) * 100);
                if (percentage >= 50) {
                    sendToArduino('QUIZ_PASSED');
                } else {
                    sendToArduino('QUIZ_FAILED');
                }
            }
        };
    }
    
    // Initialize Arduino quiz events
    setupArduinoQuizEvents();
    
} else {
    console.log('Web Serial API not supported in this browser');
    // Hide Arduino functionality if not supported
    arduinoConnectBtn.style.display = 'none';
    arduinoStatus.style.display = 'none';
}

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
         function troubleshoot() {
      // Redirect to another HTML page
      window.location.href = "troubleshooting.html"; 
    }
         function circut() {
      // Redirect to another HTML page
      window.location.href = "circut.html"; 
    }