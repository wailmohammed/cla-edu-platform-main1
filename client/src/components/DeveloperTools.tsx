import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Search, BookOpen, Code, Zap } from "lucide-react";
import { toast } from "sonner";

interface CheatSheet {
  id: number;
  language: string;
  title: string;
  content: string;
  category: string;
}

interface CodeSnippet {
  id: number;
  title: string;
  language: string;
  code: string;
  description: string;
}

interface Reference {
  id: number;
  title: string;
  category: string;
  description: string;
  url: string;
}

const cheatSheets: CheatSheet[] = [
  {
    id: 1,
    language: "Python",
    title: "Python Basics",
    category: "fundamentals",
    content: `# Variables & Data Types
x = 10
name = "John"
items = [1, 2, 3]

# Functions
def greet(name):
    return f"Hello, {name}!"

# Loops
for i in range(10):
    print(i)

# Conditionals
if x > 5:
    print("Greater than 5")`,
  },
  {
    id: 2,
    language: "JavaScript",
    title: "JavaScript ES6+",
    category: "fundamentals",
    content: `// Arrow Functions
const add = (a, b) => a + b;

// Destructuring
const { name, age } = person;
const [first, ...rest] = array;

// Template Literals
const msg = \`Hello, \${name}!\`;

// Promises & Async/Await
async function fetchData() {
  const data = await fetch(url);
  return data.json();
}`,
  },
  {
    id: 3,
    language: "SQL",
    title: "SQL Queries",
    category: "database",
    content: `-- SELECT
SELECT * FROM users WHERE age > 18;

-- JOIN
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id;

-- GROUP BY
SELECT category, COUNT(*) 
FROM products 
GROUP BY category;

-- Aggregates
SELECT AVG(price), MAX(price) FROM products;`,
  },
];

const codeSnippets: CodeSnippet[] = [
  {
    id: 1,
    title: "Fibonacci Sequence",
    language: "Python",
    description: "Generate fibonacci numbers recursively",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))`,
  },
  {
    id: 2,
    title: "Binary Search",
    language: "JavaScript",
    description: "Efficient search in sorted array",
    code: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 3,
    title: "Bubble Sort",
    language: "Python",
    description: "Simple sorting algorithm",
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
  },
];

const references: Reference[] = [
  {
    id: 1,
    title: "Python Official Docs",
    category: "Python",
    description: "Official Python documentation and tutorials",
    url: "https://docs.python.org",
  },
  {
    id: 2,
    title: "MDN Web Docs - JavaScript",
    category: "JavaScript",
    description: "Comprehensive JavaScript reference and guides",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    id: 3,
    title: "SQL Tutorial",
    category: "SQL",
    description: "Complete SQL reference and best practices",
    url: "https://www.w3schools.com/sql",
  },
];

export default function DeveloperTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleDownloadCheatSheet = (sheet: CheatSheet) => {
    const element = document.createElement("a");
    const file = new Blob([sheet.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${sheet.language}-${sheet.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Cheat sheet downloaded!");
  };

  const filteredCheatSheets = cheatSheets.filter((sheet) => {
    const matchesLanguage = selectedLanguage === "all" || sheet.language === selectedLanguage;
    const matchesSearch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLanguage && matchesSearch;
  });

  const filteredSnippets = codeSnippets.filter((snippet) => {
    const matchesLanguage = selectedLanguage === "all" || snippet.language === selectedLanguage;
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLanguage && matchesSearch;
  });

  const languages = ["all", ...Array.from(new Set(cheatSheets.map((s) => s.language)))];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cheatsheets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cheatsheets" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Cheat Sheets
          </TabsTrigger>
          <TabsTrigger value="snippets" className="gap-2">
            <Code className="w-4 h-4" />
            Snippets
          </TabsTrigger>
          <TabsTrigger value="references" className="gap-2">
            <Zap className="w-4 h-4" />
            References
          </TabsTrigger>
        </TabsList>

        {/* Search & Filter */}
        <div className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang === "all" ? "All Languages" : lang}
              </Button>
            ))}
          </div>
        </div>

        {/* Cheat Sheets Tab */}
        <TabsContent value="cheatsheets" className="space-y-4">
          {filteredCheatSheets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                No cheat sheets found
              </CardContent>
            </Card>
          ) : (
            filteredCheatSheets.map((sheet) => (
              <Card key={sheet.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sheet.title}</CardTitle>
                      <CardDescription>{sheet.language}</CardDescription>
                    </div>
                    <Badge>{sheet.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {sheet.content}
                  </pre>
                  <Button
                    onClick={() => handleDownloadCheatSheet(sheet)}
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Code Snippets Tab */}
        <TabsContent value="snippets" className="space-y-4">
          {filteredSnippets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                No snippets found
              </CardContent>
            </Card>
          ) : (
            filteredSnippets.map((snippet) => (
              <Card key={snippet.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                      <CardDescription>{snippet.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{snippet.language}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {snippet.code}
                  </pre>
                  <Button
                    onClick={() => handleCopyCode(snippet.code)}
                    className="w-full gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-4">
          {references.map((ref) => (
            <Card key={ref.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{ref.title}</CardTitle>
                    <CardDescription>{ref.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{ref.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full gap-2">
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    <Zap className="w-4 h-4" />
                    Visit Reference
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
