import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface ChatbotResponse {
  id: string;
  context: 'vendor-onboarding' | 'assessment' | 'general';
  topic: string;
  response: string;
  suggestions: string[];
  keywords: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

interface ChatbotStats {
  totalResponses: number;
  activeResponses: number;
  totalInteractions: number;
  averageResponseTime: number;
  topTopics: Array<{ topic: string; count: number }>;
  contextBreakdown: Array<{ context: string; count: number }>;
}

const ChatbotAdmin: React.FC = () => {
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [stats, setStats] = useState<ChatbotStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContext, setFilterContext] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingResponse, setEditingResponse] = useState<Partial<ChatbotResponse>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResponse, setNewResponse] = useState<Partial<ChatbotResponse>>({});

  // Mock data - in real app this would be fetched from API
  useEffect(() => {
    const mockResponses: ChatbotResponse[] = [
      {
        id: '1',
        context: 'vendor-onboarding',
        topic: 'documents',
        response: 'For vendor onboarding, you\'ll need to upload several documents...',
        suggestions: ['What documents do I need?', 'How do I upload documents?'],
        keywords: ['document', 'upload', 'file', 'paperwork'],
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        usageCount: 45
      },
      {
        id: '2',
        context: 'assessment',
        topic: 'questions',
        response: 'I can help you understand assessment questions and provide guidance...',
        suggestions: ['How do I answer scale questions?', 'What evidence should I provide?'],
        keywords: ['question', 'answer', 'help', 'explain'],
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        usageCount: 32
      },
      {
        id: '3',
        context: 'general',
        topic: 'features',
        response: 'VendorSoluce offers comprehensive supply chain risk management capabilities...',
        suggestions: ['What is SBOM analysis?', 'How does vendor management work?'],
        keywords: ['feature', 'capability', 'function', 'tool'],
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        usageCount: 28
      }
    ];

    const mockStats: ChatbotStats = {
      totalResponses: 15,
      activeResponses: 12,
      totalInteractions: 1250,
      averageResponseTime: 1.2,
      topTopics: [
        { topic: 'documents', count: 45 },
        { topic: 'assessment', count: 32 },
        { topic: 'features', count: 28 },
        { topic: 'compliance', count: 22 },
        { topic: 'security', count: 18 }
      ],
      contextBreakdown: [
        { context: 'vendor-onboarding', count: 65 },
        { context: 'assessment', count: 35 },
        { context: 'general', count: 25 }
      ]
    };

    setResponses(mockResponses);
    setStats(mockStats);
  }, []);

  const filteredResponses = responses.filter(response => {
    const matchesSearch = response.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.response.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContext = filterContext === 'all' || response.context === filterContext;
    return matchesSearch && matchesContext;
  });

  const handleEdit = (response: ChatbotResponse) => {
    setIsEditing(response.id);
    setEditingResponse({ ...response });
  };

  const handleSave = () => {
    if (isEditing) {
      setResponses(prev => prev.map(r => 
        r.id === isEditing ? { ...r, ...editingResponse, updatedAt: new Date().toISOString().split('T')[0] } : r
      ));
    }
    setIsEditing(null);
    setEditingResponse({});
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditingResponse({});
  };

  const handleAdd = () => {
    if (newResponse.topic && newResponse.response) {
      const response: ChatbotResponse = {
        id: Date.now().toString(),
        context: newResponse.context || 'general',
        topic: newResponse.topic,
        response: newResponse.response,
        suggestions: newResponse.suggestions || [],
        keywords: newResponse.keywords || [],
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      setResponses(prev => [...prev, response]);
      setNewResponse({});
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      setResponses(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Chatbot Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage chatbot responses, monitor performance, and configure knowledge base
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Responses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalResponses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                    <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Responses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeResponses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interactions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInteractions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageResponseTime}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={filterContext}
            onChange={(e) => setFilterContext(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Contexts</option>
            <option value="vendor-onboarding">Vendor Onboarding</option>
            <option value="assessment">Assessment</option>
            <option value="general">General</option>
          </select>
          
          <Button onClick={() => setShowAddForm(true)} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Response
          </Button>
        </div>

        {/* Responses List */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResponses.map((response) => (
                <div key={response.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {isEditing === response.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Context
                          </label>
                          <select
                            value={editingResponse.context || ''}
                            onChange={(e) => setEditingResponse(prev => ({ ...prev, context: e.target.value as any }))}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="vendor-onboarding">Vendor Onboarding</option>
                            <option value="assessment">Assessment</option>
                            <option value="general">General</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Topic
                          </label>
                          <input
                            type="text"
                            value={editingResponse.topic || ''}
                            onChange={(e) => setEditingResponse(prev => ({ ...prev, topic: e.target.value }))}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Response
                        </label>
                        <textarea
                          value={editingResponse.response || ''}
                          onChange={(e) => setEditingResponse(prev => ({ ...prev, response: e.target.value }))}
                          rows={4}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingResponse.keywords?.join(', ') || ''}
                          onChange={(e) => setEditingResponse(prev => ({ 
                            ...prev, 
                            keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                          }))}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {response.topic}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              response.context === 'vendor-onboarding' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                              response.context === 'assessment' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {response.context}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              response.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }`}>
                              {response.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {response.response.length > 200 ? `${response.response.substring(0, 200)}...` : response.response}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Used {response.usageCount} times</span>
                            <span>Updated {response.updatedAt}</span>
                            <span>Keywords: {response.keywords.join(', ')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(response.id)}
                          >
                            {response.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(response)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(response.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Response Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Add New Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Context
                      </label>
                      <select
                        value={newResponse.context || ''}
                        onChange={(e) => setNewResponse(prev => ({ ...prev, context: e.target.value as any }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Select context</option>
                        <option value="vendor-onboarding">Vendor Onboarding</option>
                        <option value="assessment">Assessment</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Topic
                      </label>
                      <input
                        type="text"
                        value={newResponse.topic || ''}
                        onChange={(e) => setNewResponse(prev => ({ ...prev, topic: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="e.g., documents, assessment, features"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Response
                    </label>
                    <textarea
                      value={newResponse.response || ''}
                      onChange={(e) => setNewResponse(prev => ({ ...prev, response: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter the chatbot response..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newResponse.keywords?.join(', ') || ''}
                      onChange={(e) => setNewResponse(prev => ({ 
                        ...prev, 
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., document, upload, file, paperwork"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Response
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotAdmin;