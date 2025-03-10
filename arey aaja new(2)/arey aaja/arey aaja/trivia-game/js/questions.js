// script.js

const gameData = {
    levels: [
        {
            type: 'college_trivia',
            question: 'What tech term does this emoji combination represent? 📊 + 🏠',
            options: [
                'Data Storage',
                'Database',
                'Data Center',
                'Data Warehouse'
            ],
            correct: 3,
            question2: 'What is the most popular event organized by GDSC?',
            options2: [
                'Hackathons',
                'Debates',
                'Art Contests',
                'Dance Battles'
            ],
            correct2: 0,
            fact: 'Global Network: GDSC is present in 110+ countries worldwide.',
            correctMeme: 'https://media.giphy.com/media/26FPJGjhefSJuaRhu/giphy.gif',
            wrongMeme: 'https://media.giphy.com/media/6yRVg0HWzgS88/giphy.gif',
            questionsAnswered: [false, false] // Track question completion
        },
        {
            type: 'word_puzzle',
            question: 'Decode this reversed tech word: "TNEMPOLEVED"',
            options: [
                'DEVELOPMENT',
                'DEPLOYMENT',
                'DEPARTMENT',
                'DEPENDENT'
            ],
            correct: 0,
            question2: 'Unscramble the tech term: "OTBR"',
            options2: [
                'BOOT',
                'ROBOT',
                'BYTE',
                'BOLT'
            ],
            correct2: 1,
            fact: 'Open to All: Anyone interested in tech can join GDSC—not just CS students.',
            correctMeme: 'https://media.giphy.com/media/USV0ym3bVWQJJmNu3N/giphy.gif',
            wrongMeme: 'https://media.giphy.com/media/WRQBXSCnEFJIuxktnw/giphy.gif',
            questionsAnswered: [false, false]
        },
        {
            type: 'odd_one_out',
            question: 'Find the odd one out:',
            options: [
                'Python 🐍',
                'JavaScript 📝',
                'HTML 🌐',
                'Java ☕'
            ],
            correct: 2,
            question2: 'Which of these is NOT a programming language?',
            options2: [
                'Python',
                'HTML',
                'Java',
                'C++'
            ],
            correct2: 1,
            fact: 'Networking: Members connect with Google experts and industry professionals.',
            correctMeme: 'https://media.giphy.com/media/QNFhOolVeCzPQ2Mx85/giphy.gif',
            wrongMeme: 'https://media.giphy.com/media/xT9IgwHIxhPyR8jcY0/giphy.gif',
            questionsAnswered: [false, false]
        },
        {
            type: 'riddle',
            question: 'I have keys but open no locks. I have space but no room. You can enter, but you can’t leave. What am I?',
            options: [
                'KeyBoard',
                'Piano',
                'Mouse',
                'Cloud'
            ],
            correct: 0,
            question2: 'What has keys but can’t open locks?',
            options2: [
                'Piano',
                'Map',
                'Clock',
                'USB'
            ],
            correct2: 0,
            fact: 'Events, Campaigns, hackathons?',
            correctMeme: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
            wrongMeme: 'https://media.giphy.com/media/3o7btXv9i4Pnjb1m0w/giphy.gif',
            questionsAnswered: [false, false]
        },
        {
            type: 'fun_tech_facts',
            question: 'Google was initially called BackRub.?',
            options: [
                'True',
                'False'
            ],
            correct: 0,
            question2: 'Which company created the Android operating system?',
            options2: [
                'Apple',
                'Microsoft',
                'Google',
                'IBM'
            ],
            correct2: 2,
            fact: 'Community Impact: Projects focus on solving local and global challenges.',
            correctMeme: 'https://media.giphy.com/media/3oEjHFOscgNwdSRRDy/giphy.gif',
            wrongMeme: 'https://media.giphy.com/media/l1KVaj5UcbHwrBMqI/giphy.gif',
            questionsAnswered: [false, false]
        }
    ],
    motivationalQuotes: [
        "Debug your fears, compile your dreams!",
        "Error 404: Excuse not found",
        "Bug-free? In your dreams!",
        "Life is short, use Python",
        "Eat, Sleep, Code, Repeat",
        "Keep coding, it's cheaper than therapy.",
        "The best error message is the one that never shows up",
        "0% Luck, 100% Debugging.",
        "Programming is like a gym for your brain",
        "The code must go on!"
    ]
};
