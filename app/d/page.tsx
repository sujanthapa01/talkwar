'use client'
import { useState, useEffect, useRef } from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { PaperAirplaneIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useUser } from "@/context/userContext";
import {useSessionContext} from '@/context/sessionContext'
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import ReactMarkdown from "react-markdown";
import { Select, SelectItem } from "@heroui/select";
import { title, subtitle } from "@/components/primitives";
// import {createClient} from '@/lib/supabase'

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [language, setLanguage] = useState<string>("");

const session = useSessionContext()
const username = session.user?.user_metadata.full_name
const avatar = session.user?.user_metadata?.avatar_url
console.log(avatar)

  const languages = [
    { key: "Hindi", label: "Hindi" },
    { key: "English", label: "English" },
  ];

  const handleLanguage = (value: string) => {
    setLanguage(value);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (msg?: string) => {
    const messageContent = msg || input.trim();
    if (!messageContent) return;

    const userMessage: Message = { role: "user", content: messageContent };
    setInput("");
    setLoading(true);

    const updatedMessages = [...messages, userMessage];

    setMessages([...updatedMessages, { role: "assistant", content: "Thinking..." }]);

    const userName: string | undefined = username

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, langyage: language, userName}),
      });

      if (!res.body) {
        console.error("No response body");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          const index = newMessages.findLastIndex((msg) => msg.role === "assistant");
          if (index !== -1) {
            newMessages[index] = {
              role: "assistant",
              content: assistantMessage,
            };
          }
          return newMessages;
        });
      }
    } catch (err) {
      console.error("Error while sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto h-[80vh] flex flex-col gap-4 p-4 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white rounded-lg shadow-lg">
      {messages.length === 0 ? (
        <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4f46e5] shadow-2xl border border-indigo-700/20 rounded-xl">
          <CardBody className="flex flex-col items-center justify-center gap-4 text-center text-white">
          <Skeleton isLoaded={Boolean(avatar)} className="rounded-full p-8">
             {avatar ? ( <img
                src={avatar}
                alt="profile"
                className="h-54 w-54 rounded-full p-2 border-2 border-white shadow-lg"
              />) : (<>loading..</>) }
          </Skeleton>
            <h2 className="text-xl font-semibold"> <span className="text-[3rem]"></span> <span className={title({ color: "violet" })}> {user?.user?.name || "there"}</span> ,</h2>
            <p className={subtitle({ class: "mt-4" })}>Ready to start a debate?</p>


            <Select
              className="max-w-xs"
              label="Select Language"
              
              onChange={(e) => handleLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <SelectItem key={lang.key} >
                  {lang.label}
                </SelectItem>
              ))}
            </Select>


            <button
              className={` w-[12rem] h-[3rem] bg-black rounded-full`
            }
              onClick={() =>
                sendMessage(
                  `${language === "English"
                    ? `Hey loser Who you think you are a debate looser once a losser always a looser`
                    : `Oy loser mera naam ${user?.user?.name || "Guest"}.`
                  }`
                )
              }
            >
              Start
            </button>
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="flex-1 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4f46e5] shadow-xl rounded-lg border border-indigo-700/20 ">
            <CardBody className="p-0">
              <ScrollShadow ref={scrollRef} className="h-full px-4 py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <img
                        src="/ai.jpg"
                        alt="AI Avatar"
                        className="h-12 w-12 rounded-full border-white border-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition"
                      />
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 text-sm max-w-xs ${msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white/20 text-white backdrop-blur-sm"
                        }`}
                    >
                      {msg.role === "assistant" && msg.content === "Thinking..." ? (
                        <span className="italic text-gray-300 animate-pulse">Thinking...</span>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <Skeleton isLoaded={Boolean(avatar)} className="rounded-full h-34 w-34">
                        <Avatar
                          src={avatar}
                          alt="User Avatar"
                          className="h-12 w-12 rounded-full border-white border-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition"
                        />
                      </Skeleton>
                    )}
                  </div>
                ))}
              </ScrollShadow>
            </CardBody>
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) sendMessage();
            }}
            className="flex gap-2 bg "
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="write something..."
              className="flex-1 "
              classNames={{
                inputWrapper: " backdrop-blur-md border border-white/20 text-white caret-black",
              }}
            />
            <Button
              isIconOnly
              color="primary"
              type="submit"
              isDisabled={loading}
              className="transition-transform hover:scale-110"
            >

              <PaperAirplaneIcon className="w-5 h-5 text-black" />
            </Button>

            <Button
              isIconOnly
              color="primary"
              type="submit"
              isDisabled={loading}
              className="transition-transform hover:scale-110"
            >

              <BookmarkIcon className="w-5 h-5 text-black" />
            </Button>



          </form>
        </>
      )}
    </div>
  );
}
