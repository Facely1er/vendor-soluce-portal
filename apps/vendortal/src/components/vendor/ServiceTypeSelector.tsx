import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { serviceTypes, ServiceType, serviceCategories } from '../../data/serviceTypes';

interface ServiceTypeSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
  maxSelections?: number;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  selectedTypes,
  onChange,
  maxSelections,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const filteredTypes = selectedCategory
    ? serviceTypes.filter((st) => st.category === selectedCategory)
    : serviceTypes;

  const getSelectedType = (code: string): ServiceType | undefined => {
    return serviceTypes.find((st) => st.code === code);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Button>
        {serviceCategories.map((category) => (
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

      {/* Service Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTypes.map((serviceType) => {
          const isSelected = selectedTypes.includes(serviceType.code);
          const isExpanded = expandedType === serviceType.code;

          return (
            <Card
              key={serviceType.code}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-vendortal-purple bg-vendortal-pale-purple/10'
                  : 'hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleToggle(serviceType.code)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(serviceType.code)}
                        className="w-4 h-4 text-vendortal-purple rounded focus:ring-vendortal-purple"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${serviceType.name}`}
                        title={`Select ${serviceType.name}`}
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {serviceType.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {serviceType.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                        {serviceType.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Framework Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {serviceType.framework_requirements.map((framework) => (
                          <span
                            key={framework}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                          >
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Common Use Cases
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {serviceType.common_use_cases.map((useCase, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-vendortal-purple" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Risk Profile
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Data Sensitivity:</span>
                          <span className="ml-1 font-medium">
                            {serviceType.risk_profile.data_sensitivity}/5
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Access Control:</span>
                          <span className="ml-1 font-medium">
                            {serviceType.risk_profile.access_control}/5
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Compliance:</span>
                          <span className="ml-1 font-medium">
                            {serviceType.risk_profile.compliance_framework}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle Expand Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedType(isExpanded ? null : serviceType.code);
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
            Selected Service Types ({selectedTypes.length}
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

export default ServiceTypeSelector;

