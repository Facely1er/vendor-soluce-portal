import React from 'react';
import { NISTControl } from '../../types';

const nistControls: NISTControl[] = [
  {
    id: 'C-SCRM-1',
    title: 'Supply Chain Risk Management Policy',
    description: 'Establish and maintain a supply chain risk management policy and program'
  },
  {
    id: 'C-SCRM-2',
    title: 'Supply Chain Risk Management Coordination',
    description: 'Coordinate supply chain risk management activities'
  },
  {
    id: 'C-SCRM-3',
    title: 'Supply Chain Information Sharing',
    description: 'Establish a process for supply chain information sharing'
  },
  {
    id: 'C-SCRM-4',
    title: 'Supplier Security Assessments',
    description: 'Assess and evaluate supplier security practices'
  },
  {
    id: 'C-SCRM-5',
    title: 'Supplier Monitoring and Management',
    description: 'Monitor and manage suppliers throughout the relationship'
  },
  {
    id: 'C-SCRM-6',
    title: 'Supply Chain Security Baseline',
    description: 'Establish baseline security requirements for suppliers'
  },
  {
    id: 'C-SCRM-7',
    title: 'Supply Chain Security Testing',
    description: 'Test security controls and procedures in the supply chain'
  },
  {
    id: 'C-SCRM-8',
    title: 'Supply Chain Security Controls',
    description: 'Implement security controls for supply chain systems'
  },
  {
    id: 'C-SCRM-9',
    title: 'Supply Chain Incident Response',
    description: 'Develop and implement incident response procedures for supply chain events'
  },
  {
    id: 'C-SCRM-10',
    title: 'Supply Chain Security Reporting',
    description: 'Report supply chain security status and issues'
  }
];

const NISTControlSection: React.FC = () => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">NIST SP 800-161 Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nistControls.map((control) => (
          <div key={control.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:border-vendorsoluce-navy transition-colors">
            <div className="flex items-start">
              <div className="bg-gray-100 dark:bg-gray-800 text-vendorsoluce-navy dark:text-vendorsoluce-blue font-bold px-3 py-1 rounded text-sm mr-3 mt-1">
                {control.id}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{control.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{control.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NISTControlSection;