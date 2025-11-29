import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, Clock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const ROICalculatorPage: React.FC = () => {
  const [vendors, setVendors] = useState(50);
  const [assessmentsPerYear, setAssessmentsPerYear] = useState(100);
  const [hoursPerAssessment, setHoursPerAssessment] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [incidentsPerYear, setIncidentsPerYear] = useState(2);
  const [incidentCost, setIncidentCost] = useState(200000);

  // Calculations
  const manualAssessmentTime = assessmentsPerYear * hoursPerAssessment;
  const automatedAssessmentTime = assessmentsPerYear * 2; // 2 hours with automation
  const timeSaved = manualAssessmentTime - automatedAssessmentTime;
  const timeSavingsValue = timeSaved * hourlyRate;

  // Note: These are estimates only - actual prevention value depends on many factors
  const incidentPreventionValue = incidentsPerYear * incidentCost * 0.3; // Conservative 30% prevention estimate
  const complianceValue = 30000; // Estimated compliance documentation value
  const totalValue = timeSavingsValue + incidentPreventionValue + complianceValue;

  const vendorTalCost = vendors <= 10 ? 49 * 12 : vendors <= 50 ? 149 * 12 : 449 * 12;
  const roi = ((totalValue - vendorTalCost) / vendorTalCost) * 100;
  const paybackPeriod = vendorTalCost / (totalValue / 12); // months

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Calculator className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ROI Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Calculate the return on investment for VendorTal Risk Review. 
            Estimate potential time and cost savings from using our Vendor Risk Assessment Portal for due diligence.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Note: Calculations are estimates based on your inputs. Actual results may vary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Metrics
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Vendors
                  </label>
                  <Input
                    type="number"
                    value={vendors}
                    onChange={(e) => setVendors(Number(e.target.value))}
                    min="1"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assessments per Year
                  </label>
                  <Input
                    type="number"
                    value={assessmentsPerYear}
                    onChange={(e) => setAssessmentsPerYear(Number(e.target.value))}
                    min="1"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hours per Manual Assessment
                  </label>
                  <Input
                    type="number"
                    value={hoursPerAssessment}
                    onChange={(e) => setHoursPerAssessment(Number(e.target.value))}
                    min="1"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Hourly Rate ($)
                  </label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min="1"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vendor Security Incidents per Year
                  </label>
                  <Input
                    type="number"
                    value={incidentsPerYear}
                    onChange={(e) => setIncidentsPerYear(Number(e.target.value))}
                    min="0"
                    step="0.5"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Cost per Incident ($)
                  </label>
                  <Input
                    type="number"
                    value={incidentCost}
                    onChange={(e) => setIncidentCost(Number(e.target.value))}
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* ROI Summary */}
              <Card className="p-8 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-700">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {roi.toFixed(0)}% ROI
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Annual Return on Investment
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(totalValue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Annual Value
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(vendorTalCost / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Annual Cost
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Value Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Time Savings
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    ${(timeSavingsValue / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {timeSaved.toFixed(0)} hours saved annually
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Risk Prevention
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    ${(incidentPreventionValue / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Prevented incident costs
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Compliance Value
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    ${(complianceValue / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compliance automation value
                  </p>
                </Card>
              </div>

              {/* Payback Period */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Payback Period
                </h3>
                <div className="flex items-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mr-4">
                    {paybackPeriod.toFixed(1)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    months to break even
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Based on your inputs, estimated payback period is {paybackPeriod.toFixed(1)} months. 
                  Actual results may vary based on implementation and usage.
                </p>
              </Card>

              {/* CTA */}
              <Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Start Saving?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Start your free trial to explore the Vendor Risk Assessment Portal
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/pricing">
                      <Button variant="secondary" size="lg">
                        View Pricing
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                        Schedule Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ROICalculatorPage;

