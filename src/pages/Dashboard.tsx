import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, Database, MessageSquare, Settings, Code, Play, Copy, Check, Globe, Shield, Zap, Brain, FileText, Users, BarChart3, Clock, Cpu, Layers, Upload, Link as LinkIcon, Trash2, Edit3, Save, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Dashboard = () => {
  const { toast } = useToast();
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [agentCreated, setAgentCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Advanced configurations
  const [agentCategory, setAgentCategory] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [securityMode, setSecurityMode] = useState("standard");
  const [languages, setLanguages] = useState(["English"]);
  const [timezone, setTimezone] = useState("UTC");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [agentAvatar, setAgentAvatar] = useState("");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("create");

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const agents = [
    { id: "a-1", name: "CX Orchestrator", role: "Support", status: "online", updatedAt: "2h ago", tags: ["routing", "handoff"] },
    { id: "a-2", name: "Sales Qualifier", role: "Sales", status: "online", updatedAt: "1d ago", tags: ["leads", "scoring"] },
    { id: "a-3", name: "Research Synthesizer", role: "Ops", status: "offline", updatedAt: "3d ago", tags: ["web", "papers"] },
  ] as const;

  useEffect(() => {
    document.title = "AI Agent Orchestration Dashboard";
    const desc = "Design, orchestrate, and test AI agents in a 3-pane builder.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = desc;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = window.location.origin + "/dashboard";
  }, []);

  const agentId = "agent_" + Math.random().toString(36).substr(2, 9);
  const curlEndpoint = `https://api.neutro.ai/v1/agents/${agentId}/chat`;

  const handleCreateAgent = () => {
    if (!agentName || !agentDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in agent name and description.",
        variant: "destructive",
      });
      return;
    }

    setAgentCreated(true);
    toast({
      title: "Agent Created Successfully!",
      description: `${agentName} is ready for testing.`,
    });
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, 
      { role: "user", content: chatMessage },
      { role: "assistant", content: `Hello! I'm ${agentName}. ${agentDescription} How can I help you today?` }
    ]);
    setChatMessage("");
  };

  const copyCurl = () => {
    const curlCommand = `curl -X POST "${curlEndpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Hello, how can you help me?",
    "conversation_id": "optional_conversation_id"
  }'`;
    
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "CURL command copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-semibold">AI Agent Orchestration Dashboard</h1>
            </div>
          </div>
          {agentCreated && (
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-4 h-4" />
              <span className="text-sm">Agent Active</span>
            </div>
          )}
        </div>
      </header>

      <div className="container flex-1 px-4 py-6 flex flex-col gap-6 min-h-0">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass border-emerald-500/20">
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 rounded-lg bg-emerald-500/20">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Agents</p>
                    <p className="text-2xl font-bold">{agentCreated ? 1 : 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass border-blue-500/20">
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversations</p>
                    <p className="text-2xl font-bold">{chatHistory.length / 2}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass border-purple-500/20">
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Knowledge Items</p>
                    <p className="text-2xl font-bold">{knowledgeBase ? knowledgeBase.split('\n').length : 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass border-orange-500/20">
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 rounded-lg bg-orange-500/20">
                    <Activity className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API Calls Today</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 min-h-0 flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ResizablePanelGroup direction="horizontal" className="h-full min-h-0">
            {/* Agent Library */}
            <ResizablePanel defaultSize={22} minSize={18} className="pr-3">
              <Card className="glass h-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Agent Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full flex flex-col gap-3">
                  <Input placeholder="Search agents..." className="bg-white/5" />

                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">All</Badge>
                    <Badge variant="outline">Support</Badge>
                    <Badge variant="outline">Sales</Badge>
                    <Badge variant="outline">Ops</Badge>
                    <Badge variant="outline">Research</Badge>
                  </div>

                  <Separator />

                  <div className="flex-1 overflow-y-auto space-y-2">
                    {agents.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setSelectedAgentId(a.id);
                          setAgentName(a.name);
                          setAgentDescription(`${a.role} agent for ${a.tags.join(', ')}`);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-white/5 ${
                          selectedAgentId === a.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{a.name}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className={`w-2 h-2 rounded-full ${a.status === 'online' ? 'bg-emerald-400' : 'bg-muted'}`}></div>
                            <span>{a.updatedAt}</span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">Role: {a.role}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {a.tags.map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button size="sm" className="button-gradient w-full">
                      <Bot className="w-4 h-4 mr-2" /> New Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Composer */}
            <ResizablePanel defaultSize={50} minSize={40} className="px-3">
              <Card className="glass h-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Composer
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full overflow-y-auto">
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="bg-white/5">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="system">System</TabsTrigger>
                      <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Agent Name *</label>
                        <Input
                          placeholder="Customer Support Agent"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="bg-white/5"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select value={agentCategory} onValueChange={setAgentCategory}>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer-support">Customer Support</SelectItem>
                            <SelectItem value="sales">Sales Assistant</SelectItem>
                            <SelectItem value="content">Content Creator</SelectItem>
                            <SelectItem value="research">Research Assistant</SelectItem>
                            <SelectItem value="coding">Code Helper</SelectItem>
                            <SelectItem value="general">General Purpose</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description *</label>
                        <Textarea
                          placeholder="A helpful assistant that handles customer support queries with empathy and expertise..."
                          value={agentDescription}
                          onChange={(e) => setAgentDescription(e.target.value)}
                          className="bg-white/5 min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Avatar URL</label>
                        <Input
                          placeholder="https://example.com/avatar.png"
                          value={agentAvatar}
                          onChange={(e) => setAgentAvatar(e.target.value)}
                          className="bg-white/5"
                        />
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Button 
                          size="sm" 
                          className="button-gradient"
                          onClick={handleCreateAgent}
                          disabled={agentCreated}
                        >
                          {agentCreated ? (
                            <>
                              <Check className="mr-2 w-4 h-4" />
                              Agent Created
                            </>
                          ) : (
                            <>
                              Create Agent
                              <Bot className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Save className="mr-2 w-4 h-4" /> Save Draft
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="system" className="mt-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">AI Model</label>
                        <Select value={model} onValueChange={setModel}>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4 Omni (Recommended)</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                            <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">System Prompt</label>
                        <Textarea
                          placeholder="You are a helpful agent..."
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className="bg-white/5 min-h-[120px]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Languages</label>
                        <Select>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue placeholder="Select languages" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="multi">Multi-language</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Timezone</label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="knowledge" className="mt-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Training Data</label>
                        <Textarea
                          placeholder="Upload documents, paste text, or enter URLs to train your agent..."
                          value={knowledgeBase}
                          onChange={(e) => setKnowledgeBase(e.target.value)}
                          className="bg-white/5 min-h-[180px]"
                        />
                        {trainingProgress > 0 && (
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs">
                              <span>Training Progress</span>
                              <span>{trainingProgress}%</span>
                            </div>
                            <Progress value={trainingProgress} className="h-2" />
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">Supported: PDF, TXT, DOCX, CSV, JSON, MD</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Files
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Add URLs
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={webSearchEnabled} onCheckedChange={setWebSearchEnabled} />
                          <span className="text-sm">Web Search</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={memoryEnabled} onCheckedChange={setMemoryEnabled} />
                          <span className="text-sm">Memory</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="parameters" className="mt-4 space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-3 block">Temperature: {temperature[0]}</label>
                        <Slider value={temperature} onValueChange={setTemperature} max={2} min={0} step={0.1} className="w-full" />
                        <div className="text-xs text-muted-foreground mt-1">Controls randomness. Lower = more focused.</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-3 block">Max Tokens: {maxTokens[0]}</label>
                        <Slider value={maxTokens} onValueChange={setMaxTokens} max={4096} min={256} step={256} className="w-full" />
                        <div className="text-xs text-muted-foreground mt-1">Maximum response length.</div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rate Limiting</span>
                          <Switch checked={rateLimitEnabled} onCheckedChange={setRateLimitEnabled} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Content Filtering</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Data Encryption</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Inspector + Test Console */}
            <ResizablePanel defaultSize={28} minSize={22} className="pl-3">
              <div className="h-full flex flex-col gap-3">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" /> Inspector
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-sm">Online & Ready</span>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span>{model}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Temperature</span><span>{temperature[0]}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Max Tokens</span><span>{maxTokens[0]}</span></div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Active Features</h4>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {memoryEnabled && <Badge variant="outline">Memory</Badge>}
                        {webSearchEnabled && <Badge variant="outline">Web Search</Badge>}
                        {rateLimitEnabled && <Badge variant="outline">Rate Limit</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass flex-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Test Console
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{chatHistory.length / 2} convos</Badge>
                        <Button variant="outline" size="sm" onClick={() => setChatHistory([])}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col">
                    <div className="border border-white/10 rounded-lg bg-black/20 flex-1 p-3 mb-3 overflow-y-auto">
                      {chatHistory.length === 0 ? (
                        <div className="h-full grid place-items-center text-center text-sm text-muted-foreground">
                          Send a message to test your agent.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white/10 border border-white/10'}`}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="bg-white/5"
                      />
                      <Button onClick={handleSendMessage} disabled={!chatMessage.trim()} className="px-6">
                        <Play className="w-4 h-4 mr-2" /> Send
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><Cpu className="w-3 h-3" /><span>~200ms</span></div>
                      <div className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /><span>Tokens: {chatHistory.length * 50}</span></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;