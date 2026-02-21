// ===== ARYMS CHATBOT — Enhanced Smart Matching =====
(function () {
    const toggle = document.getElementById('jarvisToggle');
    const window_ = document.getElementById('jarvisWindow');
    const closeBtn = document.getElementById('jarvisClose');
    const messages = document.getElementById('jarvisMessages');
    const input = document.getElementById('jarvisInput');
    const sendBtn = document.getElementById('jarvisSend');
    const quickReplies = document.getElementById('jarvisQuickReplies');
    let isOpen = false;
    let hasGreeted = false;
    let lastTopicId = null;

    // ===== FOLLOW-UP SUGGESTIONS =====
    const followUps = {
        who: ['skills', 'experience', 'why_hire'],
        skills: ['projects', 'certifications', 'ml'],
        projects: ['experience', 'skills', 'defence'],
        experience: ['projects', 'certifications', 'star'],
        contact: ['resume', 'availability'],
        resume: ['contact', 'skills'],
        certifications: ['education', 'skills'],
        achievements: ['experience', 'fun'],
        education: ['certifications', 'skills'],
        ml: ['projects', 'skills', 'data_science'],
        fullstack: ['projects', 'defence', 'skills'],
        hobbies: ['achievements', 'fun'],
        location: ['contact', 'availability'],
        star: ['experience', 'data_science'],
        defence: ['projects', 'fullstack'],
        data_science: ['star', 'ml', 'certifications'],
        strengths: ['why_hire', 'experience'],
        why_hire: ['projects', 'experience', 'contact'],
        availability: ['contact', 'resume'],
        fun: ['hobbies', 'achievements']
    };

    const topicLabels = {
        who: "Who's Aryan?", skills: 'Skills', projects: 'Projects',
        experience: 'Experience', contact: 'Contact', resume: 'Resume',
        certifications: 'Certifications', achievements: 'Achievements',
        education: 'Education', ml: 'ML & AI', fullstack: 'Full Stack',
        hobbies: 'Hobbies', location: 'Location', star: 'Star Performer',
        defence: 'Defence Work', data_science: 'Data Science',
        strengths: 'Strengths', why_hire: 'Why Hire Aryan?',
        availability: 'Availability', fun: 'Fun Facts'
    };

    // ===== KNOWLEDGE BASE =====
    const knowledge = [
        {
            id: 'who',
            keywords: ['who', 'about', 'aryan', 'tell', 'introduce', 'yourself', 'hello', 'hi', 'hey', 'whats up', 'name', 'you', 'bio', 'background', 'overview', 'summary'],
            response: `So here's the short version — <strong>Aryan Maheshwari</strong> is a CS student at <strong>Rajkiya Engineering College, Kannauj</strong> (AKTU). He's into full stack dev and machine learning, and he's been building stuff since his second year.\n\nHe's interned at a <strong>Ministry of Defence facility</strong>, worked on data science at Oasis Infobyte (got the <strong>Star Performer</strong> tag there), and picked up cybersecurity skills along the way. Basically, he keeps himself busy.`
        },
        {
            id: 'skills',
            keywords: ['skill', 'tech', 'stack', 'language', 'framework', 'tool', 'know', 'can do', 'arsenal', 'programming', 'python', 'java', 'javascript', 'tensorflow', 'pytorch', 'opencv', 'mongodb', 'mysql', 'firebase', 'git', 'html', 'css', 'php', 'yolo', 'azure', 'colab', 'jupyter', 'dsa', 'algorithm'],
            response: `Here's what Aryan works with on the regular:\n\n<strong>Languages:</strong> Python, Java, JavaScript, HTML/CSS, PHP\n<strong>ML & AI:</strong> TensorFlow, PyTorch, OpenCV, YOLO\n<strong>Databases:</strong> MongoDB, Firebase, MySQL\n<strong>Tools:</strong> Git, GitHub, Jupyter, Google Colab, Azure\n<strong>Fundamentals:</strong> OS, DBMS, Networks, DSA, Algorithms\n\nHe's comfortable picking up new tools as needed — that's kind of the point of a CS degree, right?`
        },
        {
            id: 'projects',
            keywords: ['project', 'built', 'build', 'work', 'portfolio', 'deploy', 'app', 'application', 'switch', 'monitor', 'caption', 'face', 'recognition', 'attendance', 'ludo', 'game', 'image caption', 'voice output', 'made', 'create'],
            response: `Aryan's built some cool stuff:\n\n<strong>1. Image Caption Generator</strong> — Deep learning pipeline using CNN + Transformer to generate image captions, with text-to-speech for accessibility. Tech: Python, TensorFlow, PyTorch, gTTS.\n\n<strong>2. Face Recognition Attendance</strong> — Automated attendance using OpenCV + Firebase. Reduced manual effort by 80%.\n\n<strong>3. Ludo Game</strong> — Digital version of the classic board game in Python with multiplayer functionality.`
        },
        {
            id: 'experience',
            keywords: ['experience', 'intern', 'internship', 'job', 'work history', 'company', 'career', 'avnl', 'oasis', 'infobyte', 'edunet', 'ibm', 'cybersecurity', 'data science', 'vehicle factory', 'jabalpur'],
            response: `Three internships so far, each in a different domain:\n\n<strong>AVNL — Vehicle Factory Jabalpur</strong> (Ministry of Defence)\nJul 2025 — Built a switch monitoring panel from scratch on Maya OS. Real-time search, auth, the works.\n\n<strong>Oasis Infobyte</strong> (Virtual)\nMay–Jun 2025 — Data science gig. Shipped three ML projects and earned the Star Performer recognition.\n\n<strong>Edunet Foundation</strong> (IBM SkillsBuild)\nMay–Jun 2025 — Cybersecurity fundamentals. Threat detection, ethical hacking, malware analysis.`
        },
        {
            id: 'contact',
            keywords: ['contact', 'email', 'phone', 'reach', 'connect', 'hire', 'message', 'linkedin', 'github', 'call', 'number', 'mail', 'social', 'touch', 'available'],
            response: `Best ways to reach Aryan:\n\n📧 <strong>Email:</strong> <a href="mailto:aryms083@gmail.com">aryms083@gmail.com</a>\n📱 <strong>Phone:</strong> +91 8791286857\n💻 <a href="https://github.com/Aryms083" target="_blank">GitHub</a> · <a href="https://www.linkedin.com/in/aryan-maheshwari-145442246/" target="_blank">LinkedIn</a>\n\nHe's usually pretty quick to respond — don't hesitate to drop a message.`
        },
        {
            id: 'resume',
            keywords: ['resume', 'cv', 'download', 'pdf', 'document'],
            response: `Here you go — grab the full resume:\n\n<a href="Aryan_Maheshwari_Resume.pdf" target="_blank" style="color: var(--accent); text-decoration: underline; font-weight: 600;">⬇ Download Resume (PDF)</a>\n\nIt's got everything — education, experience, projects, certs, and skills, all in one clean PDF.`
        },
        {
            id: 'certifications',
            keywords: ['cert', 'certification', 'nptel', 'course', 'badge', 'learn', 'iit', 'infosys', 'springboard', 'silver', 'data analytics', 'cloud computing', 'deep learning', 'computer vision'],
            response: `Aryan's collected a solid set of certs — mostly from IITs through NPTEL:\n\n• Data Analytics with Python — IIT Roorkee (Silver)\n• Design & Analysis of Algorithms — IIT Madras\n• Intro to Programming in C — IIT Kanpur\n• Psychology of Learning — IIT Kharagpur (Silver)\n• Emotional Intelligence — IIT Kharagpur (Silver)\n• Cloud Computing — IIT Kharagpur\n• Computer Vision / Deep Learning / AI — Infosys Springboard\n• Cybersecurity Essentials — IBM SkillsBuild\n\nThree silvers from NPTEL is pretty solid for an undergrad.`
        },
        {
            id: 'achievements',
            keywords: ['achieve', 'achievement', 'award', 'win', 'won', 'competition', 'nss', 'debate', 'tennis', 'table tennis', 'coordinator', 'champion', 'trophy', 'extracurricular'],
            response: `Here's what Aryan does beyond code:\n\n🏅 <strong>NSS Coordinator</strong> — Organized and led social initiatives at college, which helped him grow as a leader and learn team management.\n🎤 <strong>Debate Competition</strong> — Ranked among top performers at the IEI Debate Competition.\n🏓 <strong>Sports</strong> — Has a good winning streak in Table Tennis — one of his favorite things to do outside coding.`
        },
        {
            id: 'education',
            keywords: ['education', 'college', 'university', 'degree', 'study', 'school', 'aktu', 'kannauj', 'btech', 'b.tech', 'engineering', 'undergraduate', 'cse', 'computer science', 'graduating', 'graduation'],
            response: `<strong>B.Tech in Computer Science & Engineering</strong>\nRajkiya Engineering College, Kannauj\nDr. APJ Abdul Kalam Technical University (AKTU)\n2022 – 2026\n\nHe scored A+ in both 10th and 12th (CBSE), and has been stacking up NPTEL certifications from various IITs throughout college.`
        },
        {
            id: 'ml',
            keywords: ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning', 'neural', 'model', 'training', 'prediction', 'classification', 'cnn', 'transformer'],
            response: `Aryan's pretty deep into ML and AI. Here's what he works with:\n\n• <strong>TensorFlow & PyTorch</strong> for building and training models\n• <strong>OpenCV & YOLO</strong> for computer vision tasks\n• <strong>CNNs + Transformers</strong> for his image captioning project\n• <strong>Data science workflows</strong> — cleaning data, EDA, model evaluation\n\nHe's built real systems with these — not just tutorial projects. The caption generator and face recognition system are good examples.`
        },
        {
            id: 'fullstack',
            keywords: ['full stack', 'fullstack', 'frontend', 'backend', 'web dev', 'web development', 'website', 'web app', 'server', 'api', 'database'],
            response: `On the web dev side, Aryan handles both ends:\n\n• <strong>Frontend:</strong> HTML, CSS, JavaScript\n• <strong>Backend:</strong> PHP, Python\n• <strong>Databases:</strong> MySQL, MongoDB, Firebase\n• <strong>Deployment:</strong> Maya OS (Linux), GitHub\n\nThe switch monitoring system he built for the Ministry of Defence is probably the best example — full stack, secure, and running on a custom Linux OS.`
        },
        {
            id: 'hobbies',
            keywords: ['hobby', 'hobbies', 'interest', 'free time', 'fun', 'like', 'passion', 'enjoy', 'spare time'],
            response: `Things Aryan genuinely enjoys:\n\n• 💻 <strong>Coding Challenges</strong> — Loves solving problems on coding platforms to sharpen his thinking\n• ♟️ <strong>Chess</strong> — Enjoys the strategy and thinking a few moves ahead\n• 🏓 <strong>Table Tennis</strong> — His favorite way to take a break, fast rallies and quick reflexes`
        },
        {
            id: 'location',
            keywords: ['location', 'where', 'city', 'live', 'based', 'from', 'place', 'india', 'state', 'uttar pradesh'],
            response: `Aryan is from <strong>Uttar Pradesh, India</strong>, currently based at Rajkiya Engineering College in Kannauj.\n\nHe's open to both remote and on-site opportunities — location isn't a dealbreaker for him.`
        },
        {
            id: 'star',
            keywords: ['star performer', 'star', 'recognition', 'best', 'top performer', 'outstanding', 'performer'],
            response: `During his data science internship at <strong>Oasis Infobyte</strong>, Aryan was recognized as a <strong>Star Performer</strong>. He shipped three solid ML projects — Sales Prediction, IRIS Classification, and Unemployment Analysis — and the quality of his work stood out.\n\nNot bad for a summer internship.`
        },
        {
            id: 'defence',
            keywords: ['defence', 'defense', 'military', 'maya os', 'maya', 'avnl', 'vehicle factory', 'ministry', 'switch monitoring', 'admin panel', 'government'],
            response: `Aryan interned at <strong>AVNL — Vehicle Factory Jabalpur</strong>, which falls under the Ministry of Defence. He worked in the IT Center and built a Switch Monitoring & Admin Panel from scratch.\n\nThe system runs on <strong>Maya OS</strong> — that's India's own Linux-based operating system built for defence use. He handled authentication, real-time data, search, and made sure everything was secure enough for defence infrastructure.\n\nPretty serious stuff for an intern.`
        },
        {
            id: 'data_science',
            keywords: ['data science', 'data', 'eda', 'exploratory', 'sales prediction', 'iris', 'unemployment', 'analysis', 'preprocessing'],
            response: `At Oasis Infobyte, Aryan did proper data science work:\n\n• <strong>Sales Prediction</strong> — built ML models to forecast sales\n• <strong>IRIS Classification</strong> — classic ML classification problem\n• <strong>Unemployment Analysis</strong> — analyzed trends in employment data\n\nThe full pipeline — data cleaning, exploratory analysis, feature engineering, model building, and evaluation. He earned the Star Performer tag for this work.`
        },
        {
            id: 'strengths',
            keywords: ['strength', 'strengths', 'soft skill', 'teamwork', 'communication', 'problem solving', 'leadership', 'quality', 'qualities'],
            response: `What makes Aryan tick:\n\n• <strong>Teamwork</strong> — He's worked on teams in college, during internships, and on technical projects. Collaboration comes naturally.\n• <strong>Communication</strong> — He likes explaining technical stuff in a way anyone can follow, even non-tech folks.\n• <strong>Problem Solving</strong> — He enjoys digging into real-world problems and figuring out practical solutions.`
        },
        {
            id: 'why_hire',
            keywords: ['why hire', 'why aryan', 'why should', 'hire', 'recruit', 'stand out', 'different', 'unique', 'special', 'choose'],
            response: `Fair question. Here's the pitch:\n\n• He doesn't just stick to one domain — full stack, ML, cybersecurity, data science. He picks things up fast.\n• He's shipped real projects in a <strong>defence environment</strong>, not just classroom assignments.\n• <strong>Star Performer</strong> at his very first data science internship.\n• He's got 12+ certifications from IITs and industry platforms — shows he's always learning.\n• Beyond tech, he leads — NSS coordinator, debate competitor, table tennis champ.\n\nHe's graduating in 2026 and looking for the right opportunity.`
        },
        {
            id: 'availability',
            keywords: ['available', 'availability', 'when', 'graduate', 'graduating', 'join', 'joining', 'start', 'free', 'open', 'opportunity', 'opportunities', 'looking'],
            response: `Aryan is expected to graduate in <strong>2026</strong> and is actively looking for opportunities — internships, full-time roles, freelance projects, you name it.\n\nHe's open to both remote and on-site work. Best way to reach him is via email at <a href="mailto:aryms083@gmail.com">aryms083@gmail.com</a>.`
        },
        {
            id: 'fun',
            keywords: ['fun fact', 'fun facts', 'random', 'interesting', 'trivia', 'cool', 'surprise', 'quirky', 'tell me something'],
            response: `A few things about Aryan:\n\n• His idea of fun is solving coding challenges on weekends.\n• He earned a <strong>Silver medal in Psychology of Learning</strong> from IIT Kharagpur — a CS student doing psychology courses.\n• He loves table tennis — it's his favorite way to recharge.\n• He enjoys chess and thinks a few moves ahead, both on the board and in code.\n• Coding Challenges, Chess, Table Tennis — that's the hobby lineup.`
        },
        // Casual conversation handlers
        {
            id: 'thanks',
            keywords: ['thank', 'thanks', 'thx', 'appreciate', 'helpful', 'great', 'nice', 'awesome', 'perfect', 'wonderful', 'amazing'],
            response: `Glad I could help! If you've got more questions about Aryan, just ask — I'm not going anywhere. 😄`
        },
        {
            id: 'bye',
            keywords: ['bye', 'goodbye', 'see you', 'later', 'gtg', 'gotta go', 'take care', 'cya'],
            response: `Catch you later! Feel free to come back anytime you want to know more about Aryan. ✌️`
        },
        {
            id: 'joke',
            keywords: ['joke', 'funny', 'laugh', 'humor', 'lol', 'haha', 'make me laugh'],
            response: `Why do programmers prefer dark mode?\n\nBecause light attracts bugs. 🐛\n\n...Anyway, want to know something actually interesting about Aryan? Try asking about his projects or fun facts!`
        },
        {
            id: 'how_are_you',
            keywords: ['how are you', 'how r u', 'hows it going', 'what are you', 'are you real', 'are you ai', 'are you human', 'who are you', 'what can you do'],
            response: `I'm ARYMS — Aryan's personal portfolio assistant! I know pretty much everything about his work, skills, projects, and background.\n\nJust type a question or tap one of the quick buttons below. I'm here to help you get to know Aryan better.`
        }
    ];

    // Fallback responses
    const fallbacks = [
        "Hmm, I'm not sure about that one. Try asking about Aryan's <strong>skills</strong>, <strong>projects</strong>, or <strong>experience</strong> — those I can definitely help with!",
        "That's a bit outside my wheelhouse. I know a lot about Aryan's <strong>education</strong>, <strong>certifications</strong>, and <strong>work history</strong> though — ask away!",
        "Not sure I caught that. How about asking what <strong>tech stack</strong> Aryan uses, or about his <strong>internships</strong>?",
        "I don't have info on that, but I can tell you about Aryan's <strong>projects</strong>, <strong>achievements</strong>, or why you should <strong>hire him</strong>!",
        "Didn't quite get that. Try asking about Aryan's <strong>defence work</strong>, <strong>ML projects</strong>, or his <strong>fun facts</strong>!"
    ];

    // ===== SMART MATCHING ENGINE =====
    function findBestMatch(text) {
        text = text.toLowerCase().replace(/[?!.,;:'"]/g, '').trim();
        const words = text.split(/\s+/);

        let bestMatch = null;
        let bestScore = 0;

        for (const entry of knowledge) {
            let score = 0;

            // Check exact ID match
            if (text === entry.id) {
                return entry;
            }

            // Score based on keyword matches
            for (const keyword of entry.keywords) {
                // Direct substring match in the full query
                if (text.includes(keyword)) {
                    // Longer keyword matches are more specific = higher score
                    score += keyword.length * 2;
                }

                // Individual word matching
                for (const word of words) {
                    if (word === keyword) {
                        score += 10; // Exact word match
                    } else if (word.length > 3 && keyword.startsWith(word)) {
                        score += 5; // Partial prefix match
                    } else if (keyword.length > 3 && word.startsWith(keyword)) {
                        score += 5; // Reverse prefix
                    } else if (word.length > 3 && keyword.includes(word)) {
                        score += 3; // Containment match
                    }
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = entry;
            }
        }

        // Only return if score is meaningful enough
        return bestScore >= 5 ? bestMatch : null;
    }

    // ===== TOGGLE CHAT =====
    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        window_.classList.toggle('open', isOpen);
        toggle.classList.toggle('active', isOpen);
        if (isOpen && !hasGreeted) {
            hasGreeted = true;
            setTimeout(() => {
                addBotMessage("Hey! 👋 I'm <strong>ARYMS</strong> — Aryan's portfolio assistant.\n\nCurious about his projects, skills, or what he's been up to? Just type a question or hit one of the buttons below. I'll do my best to fill you in.", null);
            }, 400);
        }
        if (isOpen) input.focus();
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        window_.classList.remove('open');
        toggle.classList.remove('active');
    });

    // ===== SEND HANDLERS =====
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Quick replies
    quickReplies.addEventListener('click', (e) => {
        const btn = e.target.closest('.jarvis-quick-btn');
        if (!btn) return;
        addUserMessage(btn.textContent);
        processQuery(btn.dataset.query);
    });

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        addUserMessage(text);
        input.value = '';
        processQuery(text);
    }

    function processQuery(text) {
        const typing = showTyping();

        setTimeout(() => {
            typing.remove();
            const match = findBestMatch(text);
            if (match) {
                lastTopicId = match.id;
                addBotMessage(match.response, match.id);
            } else {
                addBotMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)], null);
            }
        }, 600 + Math.random() * 600);
    }

    // ===== MESSAGE RENDERING =====
    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'jarvis-msg jarvis-msg-user';
        div.innerHTML = `<div class="jarvis-msg-bubble">${escapeHtml(text)}</div>`;
        messages.appendChild(div);
        scrollBottom();
    }

    function addBotMessage(html, topicId) {
        const div = document.createElement('div');
        div.className = 'jarvis-msg jarvis-msg-bot';

        let bubbleContent = html.replace(/\n/g, '<br>');

        // Add follow-up suggestions if available
        if (topicId && followUps[topicId]) {
            const suggestions = followUps[topicId];
            let suggestionsHtml = '<div class="jarvis-followups">';
            suggestionsHtml += '<span class="followup-label">You might also ask:</span>';
            for (const sId of suggestions) {
                if (topicLabels[sId]) {
                    suggestionsHtml += `<button class="jarvis-followup-btn" data-query="${sId}">${topicLabels[sId]}</button>`;
                }
            }
            suggestionsHtml += '</div>';
            bubbleContent += suggestionsHtml;
        }

        div.innerHTML = `
      <div class="jarvis-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="jarvis-msg-bubble">${bubbleContent}</div>
    `;
        div.style.opacity = '0';
        div.style.transform = 'translateY(10px)';
        messages.appendChild(div);

        // Attach follow-up button listeners
        const followupBtns = div.querySelectorAll('.jarvis-followup-btn');
        followupBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                const label = btn.textContent;
                addUserMessage(label);
                processQuery(query);
            });
        });

        requestAnimationFrame(() => {
            div.style.transition = 'opacity 0.3s, transform 0.3s';
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
        });
        scrollBottom();
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'jarvis-msg jarvis-msg-bot jarvis-typing';
        div.innerHTML = `
      <div class="jarvis-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="jarvis-msg-bubble">
        <span class="typing-dots"><span></span><span></span><span></span></span>
      </div>
    `;
        messages.appendChild(div);
        scrollBottom();
        return div;
    }

    function scrollBottom() {
        requestAnimationFrame(() => {
            messages.scrollTop = messages.scrollHeight;
        });
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
})();
