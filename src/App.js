import React, { useState, useRef, useEffect } from 'react';
import { Copy, Play, Wand2, Type, Check, Sparkles, Music, Mic, Guitar, ListMusic, Loader2, Bot, MessageSquarePlus, XCircle, SpellCheck, Star, ExternalLink } from 'lucide-react';

// --- ספריות תגיות ---
const israeliTemplates = [
  { label: "היפ הופ ישראלי", tags: "hiphop, Israel, Hebrew, Israeli hiphop" },
  { label: "רוק ישראלי", tags: "Rock, indie rock, israel, israeli, hebrew, guitar, drums, Israeli indie" },
  { label: "פופ ישראלי", tags: "Pop, rhitmic, israeli, Hebrew, modern pop" },
  { label: "מזרחית", tags: "Middle east, arabic, israeli, hebrew, ethnic" },
  { label: "חסידי", tags: "Hasidi, klezmer, Jewish, chasidic, enargy, dance, israeli folk" },
  { label: "אלקטרוני", tags: "electronic, dance, Israel electronic, hebrew, trance" },
  { label: "פופ רוק ישראלי", tags: "israeli pop rock, pop, rock, modern, hebrew, israeli" }
];

const structureTags = ["[Intro]", "[Verse 1]", "[Chorus]", "[Pre-Chorus]", "[Verse 1 Bridge]", "[Solo]", "[Bridge]", "[Hook]", "[Break]", "[Quiet Chorus]", "[Power Chorus]", "[End]", "[Outro]", "[Vocalist: Female]", "[Vocalist: Male]", "[Harmony: Yes]", "[Chorus - Live performance, crowd singing]", "[Arena Rock]", "[Studium Reverb]", "[spoken word]", "[Drop]"];
const genreTags = ["[Pop]", "[Rock]", "[Hip-Hop]", "[Electronic]", "[Jazz]", "[Classical]", "[Folk]", "[R&B]", "[Country]", "[Reggae]", "[House]", "[Techno]", "[Ambient]", "[Dubstep]", "[Trance]", "[Alternative Rock]", "[Hard Rock]", "[Indie Rock]", "[Male Vocals]", "[Female Vocals]", "[Harmonies]", "[Choir]", "[Whispered Vocals]", "[Powerful Vocals]", "[Smooth Vocals]", "[Israeli]", "[Russian]", "[Arabic]", "[Ballad]", "[Emotional]", "[Cinematic]", "[upbeat]", "[Shanson]", "[beatbox]"];
const instrumentTags = ["[Acoustic Guitar]", "[Electric Guitar]", "[Distorted Guitar]", "[Guitar Solo]", "[Bass Guitar]", "[Slap Bass]", "[Upright Bass]", "[Violin]", "[Strings]", "[String Quartet]", "[Cello]", "[Harp]", "[Ukulele]", "[Banjo]", "[Mandolin]", "[Sitar]", "[Drums]", "[Acoustic Drums]", "[Electronic Drums]", "[808s]", "[808 Bass]", "[Drum Machine]", "[TR-909]", "[Breakbeat]", "[Brush Drums]", "[Percussion]", "[Taiko Drums]", "[Congas]", "[Bongos]", "[Tambourine]", "[Handclaps]", "[Saxophone]", "[Tenor Sax]", "[Alto Sax]", "[Trumpet]", "[Trombone]", "[French Horn]", "[Brass Section]", "[Flute]", "[Clarinet]", "[Harmonica]", "[Accordion]", "[Synth Bass]", "[Arpeggiated Synth]", "[Lead Synth]", "[Synth Stabs]", "[Pad]", "[Pluck Synth]", "[Acid Bass]", "[Supersaw]", "[Wobbly Bass]", "[Glitch]", "[Orchestra]", "[Full Orchestra]", "[Chamber Orchestra]", "[Orchestral Strings]", "[Brass Stabs]", "[Timpani]", "[Choir Vocals]", "[Cinematic Percussion]", "[Baglama]", "[Oud]", "[Darbuka]", "[Balalaika]"];

// --- מילון למילים דו משמעיות לניקוד חלקי ---
const ambiguities = {
  "את": ["אֶת", "אַתְּ"], "אותך": ["אוֹתְךָ", "אוֹתָךְ"], "לך": ["לְךָ", "לָךְ"],
  "שלך": ["שֶׁלְּךָ", "שֶׁלָּךְ"], "בך": ["בְּךָ", "בָּךְ"], "עליך": ["עָלֶיךָ", "עָלַיִךְ"],
  "אליך": ["אֵלֶיךָ", "אֵלַיִךְ"], "ממך": ["מִמְּךָ", "מִמֵּךְ"], "אותו": ["אוֹתוֹ"], 
  "אותה": ["אוֹתָהּ"], "כל": ["כָּל", "כֹּל"], "עם": ["עִם", "עַם"],
  "ילד": ["יֶלֶד", "יָלַד"], "ספר": ["סֵפֶר", "סַפָּר", "סִפֵּר"], "בוקר": ["בֹּקֶר", "בּוֹקֵר"],
  "ערב": ["עֶרֶב", "עָרֵב", "עֲרָב"], "אוכל": ["אוֹכֵל", "אֹכֶל"], "שער": ["שַׁעַר", "שֵׂעָר", "שִׁעֵר"],
  "חלב": ["חָלָב", "חֵלֶב"], "מחר": ["מָחָר", "מָכַר"], "רכב": ["רֶכֶב", "רָכַב"],
  "אור": ["אוֹר", "אוּר"], "קשר": ["קֶשֶׁר", "קָשַׁר"], "שיר": ["שִׁיר", "שָׁיִר"],
  "אלו": ["אֵלּוּ", "אִלּוּ"], "אלה": ["אֵלֶּה", "אֵלָה"], "דבר": ["דָּבָר", "דִּבֵּר", "דֶּבֶר"],
  "שם": ["שֵׁם", "שָׁם", "שָׂם"], "מטה": ["מַטֶּה", "מִטָּה", "מַטָּה"], "רוח": ["רוּחַ", "רֶוַח"],
  "כוח": ["כּוֹחַ", "כּוּחַ"]
};

const genderAmbiguities = {
  "את": { male: "אַתָּה", female: "אַתְּ" },
  "אותך": { male: "אוֹתְךָ", female: "אוֹתָךְ" },
  "לך": { male: "לְךָ", female: "לָךְ" },
  "שלך": { male: "שֶׁלְּךָ", female: "שֶׁלָּךְ" },
  "בך": { male: "בְּךָ", female: "בָּךְ" },
  "עליך": { male: "עָלֶיךָ", female: "עָלַיִךְ" },
  "אליך": { male: "אֵלֶיךָ", female: "אֵלַיִךְ" },
  "ממך": { male: "מִמְּךָ", female: "מִמֵּךְ" },
  "בלעדיך": { male: "בִּלְעָדֶיךָ", female: "בִּלְעָדַיִךְ" },
  "עינייך": { male: "עֵינֶיךָ", female: "עֵינַיִךְ" },
  "מולך": { male: "מוּלְךָ", female: "מוּלֵךְ" },
  "מחכה": { male: "מְחַכֶּה", female: "מְחַכָּה" },
  "בשבילך": { male: "בִּשְׁבִילְךָ", female: "בִּשְׁבִילֵךְ" },
  "דעתך": { male: "דַּעְתְּךָ", female: "דַּעְתֵּךְ" },
  "כולך": { male: "כֻּלְּךָ", female: "כֻּלֵּךְ" },
  "דמותך": { male: "דְּמוּתְךָ", female: "דְּמוּתֵךְ" },
  "ליבך": { male: "לִבְּךָ", female: "לִבֵּךְ" },
  "שמך": { male: "שִׁמְךָ", female: "שְׁמֵךְ" },
  "איתך": { male: "אִתְּךָ", female: "אִתָּךְ" }
};

// --- API Helper ---
const callGeminiAPI = async (prompt) => {
  const apiKey = ""; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const delays = [1000, 2000, 4000, 8000, 16000];
  let lastError;

  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      lastError = error;
      if (attempt < 5) await new Promise(res => setTimeout(res, delays[attempt]));
    }
  }
  throw lastError;
};

export default function App() {
  const [text, setText] = useState("");
  const [songTopic, setSongTopic] = useState("");
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  
  const [isVowelizingFull, setIsVowelizingFull] = useState(false);
  const [isSpellChecking, setIsSpellChecking] = useState(false);
  const [showSpellErrors, setShowSpellErrors] = useState(false);
  
  const [isResolving, setIsResolving] = useState(false);
  const [isFreeNikkud, setIsFreeNikkud] = useState(false);
  const [activePartialIndex, setActivePartialIndex] = useState(null); 
  
  const [selectionData, setSelectionData] = useState(null);
  const [isFetchingWordNikkud, setIsFetchingWordNikkud] = useState(false);
  
  const [contextMenu, setContextMenu] = useState(null);

  const [showCopied, setShowCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const textareaRef = useRef(null);

  // --- Insertion Helpers ---
  const insertStyleTemplate = (tags) => {
    setText((prev) => `STYLE: ${tags}\n${prev}`);
  };

  const insertStructureTag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // חלופה חכמה: אם תיבת הטקסט מוסתרת במצבי עריכה, התגית תתווסף לסוף השיר במקום לא לעבוד
      setText(prev => prev + `\n${tag}\n`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = text.substring(0, start);
    const newlineBefore = beforeText.length > 0 && !beforeText.endsWith('\n') ? '\n' : '';
    const insertion = `${newlineBefore}${tag}\n`;
    const newText = text.substring(0, start) + insertion + text.substring(end);
    setText(newText);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertion.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertTopTag = (tag) => {
    setText((prev) => {
      const trimmedTag = tag.trim();
      if (prev.trimStart().startsWith("[")) {
         const firstLineEnd = prev.indexOf('\n');
         if (firstLineEnd !== -1) {
            const firstLine = prev.substring(0, firstLineEnd);
            const rest = prev.substring(firstLineEnd);
            if (!firstLine.includes(trimmedTag)) return `${firstLine} ${trimmedTag}${rest}`;
            return prev;
         } else {
             if (!prev.includes(trimmedTag)) return `${prev} ${trimmedTag}`;
             return prev;
         }
      } else {
        return `${trimmedTag}\n${prev}`;
      }
    });
  };

  // --- AI Text Generation ---
  const handleGenerateSong = async () => {
    if (!songTopic.trim()) {
      setErrorMessage("נא לרשום נושא לשיר.");
      return;
    }
    setIsGeneratingSong(true);
    setErrorMessage("");
    try {
      const prompt = `אתה פזמונאי מומחה לכתיבת פרומפטים של שירים לבינה מלאכותית SUNO.AI. 
כתוב שיר מלא בנושא: "${songTopic}".
הנחיות קריטיות:
1. השיר חייב להיות אך ורק בשפה העברית (אלא אם התבקש במפורש אחרת בשאילתה), ברמה גבוהה ומודרנית, בדומה לסגנון הלהיטים במצעדי הפזמונים הישראליים.
2. הקפד על חרוזים הגיוניים, זורמים ואומנותיים.
3. מבנה שורות קצרות וקצביות להגייה קלה ומוזיקלית.
4. השתמש בתגיות מבנה כגון [Intro], [Verse 1], [Chorus], [Bridge], [Outro] במקומות המתאימים.
5. החזר רק את הטקסט של השיר, ללא שום הערות, הסברים או הקדמות מצידך, וללא ניקוד כלל (ננקד אותו אחר כך).`;
      
      const generatedSong = await callGeminiAPI(prompt);
      setText(generatedSong);
    } catch (error) {
      setErrorMessage("אירעה שגיאה ביצירת השיר. אנא נסה שוב.");
      console.error(error);
    }
    setIsGeneratingSong(false);
  };

  // --- Full Nikkud (AI) ---
  const handleFullNikkudAI = async () => {
    if (!text.trim()) return;
    setIsVowelizingFull(true);
    setErrorMessage("");
    try {
      const prompt = `אתה מומחה לשפה העברית.
המטרה שלך היא לנקד את הטקסט הבא באופן **מלא ומוחלט** מילה במילה, תוך שמירה על משמעות ההקשר ועל סימני הפיסוק ותגיות באנגלית.
החזר *אך ורק* את הטקסט המנוקד לחלוטין. אל תוסיף הקדמות או הערות.
הטקסט לניקוד מלא:
${text}`;
      const vowelizedText = await callGeminiAPI(prompt);
      setText(vowelizedText);
    } catch (error) {
      setErrorMessage("אירעה שגיאה בניקוד הטקסט.");
    }
    setIsVowelizingFull(false);
  };

  // --- Spell Checking (AI) ---
  const handleSpellCheckAI = async () => {
    if (!text.trim()) return;
    setIsSpellChecking(true);
    setErrorMessage("");
    try {
      const prompt = `אתה עורך לשוני מומחה לשפה העברית. תקן את שגיאות הכתיב בטקסט הבא לצורה התקנית והנכונה.
חשוב מאוד:
1. אל תשנה את תגיות המבנה באנגלית או את המילה STYLE.
2. החזר רק את הטקסט המתוקן נטו.
3. אם יש מילה שגויה לחלוטין שאינך יכול בשום אופן להבין למה התכוון המשורר, עטוף אותה בסוגריים מסולסלים כפולים, לדוגמה: {{שגגיאה}}.
הטקסט:
${text}`;
      const correctedText = await callGeminiAPI(prompt);
      setText(correctedText);
      if(correctedText.includes("{{") && correctedText.includes("}}")) {
         setShowSpellErrors(true);
         setIsResolving(false);
         setIsFreeNikkud(false);
      }
    } catch(error) {
      setErrorMessage("אירעה שגיאה בתיקון הטקסט.");
    }
    setIsSpellChecking(false);
  };

  const endSpellCheckMode = () => {
     setText(text.replace(/{{|}}/g, ''));
     setShowSpellErrors(false);
  };

  // --- Partial Nikkud Modes ---
  const toggleResolveMode = () => {
    setShowSpellErrors(false);
    setIsFreeNikkud(false);
    setIsResolving(!isResolving);
    setActivePartialIndex(null); 
    setContextMenu(null);
  };

  const toggleFreeNikkudMode = () => {
    setShowSpellErrors(false);
    setIsResolving(false);
    setIsFreeNikkud(!isFreeNikkud);
    setActivePartialIndex(null);
    setContextMenu(null);
  }

  const handleWordResolveImmediate = (tokenIndex, selectedNikkud, originalWord) => {
    const tokens = text.split(/(\s+)/);
    tokens[tokenIndex] = tokens[tokenIndex].replace(originalWord, selectedNikkud);
    setText(tokens.join(''));
    setActivePartialIndex(null); 
    setContextMenu(null);
  };

  // --- Right Click / Tap Gender Nikkud (AI / Dict) ---
  const handleContextMenuOpen = async (e, index, token) => {
    if (!isResolving && !isFreeNikkud) return;
    
    // Prevent default context menu (critical for mobile long-press as well)
    if (e.preventDefault) e.preventDefault();
    
    const cleanWord = token.replace(/[.,!?;:()[\]]/g, '');
    
    // חישוב מיקום חכם שלא יחרוג מהמסך בנייד
    let clickX = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
    let clickY = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
    
    setContextMenu({ x: clickX, y: clickY, index, cleanWord, loading: true });

    if (isResolving) {
      if (genderAmbiguities[cleanWord]) {
         setContextMenu({ 
           x: clickX, y: clickY, index, cleanWord, loading: false, 
           male: genderAmbiguities[cleanWord].male, 
           female: genderAmbiguities[cleanWord].female 
         });
         return;
      }

      try {
         const prompt = `נקד את המילה בעברית "${cleanWord}" פעם אחת לפי תחביר של זכר, ופעם אחת לפי תחביר של נקבה. 
  החזר בפורמט המדויק הבא:
  זכר: [מילה]
  נקבה: [מילה]
  ללא שום טקסט נוסף.`;
         const res = await callGeminiAPI(prompt);
         const maleMatch = res.match(/זכר:\s*([א-ת\u0591-\u05C7]+)/);
         const femaleMatch = res.match(/נקבה:\s*([א-ת\u0591-\u05C7]+)/);
         
         setContextMenu(prev => prev ? { 
           ...prev, loading: false, 
           male: maleMatch?.[1] || cleanWord, 
           female: femaleMatch?.[1] || cleanWord 
         } : null);
      } catch(err) {
         setContextMenu(null);
      }
    } else if (isFreeNikkud) {
       try {
        const prompt = `אתה מומחה לשפה העברית. נקד את המילה "${cleanWord}" בכל הדרכים האפשריות הנכונות.
        החזר *אך ורק* את המילים המנוקדות, מופרדות בפסיק, ללא הסברים. מקסימום 5 מילים.`;
        const res = await callGeminiAPI(prompt);
        const options = res.split(',').map(s => s.trim().replace(/[.,!?;:()[\]]/g, '')).filter(Boolean);
        setContextMenu(prev => prev ? {
          ...prev, loading: false,
          freeOptions: options.length > 0 ? options : [cleanWord]
        } : null);
       } catch (err) {
         setContextMenu(null);
       }
    }
  };

  const handleTextSelection = () => {
    if (isResolving || showSpellErrors) return; 
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selected = text.substring(start, end).trim();
      if (selected && !/\s/.test(selected)) {
        const cleanWord = selected.replace(/[.,!?;:()[\]]/g, '');
        let options = [];
        if (ambiguities[cleanWord]) {
           options = ambiguities[cleanWord].slice(0, 2);
        }
        setSelectionData({ start, end, word: selected, cleanWord, options });
      } else {
        setSelectionData(null);
      }
    } else {
      setSelectionData(null);
    }
  };

  const replaceSelectionWithNikkud = (chosenNikkud) => {
    const { start, end } = selectionData;
    const newText = text.substring(0, start) + chosenNikkud + text.substring(end);
    setText(newText);
    setSelectionData(null);

    setTimeout(() => {
      const textarea = textareaRef.current;
      if(textarea) {
        textarea.focus();
        const newCursor = start + chosenNikkud.length;
        textarea.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  const fetchWordOptions = async (wordToNikkud) => {
    setIsFetchingWordNikkud(true);
    try {
      const prompt = `אתה מומחה לשפה העברית. נקד את המילה "${wordToNikkud}" בעד שתי דרכים שונות. אם יש רק דרך אחת נכונה, החזר רק אותה. החזר *אך ורק* את המילים המנוקדות, מופרדות בפסיק, ללא הסברים.`;
      const responseText = await callGeminiAPI(prompt);
      const fetchedOptions = responseText.split(',').map(s => s.trim().replace(/[.,!?;:()[\]]/g, '')).filter(Boolean).slice(0, 2);
      
      setSelectionData(prev => ({ ...prev, options: fetchedOptions.length > 0 ? fetchedOptions : [wordToNikkud] }));
    } catch (error) {
      setErrorMessage("שגיאה במציאת ניקוד מילה.");
    }
    setIsFetchingWordNikkud(false);
  };

  // --- Tools & Copy (Robust fallback for mobile/iframe) ---
  const fallbackCopyTextToClipboard = (textToCopy) => {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // עריכת סגנון כדי למנוע קפיצות מסך בנייד
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopy = () => {
    // מנסה לסמן טקסט ויזואלית אם בתיבת עריכה רגילה
    if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select(); 
    }
    
    if (navigator.clipboard && window.isSecureContext) {
       navigator.clipboard.writeText(text).then(() => {
         setShowCopied(true);
       }).catch(() => {
         fallbackCopyTextToClipboard(text);
         setShowCopied(true);
       });
    } else {
       fallbackCopyTextToClipboard(text);
       setShowCopied(true);
    }

    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\[.*?\]|STYLE:.*?\n/g, ''));
      utterance.lang = 'he-IL';
      utterance.rate = 0.75; // הקראה איטית יותר
      window.speechSynthesis.speak(utterance);
    } else {
      alert("הדפדפן שלך אינו תומך בהקראת טקסט.");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0A0A0C] text-gray-200 font-sans selection:bg-purple-500/30 pb-20 relative overflow-x-hidden">
      
      {/* Context Menu Modal for Right Click (Male/Female or Free) */}
      {contextMenu && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setContextMenu(null)} onContextMenu={(e)=>{e.preventDefault(); setContextMenu(null);}}>
          <div className="absolute bg-[#1A1A24] border border-gray-600 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 flex flex-col gap-2 min-w-[150px] max-w-[90vw] animate-in fade-in zoom-in duration-150" 
               style={{ 
                 top: contextMenu.y + 10, 
                 left: contextMenu.x, 
                 transform: 'translateX(-50%)' // מרכז בצורה חכמה שמונעת חריגה שמאלה/ימינה
               }}>
            <div className="text-xs text-gray-400 text-center border-b border-gray-700 pb-2 mb-1">
              {isResolving ? 'בחר ניקוד מגדרי ל:' : 'אפשרויות ניקוד ל:'} <b>{contextMenu.cleanWord}</b>
            </div>
            {contextMenu.loading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              </div>
            ) : (
              <>
                {isResolving && contextMenu.male && (
                  <button onClick={(e) => { e.stopPropagation(); handleWordResolveImmediate(contextMenu.index, contextMenu.male, contextMenu.cleanWord); }} 
                          className="px-4 py-2 hover:bg-blue-500/30 text-blue-300 rounded font-bold text-center border border-transparent hover:border-blue-500/30 transition-all">
                    זכר: {contextMenu.male}
                  </button>
                )}
                {isResolving && contextMenu.female && (
                  <button onClick={(e) => { e.stopPropagation(); handleWordResolveImmediate(contextMenu.index, contextMenu.female, contextMenu.cleanWord); }} 
                          className="px-4 py-2 hover:bg-pink-500/30 text-pink-300 rounded font-bold text-center border border-transparent hover:border-pink-500/30 transition-all">
                    נקבה: {contextMenu.female}
                  </button>
                )}
                {isFreeNikkud && contextMenu.freeOptions && contextMenu.freeOptions.map((opt, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); handleWordResolveImmediate(contextMenu.index, opt, contextMenu.cleanWord); }}
                            className="px-4 py-2 hover:bg-purple-500/30 text-purple-300 rounded font-bold text-center border border-transparent hover:border-purple-500/30 transition-all">
                      {opt}
                    </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#121216] border-b border-white/5 p-4 sticky top-0 z-40 shadow-xl">
        <div className="max-w-[1600px] mx-auto relative flex justify-between items-center min-h-[4rem]">
          
          {/* Title - Right side */}
          <div className="flex flex-col justify-center z-10">
            <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 leading-none mb-1.5">
              MAGTag
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest leading-none hidden sm:block">SUNO.AI PROMPT BUILDER</p>
          </div>
          
          {/* Logo - Centered absolutely */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden bg-[#1A1A24] border border-white/10 p-2 pointer-events-auto">
              <img src="https://www.magstudio.co.il/wp-content/uploads/2020/11/logomag.png" alt="MAGTag Logo" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </div>
          
          {/* Action Buttons - Left aligned */}
          <div className="flex gap-3 z-10">
            <button onClick={handleTTS} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all text-cyan-400 hover:text-cyan-300 border border-cyan-500/20">
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">השמע קריינות</span>
            </button>
          </div>
          
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* אזור "הצעת טקסט" (Top Bar Generator) */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 font-bold whitespace-nowrap px-2">
            <Bot className="w-5 h-5" />
            הצעת טקסט (AI)
          </div>
          <input 
            type="text" 
            value={songTopic}
            onChange={(e) => setSongTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateSong()}
            placeholder="תאר על מה השיר שלך... (לדוגמה: שיר אהבה עצוב על סתיו בירושלים)"
            className="flex-1 w-full bg-[#1A1A24] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-gray-500"
          />
          <button 
            onClick={handleGenerateSong}
            disabled={isGeneratingSong}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 min-w-[150px]"
          >
            {isGeneratingSong ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquarePlus className="w-5 h-5" />}
            {isGeneratingSong ? "כותב..." : "תכתוב טקסט"}
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <XCircle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* אזור העורך והכלים (ימין/מרכז) */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2 flex-wrap gap-3">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Type className="w-5 h-5 text-purple-400" />
                טקסט השיר
              </h2>
              
              {/* סרגל הכלים */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleFullNikkudAI}
                  disabled={isResolving || isFreeNikkud || isVowelizingFull || isSpellChecking || showSpellErrors}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A24] hover:bg-[#232330] rounded-md text-xs font-bold text-gray-300 border border-white/10 hover:border-pink-500/30 disabled:opacity-50 transition-all"
                >
                  {isVowelizingFull ? <Loader2 className="w-3 h-3 text-pink-400 animate-spin" /> : <Wand2 className="w-3 h-3 text-pink-400" />}
                  ניקוד מלא
                </button>

                <button 
                  onClick={toggleFreeNikkudMode}
                  disabled={isResolving || isSpellChecking || isVowelizingFull || showSpellErrors}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border transition-all disabled:opacity-50 ${
                    isFreeNikkud
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                    : 'bg-[#1A1A24] hover:bg-[#232330] text-gray-300 border-white/10 hover:border-yellow-500/30'
                  }`}
                >
                   {isFreeNikkud ? <Check className="w-3 h-3" /> : <Star className="w-3 h-3 text-yellow-400" />}
                   {isFreeNikkud ? 'סיום ניקוד חופשי' : 'ניקוד חופשי'}
                </button>
                
                <button 
                  onClick={handleSpellCheckAI}
                  disabled={isResolving || isFreeNikkud || isSpellChecking || isVowelizingFull || showSpellErrors}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A24] hover:bg-[#232330] rounded-md text-xs font-bold text-gray-300 border border-white/10 hover:border-blue-500/30 disabled:opacity-50 transition-all"
                >
                  {isSpellChecking ? <Loader2 className="w-3 h-3 text-blue-400 animate-spin" /> : <SpellCheck className="w-3 h-3 text-blue-400" />}
                  תיקון שגיאות כתיב
                </button>

                <button 
                  onClick={toggleResolveMode}
                  disabled={showSpellErrors || isFreeNikkud}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border transition-all disabled:opacity-50 ${
                    isResolving 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                    : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30'
                  }`}
                >
                  {isResolving ? <Check className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  {isResolving ? 'סיום מצב ניקוד חלקי' : 'ניקוד זכר נקבה'}
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#121216] border border-white/10 focus-within:border-purple-500/50 transition-colors h-[500px] lg:h-[600px] flex flex-col">
              
              {/* חלונית צפה להצעות ניקוד בהדגשת מילה */}
              {selectionData && !isResolving && !isFreeNikkud && !showSpellErrors && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#1A1A24]/95 backdrop-blur-md border border-purple-500/50 p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center gap-3 z-20 animate-in fade-in slide-in-from-top-4 duration-200 w-[90%] max-w-sm">
                  <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
                    אפשרויות ניקוד ל- "{selectionData.word}":
                  </span>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {selectionData.options.length > 0 ? (
                      selectionData.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => replaceSelectionWithNikkud(opt)}
                          className="px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-100 rounded-lg text-lg font-bold transition-colors border border-purple-500/30 min-w-[60px]"
                        >
                          {opt}
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => fetchWordOptions(selectionData.cleanWord)}
                        disabled={isFetchingWordNikkud}
                        className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-100 rounded-lg text-sm font-bold transition-colors border border-cyan-500/30 flex items-center gap-2"
                      >
                        {isFetchingWordNikkud ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        מצא ניקוד ע"י AI
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Views rendering */}
              {showSpellErrors ? (
                // View 3: Spell check errors overview
                <div className="w-full h-full p-6 text-lg leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-wrap text-gray-300 bg-[#0A0A0C]">
                  <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-red-200 shadow-inner">
                    <div>
                      <strong className="text-red-400 flex items-center gap-2"><SpellCheck className="w-4 h-4"/>זיהינו מילים בעייתיות:</strong> 
                      המילים שהודגשו באדום הן שגיאות חמורות שהמערכת לא הצליחה לתקן. לחץ "סיום תיקון שגיאות" כדי לתקן אותן ידנית בעורך.
                    </div>
                    <button onClick={endSpellCheckMode} className="bg-red-500/20 hover:bg-red-500/40 px-4 py-2 rounded text-white font-bold whitespace-nowrap border border-red-500/50 transition-colors w-full sm:w-auto">
                      סיום תיקון שגיאות
                    </button>
                  </div>
                  {text.split(/({{.*?}})/).map((part, index) => {
                    if(part.startsWith("{{") && part.endsWith("}}")) {
                       return <span key={index} className="text-red-400 bg-red-500/10 border-b-2 border-red-500 font-bold px-1 mx-1 rounded">{part.replace(/{{|}}/g, '')}</span>
                    }
                    return <span key={index}>{part}</span>
                  })}
                </div>
              ) : !isResolving && !isFreeNikkud ? (
                // View 1: Normal Editor
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    handleTextSelection();
                  }}
                  onSelect={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                  placeholder="הקלד את מילות השיר, או השתמש במחולל החכם למעלה כדי לכתוב שיר אוטומטית..."
                  className="w-full h-full bg-transparent text-gray-100 p-6 resize-none focus:outline-none text-lg leading-relaxed placeholder:text-gray-600 custom-scrollbar"
                  dir="auto"
                />
              ) : (
                // View 2: Partial Nikkud (Ambiguity Resolve) OR Free Nikkud
                <div className="w-full h-full p-6 text-lg leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-wrap text-gray-300 bg-[#0A0A0C]">
                  <div className={`p-4 mb-4 border rounded-lg flex items-start gap-3 text-sm shadow-inner ${isResolving ? 'bg-purple-500/10 border-purple-500/20 text-purple-200' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200'}`}>
                    {isResolving ? <Wand2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-400" /> : <Star className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-400" />}
                    <p>
                      {isResolving ? (
                        <>
                          <strong>מצב ניקוד זכר/נקבה פעיל:</strong> לחץ על מילה לבחירת ניקוד רגיל, או <b>לחץ במקש ימני (או ארוכות בנייד)</b> כדי לבחור ניקוד מותאם לזכר/נקבה.<br/>
                          הטקסט נשמר אוטומטית. בסיום לחץ על "סיום מצב ניקוד חלקי".
                        </>
                      ) : (
                        <>
                           <strong>מצב ניקוד חופשי פעיל:</strong> <b>לחץ</b> על כל מילה כדי לראות אפשרויות ניקוד שונות בעזרת ה-AI ולבחור את המתאימה.<br/>
                           הטקסט נשמר אוטומטית. בסיום לחץ על "סיום ניקוד חופשי".
                        </>
                      )}
                    </p>
                  </div>
                  {text.split(/(\s+)/).map((token, index) => {
                    if (!token.trim()) return <span key={index}>{token}</span>;
                    
                    const cleanWord = token.replace(/[.,!?;:()[\]]/g, '');
                    const isAmbiguous = isResolving && ambiguities[cleanWord];
                    const isActive = activePartialIndex === index;
                    
                    if (isAmbiguous || isFreeNikkud) {
                        return (
                          <span key={index} className="relative inline-block">
                            <span 
                              onClick={(e) => {
                                // במובייל אין מקש ימני קל ולכן לחיצה שמאלית רגילה תפתח גם את התפריט החופשי
                                if (isFreeNikkud) handleContextMenuOpen(e, index, token);
                                else if (isAmbiguous) setActivePartialIndex(isActive ? null : index);
                              }}
                              onContextMenu={(e) => handleContextMenuOpen(e, index, token)}
                              className={`inline-block px-1 rounded cursor-pointer font-bold border-b-2 transition-colors ${
                                isActive 
                                  ? 'text-white border-white bg-white/20' 
                                  : isResolving 
                                    ? 'text-pink-400 border-pink-400 bg-pink-400/10 hover:bg-pink-400/20 animate-pulse'
                                    : 'text-yellow-400 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                              }`}
                            >
                              {token}
                            </span>
                            
                            {/* Standard Left Click Menu (Only in Resolve Mode) */}
                            {isActive && isResolving && (
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col bg-[#1A1A24] border border-gray-600 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden z-20 w-max">
                                {ambiguities[cleanWord].map((option, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleWordResolveImmediate(index, option, cleanWord);
                                    }}
                                    className="px-6 py-3 hover:bg-purple-500/30 text-white text-xl font-bold text-center transition-colors border-b border-gray-700 last:border-0"
                                  >
                                    {option}
                                  </button>
                                ))}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActivePartialIndex(null); }}
                                  className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-400"
                                >
                                  סגור חלונית
                                </button>
                              </div>
                            )}
                          </span>
                        );
                    }
                    return <span key={index}>{token}</span>;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* אזור התגיות (שמאל) */}
          <div className="lg:col-span-3 flex flex-col gap-4 lg:h-[600px]">
            <div className="flex flex-col h-full lg:overflow-y-auto gap-4 custom-scrollbar pr-2 pb-2">
              
              {/* טאמפלטים ישראלים */}
              <div className="flex-none flex flex-col bg-[#121216] rounded-2xl border border-white/5 overflow-hidden shadow-lg border-t-2 border-t-yellow-500/50">
                <div className="bg-[#1A1A24] p-3 border-b border-white/5 flex items-center gap-2 text-sm font-bold text-white shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  טאמפלטים ישראלי (הוספה בראש)
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {israeliTemplates.map(template => (
                    <button 
                      key={template.label} 
                      onClick={() => insertStyleTemplate(template.tags)} 
                      className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 hover:text-yellow-200 border border-yellow-500/20 rounded-md text-xs font-bold text-gray-300 transition-all w-full text-right"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* מבנה שיר */}
              <div className="flex-none flex flex-col bg-[#121216] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                <div className="bg-[#1A1A24] p-3 border-b border-white/5 flex items-center gap-2 text-sm font-bold text-white shadow-sm">
                  <ListMusic className="w-4 h-4 text-pink-400" />
                  מבנה שיר (מתווסף בסמן)
                </div>
                <div className="p-3 flex flex-wrap gap-2 content-start">
                  {structureTags.map(tag => (
                    <button key={tag} onClick={() => insertStructureTag(tag)} className="px-3 py-1.5 bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 border border-white/10 rounded-md text-xs font-mono text-gray-400 transition-all text-left" dir="ltr">{tag}</button>
                  ))}
                </div>
              </div>

              {/* ז'אנר וסגנון */}
              <div className="flex-none flex flex-col bg-[#121216] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                 <div className="bg-[#1A1A24] p-3 border-b border-white/5 flex items-center gap-2 text-sm font-bold text-white shadow-sm">
                  <Music className="w-4 h-4 text-cyan-400" />
                  ז'אנר וסגנון (מתווסף בראש)
                </div>
                <div className="p-3 flex flex-wrap gap-2 content-start">
                  {genreTags.map(tag => (
                    <button key={tag} onClick={() => insertTopTag(tag)} className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 rounded-md text-xs font-mono text-gray-400 transition-all text-left" dir="ltr">{tag}</button>
                  ))}
                </div>
              </div>

              {/* כלי נגינה */}
              <div className="flex-none flex flex-col bg-[#121216] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                 <div className="bg-[#1A1A24] p-3 border-b border-white/5 flex items-center gap-2 text-sm font-bold text-white shadow-sm">
                  <Guitar className="w-4 h-4 text-purple-400" />
                  כלי נגינה (מתווסף בראש)
                </div>
                <div className="p-3 flex flex-wrap gap-2 content-start">
                  {instrumentTags.map(tag => (
                    <button key={tag} onClick={() => insertTopTag(tag)} className="px-3 py-1.5 bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 border border-white/10 rounded-md text-xs font-mono text-gray-400 transition-all text-left" dir="ltr">{tag}</button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Buttons at the bottom */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button 
            onClick={handleCopy} 
            className="flex items-center justify-center gap-3 w-full max-w-xl py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-lg font-black shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-1"
          >
            {showCopied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            {showCopied ? 'הטקסט הועתק בהצלחה! מוכן להדבקה ב-SUNO' : 'העתק את כל הטקסט של השיר'}
          </button>
          
          <a 
            href="https://suno.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-3 w-full max-w-xs py-4 bg-[#1A1A24] hover:bg-[#232330] text-gray-200 border border-white/10 rounded-2xl text-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 hover:border-white/30 hover:text-white"
          >
            <ExternalLink className="w-6 h-6 text-gray-400" />
            מעבר ל SUNO
          </a>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}