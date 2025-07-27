import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Menu, X, Moon, Sun } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [botTyping, setBotTyping] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  const isDark = theme === "dark";

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setBotTyping("");

    try {
      const res = await axios.post("https://telegrambot-znt2.onrender.com/chat", {
        message: input,
      });

      const fullText = res.data.reply;
      let i = 0;
      const interval = setInterval(() => {
        setBotTyping(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
          setMessages((prev) => [...prev, { type: "bot", text: fullText }]);
          setBotTyping("");
          setLoading(false);
        }
      }, 20);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Server error. Try again later." },
      ]);
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

 return (
  <div
    className={`h-screen w-screen overflow-hidden ${
      isDark ? "bg-[#1f1f1f] text-white" : "bg-white text-black"
    }`}
  >
    {/* Header */}
    <header
      className={`fixed top-0 w-full z-40 flex justify-between items-center h-16 px-4 sm:px-6 border-b shadow-md ${
        isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-gray-200 border-gray-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <button className="sm:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="text-lg font-medium">🤖 SmartChatTLDR AI</span>
      </div>
      <button onClick={toggleTheme} className="text-cyan-500 hover:text-cyan-600">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>

    {/* Sidebar */}
    <aside
      className={`fixed sm:static top-0 left-0 h-full w-64 z-30 transition-transform duration-300 transform pt-16 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      } ${isDark ? "bg-[#2c2c2c] border-gray-700" : "bg-gray-100 border-gray-300"} border-r flex flex-col p-4`}
    >
      <div className="flex justify-between items-center mb-6 sm:hidden">
        <h2 className={`text-xl font-semibold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>ChatGPT</h2>
        <button onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>
      <nav className="space-y-2">
        <button className="w-full text-left py-2 px-3 rounded hover:bg-cyan-100 transition">
          Futuristic AI Chat UI
        </button>
        <button className="w-full text-left py-2 px-3 rounded hover:bg-cyan-100 transition">
          Chatbot Integration Tutorial
        </button>
        <button className="w-full text-left py-2 px-3 rounded hover:bg-cyan-100 transition">
          Patna Metro Job Updates
        </button>
      </nav>
      <div className="mt-auto pt-6 border-t text-sm flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-yellow-500 text-black text-sm flex items-center justify-center font-bold">M</span>
        Mahua Bajar
      </div>
    </aside>

    {/* Main Content Area */}
    <div className="sm:ml-64 pt-16 pb-28 h-full flex flex-col">
      {/* Chat Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow text-sm whitespace-pre-wrap ${
                msg.type === "user"
                  ? "bg-cyan-600 text-white"
                  : isDark
                  ? "bg-[#2c2c2c] text-gray-200"
                  : "bg-gray-100 text-black"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {botTyping && (
          <div className="flex justify-start">
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow text-sm whitespace-pre-wrap ${
                isDark ? "bg-[#2c2c2c] text-gray-200" : "bg-gray-100 text-black"
              }`}
            >
              <ReactMarkdown>{botTyping}</ReactMarkdown>
            </div>
          </div>
        )}

        {loading && !botTyping && (
          <div className="text-sm text-gray-400 px-2 animate-pulse">🤖 Typing...</div>
        )}
        <div ref={bottomRef}></div>
      </main>

      {/* Footer Input Area (Fixed Bottom) */}
      <div
        className={`fixed bottom-0 w-full sm:ml-64 z-40 border-t flex flex-col ${
          isDark ? "bg-[#2a2a2a] border-gray-700" : "bg-gray-200 border-gray-300"
        }`}
      >
        <div className="p-4 flex gap-3">
          <input
            className={`flex-grow p-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              isDark ? "bg-[#3a3a3a] text-white" : "bg-white text-black"
            }`}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold shadow text-white"
          >
            Send
          </button>
        </div>
        <div
          className={`text-center py-2 text-sm ${
            isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
          }`}
        >
          Developed with ❤️ by Ranjan Kumar Prajapati
        </div>
      </div>
    </div>
  </div>
);

}
