
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Sample quotes
const quotes = [
  {
    text: "A good balance between work and rest is essential to productivity.",
    author: "Anonymous",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
  {
    text: "It's not about having time, it's about making time.",
    author: "Anonymous",
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    text: "A healthy outside starts from the inside.",
    author: "Robert Urich",
  }
];

export default function MotivationCard() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  
  useEffect(() => {
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);
  
  return (
    <Card className="col-span-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
      <CardContent className="p-6 flex items-center justify-center">
        <div className="text-center max-w-2xl py-6">
          <p className="text-xl italic mb-2">"{quote.text}"</p>
          <p className="text-sm text-muted-foreground">— {quote.author}</p>
        </div>
      </CardContent>
    </Card>
  );
}
