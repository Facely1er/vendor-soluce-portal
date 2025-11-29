import React, { useState } from 'react';
import { Check, AlertTriangle, Info, Shield } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { dataTypes, DataType, dataCategories } from '../../data/dataTypes';

interface DataTypeSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
  maxSelections?: number;
}

const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({
  selectedTypes,
  onChange,
  maxSelections,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSensitivity, setSelectedSensitivity] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const handleToggle = (code: string) => {
    if (selectedTypes.includes(code)) {
      onChange(selectedTypes.filter((t) => t !== code));
    } else {
      if (maxSelections && selectedTypes.length >= maxSelections) {
        return;
      }
      onChange([...selectedTypes, code]);
    }
  };

  const filteredTypes = dataTypes.filter((dt) => {
    const categoryMatch = !selectedCategory || dt.category === selectedCategory;
    const sensitivityMatch = !selectedSensitivity || dt.sensitivity_level === selectedSensitivity;
    return categoryMatch && sensitivityMatch;
  });

  const getSelectedType = (code: string): DataType | undefined => {
    return dataTypes.find((dt) => dt.code === code);
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const sensitivityLevels: Array<'Low' | 'Medium' | 'High' | 'Critical'> = [
    'Low',
    'Medium',
    'High',
    'Critical',
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {dataCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Sensitivity Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Filter by Sensitivity Level
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSensitivity === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedSensitivity(null)}
            >
              All Levels
            </Button>
            {sensitivityLevels.map((level) => (
              <Button
                key={level}
                variant={selectedSensitivity === level ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedSensitivity(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTypes.map((dataType) => {
          const isSelected = selectedTypes.includes(dataType.code);
          const isExpanded = expandedType === dataType.code;

          return (
            <Card
              key={dataType.code}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-vendortal-purple bg-vendortal-pale-purple/10'
                  : 'hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleToggle(dataType.code)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(dataType.code)}
                        className="w-4 h-4 text-vendortal-purple rounded focus:ring-vendortal-purple"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${dataType.name}`}
                        title={`Select ${dataType.name}`}
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {dataType.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {dataType.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getSensitivityColor(
                          dataType.sensitivity_level
                        )}`}
                      >
                        {dataType.sensitivity_level}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                        {dataType.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {/* Compliance Requirements */}
                    {dataType.compliance_requirements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Compliance Requirements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {dataType.compliance_requirements.map((req) => (
                            <span
                              key={req}
                              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Protection Requirements */}
                    {dataType.protection_requirements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Protection Requirements
                        </h4>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {dataType.protection_requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-vendortal-purple" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Security Controls */}
                    {dataType.security_controls.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Security Controls
                        </h4>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {dataType.security_controls.map((control, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3 h-3 text-vendortal-purple mt-0.5 flex-shrink-0" />
                              <span>{control}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Toggle Expand Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedType(isExpanded ? null : dataType.code);
                  }}
                >
                  <Info className="w-4 h-4 mr-2" />
                  {isExpanded ? 'Show Less' : 'Show Details'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 p-4 bg-vendortal-pale-purple/10 border border-vendortal-purple/20 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Selected Data Types ({selectedTypes.length}
            {maxSelections ? ` / ${maxSelections}` : ''})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((code) => {
              const type = getSelectedType(code);
              return (
                <span
                  key={code}
                  className="text-sm px-3 py-1 bg-vendortal-purple/10 text-vendortal-purple rounded-full flex items-center gap-2"
                >
                  {type?.name || code}
                  <button
                    onClick={() => handleToggle(code)}
                    className="hover:text-vendortal-purple/70"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTypeSelector;

