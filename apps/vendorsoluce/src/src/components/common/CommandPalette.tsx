import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, FileJson, BarChart3, Users, FileText, X, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  path?: string;
  icon?: React.ReactNode;
  action?: () => void;
  category: 'navigation' | 'action' | 'tool';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard') || 'Dashboard',
      description: 'View your main dashboard',
      path: '/dashboard',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'navigation',
    },
    {
      id: 'vendors',
      label: t('navigation.vendors') || 'Vendors',
      description: 'Manage vendor risks',
      path: '/vendors',
      icon: <Users className="h-4 w-4" />,
      category: 'navigation',
    },
    {
      id: 'sbom',
      label: t('navigation.sbom') || 'SBOM Analyzer',
      description: 'Analyze software bill of materials',
      path: '/sbom-analyzer',
      icon: <FileJson className="h-4 w-4" />,
      category: 'navigation',
    },
    {
      id: 'assessment',
      label: t('navigation.assessment') || 'Supply Chain Assessment',
      description: 'Start a new assessment',
      path: '/supply-chain-assessment',
      icon: <Shield className="h-4 w-4" />,
      category: 'navigation',
    },
    {
      id: 'templates',
      label: t('navigation.templates') || 'Templates',
      description: 'Browse NIST templates',
      path: '/templates',
      icon: <FileText className="h-4 w-4" />,
      category: 'navigation',
    },
    {
      id: 'nist-checklist',
      label: 'NIST Checklist',
      description: 'Quick NIST compliance check',
      path: '/tools/nist-checklist',
      icon: <Shield className="h-4 w-4" />,
      category: 'tool',
    },
    {
      id: 'vendor-risk-radar',
      label: 'Vendor Risk Radar',
      description: 'Visualize vendor risk landscape',
      path: '/tools/vendor-risk-radar',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'tool',
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback((command: CommandItem) => {
    if (command.path) {
      navigate(command.path);
    } else if (command.action) {
      command.action();
    }
    onClose();
    setSearchQuery('');
    setSelectedIndex(0);
  }, [navigate, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filteredCommands, selectedIndex, handleSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Search for commands, pages, or actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => handleSelect(command)}
                  className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-vendorsoluce-green/10 dark:bg-vendorsoluce-green/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`flex-shrink-0 ${index === selectedIndex ? 'text-vendorsoluce-green' : 'text-gray-500 dark:text-gray-400'}`}>
                    {command.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-medium ${index === selectedIndex ? 'text-vendorsoluce-green dark:text-vendorsoluce-blue' : 'text-gray-900 dark:text-white'}`}>
                      {command.label}
                    </div>
                    {command.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {command.description}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {command.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs mr-1">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs mr-1">↵</kbd>
              Select
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs mr-1">Esc</kbd>
              Close
            </span>
          </div>
          <div className="flex items-center">
            <Command className="h-3 w-3 mr-1" />
            <span>+K to open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
