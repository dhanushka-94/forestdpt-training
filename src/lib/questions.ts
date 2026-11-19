export type Question = {
  id: string;
  level: "beginner" | "medium";
  levelSi: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    level: "beginner",
    levelSi: "මූලික",
    prompt:
      "ඉදිරිපත් කිරීම් (presentations) සඳහා ස්ලයිඩ් සෑදීමට භාවිතා කරන මෘදුකාංගය කුමක්ද?",
    options: ["MS Word", "MS PowerPoint", "Calculator", "Paint"],
    correctIndex: 1,
  },
  {
    id: "q2",
    level: "beginner",
    levelSi: "මූලික",
    prompt: "PowerPoint ස්ලයිඩයකට ඡායාරූපයක් එකතු කරන්නේ කෙසේද?",
    options: [
      "Insert → Pictures",
      "File → Print",
      "View → Zoom",
      "Home → Font",
    ],
    correctIndex: 0,
  },
  {
    id: "q3",
    level: "beginner",
    levelSi: "මූලික",
    prompt: "හොඳ ස්ලයිඩයක තිබිය යුත්තේ කුමක්ද?",
    options: [
      "දිගු ඡේද සහ කුඩා අකුරු",
      "කෙටි කරුණු කිහිපයක් සහ පැහැදිලි ඡායාරූපයක්",
      "වර්ණ රාශියක්",
      "ලියවිල්ල සම්පූර්ණයෙන්ම",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    level: "beginner",
    levelSi: "මූලික",
    prompt:
      "ඡායාරූප, හඬ පණිවිඩ සහ ලිපි යැවීමට වැඩිපුරම භාවිතා කරන ඇප් එක කුමක්ද?",
    options: ["WhatsApp", "Calculator", "Clock", "Contacts"],
    correctIndex: 0,
  },
  {
    id: "q5",
    level: "beginner",
    levelSi: "මූලික",
    prompt: "අන්තර්ජාලයෙන් තොරතුරක් සොයා ගැනීමට භාවිතා කරන්නේ කුමක්ද?",
    options: ["Google", "Gallery", "Calculator", "Radio"],
    correctIndex: 0,
  },
  {
    id: "q6",
    level: "medium",
    levelSi: "මධ්‍යම",
    prompt: "AI (කෘත්‍රිම බුද්ධිය) යනු කුමක්ද?",
    options: [
      "මිනිසුන් මෙන් සිතා පිළිතුරු දිය හැකි පරිගණක තාක්ෂණයක්",
      "අලුත් ජංගම දුරකථනයක්",
      "රූපවාහිනී නාලිකාවක්",
      "බැංකුවක්",
    ],
    correctIndex: 0,
  },
  {
    id: "q7",
    level: "medium",
    levelSi: "මධ්‍යම",
    prompt: "ChatGPT වැනි AI මෙවලමකින් අපට කළ හැක්කේ කුමක්ද?",
    options: [
      "ප්‍රශ්නවලට පිළිතුරු ලබා ගැනීම",
      "ලිපියක් ලියා ගැනීම",
      "ඉංග්‍රීසි ලිපියක් සිංහලට පරිවර්තනය කිරීම",
      "ඉහත සියල්ලම",
    ],
    correctIndex: 3,
  },
  {
    id: "q8",
    level: "medium",
    levelSi: "මධ්‍යම",
    prompt:
      "WhatsApp හෝ Facebook හි ලැබෙන සියලුම පුවත් සහ ඡායාරූප සත්‍ය ද?",
    options: [
      "ඔව්, සියල්ලම සත්‍යයි",
      "නැත, AI මගින් ව්‍යාජ ඡායාරූප පවා සෑදිය හැකි නිසා බෙදා හැරීමට පෙර පරීක්ෂා කළ යුතුයි",
    ],
    correctIndex: 1,
  },
];
