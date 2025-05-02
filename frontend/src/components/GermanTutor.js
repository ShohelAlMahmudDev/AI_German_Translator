// src/components/GermanTutor.jsx
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ErrorBoundary from "./ErrorBoundary";
import DrawerMenu from "./DrawerMenu";
import ChatArea from "./ChatArea";
import InputArea from "./InputArea";
import "../GermanTutor.css";

// Sample content for each proficiency level
const sampleContent = {
  A1: `
### A1: Beginner German
**Greetings and Introductions**  
- Hallo! Wie geht es dir? (Hello! How are you?)  
- Ich heiße [Your Name]. (My name is [Your Name].)  
- Guten Morgen! (Good morning!)  

**Vocabulary**  
- Ja (Yes)  
- Nein (No)  
- Danke (Thank you)  

**Practice**  
Try saying: "Ich bin [Your Name]. Wie heißt du?" (I am [Your Name]. What’s your name?)
  `,
  A2: `
### A2: Elementary German
**Everyday Phrases**  
- Ich gehe einkaufen. (I’m going shopping.)  
- Wie viel kostet das? (How much does it cost?)  
- Ich möchte Wasser, bitte. (I’d like water, please.)  

**Grammar Tip**  
Use definite articles:  
- Der (masculine): Der Hund (The dog)  
- Die (feminine): Die Katze (The cat)  
- Das (neuter): Das Haus (The house)  

**Practice**  
Try saying: "Ich möchte ein Brot kaufen." (I’d like to buy a bread.)
  `,
  "B1.1": `
### B1.1: Intermediate German (Part 1)
**Conversational Phrases**  
- Was hast du gestern gemacht? (What did you do yesterday?)  
- Ich habe einen Film gesehen. (I watched a movie.)  
- Kannst du mir helfen? (Can you help me?)  

**Grammar Tip**  
Past tense (Perfekt):  
- Ich habe gegessen. (I have eaten.)  
- Wir sind gelaufen. (We have walked.)  

**Practice**  
Try saying: "Gestern habe ich ein Buch gelesen." (Yesterday, I read a book.)
  `,
  "B1.2": `
### B1.2: Intermediate German (Part 2)
**Conversational Phrases**  
- Ich denke, dass es eine gute Idee ist. (I think it’s a good idea.)  
- Welche Hobbys hast du? (What hobbies do you have?)  
- Ich mag es, zu reisen. (I love to travel.)  

**Grammar Tip**  
Subordinate clauses with "dass":  
- Ich weiß, dass du beschäftigt bist. (I know that you’re busy.)  

**Practice**  
Try saying: "Ich glaube, dass das Wetter morgen schön wird." (I believe that the weather will be nice tomorrow.)
  `,
  "B2.1": `
### B2.1: Upper Intermediate German (Part 1)
**Idiomatic Expressions**  
- Es liegt mir auf der Zunge. (It’s on the tip of my tongue.)  
- Ich habe die Nase voll. (I’m fed up.)  

**Grammar Tip**  
Subjunctive II (Konjunktiv II) for hypothetical situations:  
- Wenn ich reich wäre, würde ich reisen. (If I were rich, I would travel.)  

**Practice**  
Try saying: "Wenn ich mehr Zeit hätte, würde ich Deutsch besser lernen." (If I had more time, I would learn German better.)
  `,
  "B2.2": `
### B2.2: Upper Intermediate German (Part 2)
**Advanced Vocabulary**  
- Die Herausforderung (challenge)  
- Die Gelegenheit (opportunity)  
- Beeindruckend (impressive)  

**Grammar Tip**  
Relative clauses:  
- Das Buch, das ich gestern gekauft habe, ist spannend. (The book that I bought yesterday is exciting.)  

**Practice**  
Try saying: "Die Person, die ich gestern getroffen habe, war sehr nett." (The person I met yesterday was very nice.)
  `,
  "C1.1": `
### C1.1: Advanced German (Part 1)
**Nuanced Vocabulary**  
- Die Vorfreude (anticipation)  
- Der Zufall (coincidence)  
- Sich auf etwas verlassen (to rely on something)  

**Complex Structures**  
- Obwohl es regnet, gehe ich spazieren. (Although it’s raining, I’m going for a walk.)  

**Practice**  
Try saying: "Trotz des schlechten Wetters habe ich einen Spaziergang gemacht." (Despite the bad weather, I went for a walk.)
  `,
  "C1.2": `
### C1.2: Advanced German (Part 2)
**Cultural References**  
- Goethe ist ein berühmter deutscher Dichter. (Goethe is a famous German poet.)  
- Die Weihnachtsmärkte in Deutschland sind wunderschön. (The Christmas markets in Germany are beautiful.)  

**Complex Structures**  
- Je mehr ich lerne, desto besser werde ich. (The more I learn, the better I get.)  

**Practice**  
Try saying: "Je länger ich in Deutschland lebe, desto mehr verstehe ich die Kultur." (The longer I live in Germany, the more I understand the culture.)
  `,
};

const drawerWidth = 280;

const GermanTutor = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [selectedLevel, setSelectedLevel] = useState("A1");

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const levelToLanguageMap = {
    A1: "en",
    A2: "en",
    "B1.1": "es",
    "B1.2": "es",
    "B2.1": "bn",
    "B2.2": "bn",
    "C1.1": "es",
    "C1.2": "es",
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    // Add sample content to chat history as a bot message
    const content = sampleContent[level] || "No content available for this level.";
    setHistory((prev) => [
      ...prev,
      { user: `Selected ${level} level`, bot: content },
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim() || !username.trim()) return;
    const newHistory = [...history, { user: `${username}: ${message}`, bot: "Processing..." }];
    setHistory(newHistory);
    setMessage("");

    try {
      const isWord = message.split(" ").length === 1;
      const endpoint = isWord ? "/correct-word" : "/correct-sentence";
      const body = {
        email: email,
        [isWord ? "word" : "sentence"]: message,
        languages: [levelToLanguageMap[selectedLevel] || "en"],
      };

      const response = await fetch(`https://german-translator-backend.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      }
      const data = await response.json();
      setHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = data;
        return updatedHistory;
      });
    } catch (error) {
      setHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = `Error: ${error.message}`;
        return updatedHistory;
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("chatHistory");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <ErrorBoundary>
      <Box className="app-container">
        <DrawerMenu
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          clearHistory={clearHistory}
          selectedLevel={selectedLevel}
          handleLevelSelect={handleLevelSelect}
        />

        <Box
          className="main-content"
          sx={{
            marginLeft: drawerOpen ? `${drawerWidth}px` : 0,
            width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          }}
        >
          <AppBar position="static" className="app-bar">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer}
                className="icon-button"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className="app-bar-title">
                German Tutor
              </Typography>
            </Toolbar>
          </AppBar>

          <ChatArea history={history} />
          <InputArea
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleKeyPress={handleKeyPress}
          />
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default GermanTutor;