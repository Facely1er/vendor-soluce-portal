import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  ArrowRight,
  PlayCircle,
  Pause,
  Settings
} from 'lucide-react';

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  workflowType: 'vendor_assessment' | 'contract_review' | 'security_review' | 'compliance_check';
  vendorName?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<WorkflowTask, 'id' | 'vendorName'>[];
  isActive: boolean;
}

const WorkflowAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'templates' | 'automation'>('tasks');
  const [tasks, setTasks] = useState<WorkflowTask[]>([
    {
      id: 'task-001',
      title: 'Complete Security Assessment',
      description: 'Conduct NIST 800-161 security assessment for new vendor',
      assignee: 'Security Team',
      dueDate: '2025-01-25',
      status: 'in_progress',
      priority: 'high',
      workflowType: 'vendor_assessment',
      vendorName: 'TechCorp Solutions'
    },
    {
      id: 'task-002',
      title: 'Review Contract Security Clauses',
      description: 'Verify security requirements are included in vendor contract',
      assignee: 'Legal Team',
      dueDate: '2025-01-20',
      status: 'pending',
      priority: 'medium',
      workflowType: 'contract_review',
      vendorName: 'CloudSecure Inc'
    },
    {
      id: 'task-003',
      title: 'SBOM Validation',
      description: 'Validate and analyze submitted software bill of materials',
      assignee: 'Engineering Team',
      dueDate: '2025-01-18',
      status: 'overdue',
      priority: 'critical',
      workflowType: 'security_review',
      vendorName: 'DevTools Pro'
    },
    {
      id: 'task-004',
      title: 'Compliance Verification',
      description: 'Verify vendor compliance with federal requirements',
      assignee: 'Compliance Officer',
      dueDate: '2025-01-30',
      status: 'pending',
      priority: 'high',
      workflowType: 'compliance_check',
      vendorName: 'FedSecure Systems'
    }
  ]);

  const [templates, setTemplates] = useState<WorkflowTemplate[]>([
    {
      id: 'template-001',
      name: 'Standard Vendor Onboarding',
      description: 'Complete vendor assessment and onboarding process',
      isActive: true,
      tasks: [
        {
          title: 'Initial Security Assessment',
          description: 'Complete vendor security questionnaire',
          assignee: 'Security Team',
          dueDate: '+7 days',
          status: 'pending',
          priority: 'high',
          workflowType: 'vendor_assessment'
        },
        {
          title: 'Contract Review',
          description: 'Review and approve security clauses',
          assignee: 'Legal Team',
          dueDate: '+10 days',
          status: 'pending',
          priority: 'medium',
          workflowType: 'contract_review'
        },
        {
          title: 'Final Approval',
          description: 'Executive approval for vendor onboarding',
          assignee: 'Procurement Manager',
          dueDate: '+14 days',
          status: 'pending',
          priority: 'medium',
          workflowType: 'vendor_assessment'
        }
      ]
    },
    {
      id: 'template-002',
      name: 'Critical Vendor Review',
      description: 'Enhanced review process for high-risk vendors',
      isActive: true,
      tasks: [
        {
          title: 'Extended Security Assessment',
          description: 'Comprehensive NIST 800-161 assessment',
          assignee: 'Senior Security Analyst',
          dueDate: '+5 days',
          status: 'pending',
          priority: 'critical',
          workflowType: 'vendor_assessment'
        },
        {
          title: 'On-site Security Audit',
          description: 'Conduct on-site security evaluation',
          assignee: 'External Auditor',
          dueDate: '+21 days',
          status: 'pending',
          priority: 'high',
          workflowType: 'security_review'
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'overdue': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed' as const } : task
    ));
  };

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === templateId ? { ...template, isActive: !template.isActive } : template
    ));
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'tasks', label: 'Active Tasks', icon: Clock },
            { id: 'templates', label: 'Workflow Templates', icon: Settings },
            { id: 'automation', label: 'Automation Rules', icon: PlayCircle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'templates' | 'automation')}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-vendorsoluce-teal text-vendorsoluce-teal'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Workflow Tasks</h3>
            <Button variant="primary" size="sm">
              <PlayCircle className="h-4 w-4 mr-2" />
              Start New
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>
                      
                      {task.vendorName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Vendor: <span className="font-medium">{task.vendorName}</span>
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {task.dueDate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {task.status !== 'completed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => completeTask(task.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          alert(`View details for "${task.title}". This would open a detailed task view with description, comments, attachments, and completion tracking.`);
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Workflow Templates</h3>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                alert('Create Template functionality will allow you to design custom workflow templates with automated task sequences, approval chains, and notification rules for vendor risk management processes.');
              }}
            >
              Create Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTemplate(template.id)}
                      >
                        {template.isActive ? <Pause className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Template Steps:</p>
                    {template.tasks.map((task, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs mr-2">
                          {index + 1}
                        </span>
                        {task.title}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        alert(`Edit Template functionality will open the workflow designer for "${template.name}". You'll be able to modify task sequences, update assignees, adjust timelines, and customize automation rules.`);
                      }}
                    >
                      Edit Template
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        alert(`Using template "${template.name}" will start a new workflow instance. You'll be prompted to specify the vendor, assign team members, and set due dates for each task in the workflow.`);
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Automation Rules</h3>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                alert('Create Rule functionality will open the automation rule builder. You can define triggers (risk score changes, assessment completion, etc.) and actions (notifications, task creation, escalations) to automate your vendor risk management processes.');
              }}
            >
              Create Rule
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Auto-assign Critical Vendor Assessments
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Automatically assign high-risk vendor assessments to senior security analysts
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Trigger: New vendor with risk score &gt; 70 | Action: Assign to Senior Security Team
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      SBOM Vulnerability Alerts
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Send immediate alerts when critical vulnerabilities are detected in SBOMs
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Trigger: Critical CVE detected | Action: Notify Security Team + Create Task
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Overdue Assessment Reminders
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Send escalating reminders for overdue vendor assessments
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Trigger: Assessment 3 days overdue | Action: Email reminder to assignee and manager
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                      Inactive
                    </span>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomation;