import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

const ProactiveAssessmentWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [assessmentName, setAssessmentName] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadFrameworks();
  }, []);

  useEffect(() => {
    if (selectedFramework) {
      loadQuestions();
    }
  }, [selectedFramework]);

  const loadFrameworks = async () => {
    try {
      const { data, error: frameworkError } = await supabase
        .from('vs_assessment_frameworks')
        .select('*')
        .eq('is_active', true);

      if (frameworkError) throw frameworkError;
      setFrameworks(data || []);
    } catch (err) {
      logger.error('Error loading frameworks:', err);
      setError('Failed to load assessment frameworks');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const { data, error: questionError } = await supabase
        .from('vs_assessment_questions')
        .select('*')
        .eq('framework_id', selectedFramework)
        .order('order_index', { ascending: true });

      if (questionError) throw questionError;
      setQuestions(data || []);
    } catch (err) {
      logger.error('Error loading questions:', err);
      setError('Failed to load assessment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedFramework) {
        setError('Please select an assessment framework');
        return;
      }
      if (!assessmentName.trim()) {
        setError('Please enter an assessment name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate answers
      const requiredQuestions = questions.filter((q) => q.is_required);
      const unanswered = requiredQuestions.filter((q) => !answers[q.id]);
      if (unanswered.length > 0) {
        setError(`Please answer all required questions (${unanswered.length} remaining)`);
        return;
      }
      setStep(3);
    }
    setError('');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit an assessment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Get vendor profile
      const { data: vendorProfile, error: profileError } = await supabase
        .from('vs_vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !vendorProfile) {
        throw new Error('Vendor profile not found. Please complete your profile setup first.');
      }

      // Calculate scores
      const totalQuestions = questions.length;
      const answeredQuestions = Object.keys(answers).length;
      const yesAnswers = Object.values(answers).filter((a) => a === 'yes' || a === true).length;
      const overallScore = Math.round((yesAnswers / totalQuestions) * 100);

      // Create proactive assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('vs_proactive_assessments')
        .insert({
          vendor_profile_id: vendorProfile.id,
          framework_id: selectedFramework,
          assessment_name: assessmentName,
          status: 'completed',
          overall_score: overallScore,
          answers: answers,
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Update vendor rating
      const { vendorRatingService } = await import('../services/vendorRatingService');
      await vendorRatingService.updateRating(vendorProfile.id);

      navigate('/vendor/dashboard', {
        state: { message: 'Assessment completed successfully!' },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
      logger.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getProgress = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getProgress()}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-vendortal-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start border border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Step 1: Framework Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-vendortal-purple" />
                Select Assessment Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Name *
                </label>
                <input
                  type="text"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                  placeholder="e.g., SOC 2 Type II Assessment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Framework *
                </label>
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading frameworks...</div>
                ) : (
                  <div className="space-y-2">
                    {frameworks.map((framework) => (
                      <div
                        key={framework.id}
                        onClick={() => setSelectedFramework(framework.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFramework === framework.id
                            ? 'border-vendortal-purple bg-vendortal-pale-purple/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-vendortal-purple/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={selectedFramework === framework.id}
                            onChange={() => setSelectedFramework(framework.id)}
                            className="w-4 h-4 text-vendortal-purple"
                            aria-label={`Select ${framework.name}`}
                            title={`Select ${framework.name}`}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {framework.name}
                            </h3>
                            {framework.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {framework.description}
                              </p>
                            )}
                            {framework.estimated_time && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Estimated time: {framework.estimated_time}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Questions */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Questions</CardTitle>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Progress: {answeredCount} / {totalCount} answered
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-vendortal-purple h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading questions...</div>
              ) : (
                questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {question.question_text}
                          {question.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </h3>
                        {question.section && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Section: {question.section}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-7">
                      {question.question_type === 'yes_no' && (
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value="yes"
                              checked={answers[question.id] === 'yes' || answers[question.id] === true}
                              onChange={() => handleAnswerChange(question.id, 'yes')}
                              className="w-4 h-4 text-vendortal-purple"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value="no"
                              checked={answers[question.id] === 'no' || answers[question.id] === false}
                              onChange={() => handleAnswerChange(question.id, 'no')}
                              className="w-4 h-4 text-vendortal-purple"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                          </label>
                        </div>
                      )}

                      {question.question_type === 'text' && (
                        <textarea
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                          rows={3}
                          placeholder="Enter your answer..."
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Assessment Summary
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Assessment Name:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {assessmentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Questions:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {totalCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Answered:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {answeredCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  By submitting this assessment, you agree that the information provided is accurate
                  and complete. This assessment will be used to calculate your vendor rating and may
                  be visible to organizations in the vendor directory.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {step < 3 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProactiveAssessmentWizard;

