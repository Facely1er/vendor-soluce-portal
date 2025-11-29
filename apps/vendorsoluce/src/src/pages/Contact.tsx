import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    topic: '',
    message: '',
    terms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData({
      ...formData,
      [id]: checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Basic validation
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.message) {
      setFormError(t('contact.form.validation.requiredFields'));
      setIsSubmitting(false);
      return;
    }

    if (!formData.terms) {
      setFormError(t('contact.form.validation.termsRequired'));
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit to Supabase via edge function
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          topic: formData.topic || null,
          message: formData.message,
        }
      });

      if (error) {
        logger.error('Edge function error:', error);
        throw error;
      }

      // Show success message
      setFormSubmitted(true);
    } catch (err: unknown) {
      logger.error('Error submitting form:', err);
      setFormError(err instanceof Error ? err.message : t('contact.form.validation.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('contact.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <Card className="p-8">
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.form.success.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('contact.form.success.message')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      company: '',
                      topic: '',
                      message: '',
                      terms: false
                    });
                  }}
                >
                  {t('contact.form.success.sendAnother')}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('contact.form.title')}</h2>
                
                {formError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-red-600 dark:text-red-400">{formError}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.form.fields.firstName')}<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.form.fields.lastName')}<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.form.fields.email')}<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('contact.form.fields.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('contact.form.fields.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('contact.form.fields.topic.label')}
                    </label>
                    <select
                      id="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">{t('contact.form.fields.topic.placeholder')}</option>
                      <option value="Product Information">{t('contact.form.fields.topic.options.productInfo')}</option>
                      <option value="Technical Support">{t('contact.form.fields.topic.options.techSupport')}</option>
                      <option value="Partnership Opportunities">{t('contact.form.fields.topic.options.partnership')}</option>
                      <option value="Federal Compliance Questions">{t('contact.form.fields.topic.options.compliance')}</option>
                      <option value="Other">{t('contact.form.fields.topic.options.other')}</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('contact.form.fields.message')}<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendorsoluce-navy focus:border-vendorsoluce-navy bg-white dark:bg-gray-800 dark:text-white"
                      placeholder={t('contact.form.fields.messagePlaceholder')}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={formData.terms}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-vendorsoluce-navy focus:ring-vendorsoluce-navy border-gray-300 dark:border-gray-600 rounded"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('contact.form.fields.termsPrefix')} <Link to="/privacy" className="text-vendorsoluce-navy dark:text-vendorsoluce-blue hover:underline">{t('contact.form.fields.privacyPolicy')}</Link> {t('contact.form.fields.termsSuffix')}
                      </label>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('contact.form.submitting')}
                      </>
                    ) : (
                      t('contact.form.submit')
                    )}
                  </Button>
                </form>
              </>
            )}
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.info.title')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t('contact.info.email.label')}</p>
                  <a href="mailto:contact@ermits.com" className="text-gray-600 dark:text-gray-300 hover:text-vendorsoluce-navy dark:hover:text-vendorsoluce-blue">
                    {t('contact.info.email.value')}
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t('contact.info.phone.label')}</p>
                  <a href="tel:+18886186160" className="text-gray-600 dark:text-gray-300 hover:text-vendorsoluce-navy dark:hover:text-vendorsoluce-blue">
                    {t('contact.info.phone.value')}
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t('contact.info.address.label')}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('contact.info.address.line1')}<br />
                    {t('contact.info.address.line2')}<br />
                    {t('contact.info.address.line3')}
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t('contact.info.hours.label')}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('contact.info.hours.weekdays')}<br />
                    {t('contact.info.hours.weekends')}
                  </p>
                </div>
              </li>
            </ul>
          </Card>
          
        </div>
      </div>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">{t('contact.faq.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.questions.nist.question')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('contact.faq.questions.nist.answer')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.questions.integration.question')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('contact.faq.questions.integration.answer')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.questions.sbom.question')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('contact.faq.questions.sbom.answer')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.questions.setup.question')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('contact.faq.questions.setup.answer')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.questions.services.question')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('contact.faq.questions.services.answer')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('contact.faq.questions.security.question')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('contact.faq.questions.security.answer')}
            </p>
          </div>
        </div>
      </section>
      
      <section className="bg-gradient-to-r from-vendorsoluce-navy to-vendorsoluce-teal text-white rounded-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">{t('contact.cta.title')}</h2>
              <p className="text-gray-100 max-w-xl">
                {t('contact.cta.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white text-vendorsoluce-navy hover:bg-gray-100"
                onClick={() => window.location.href = '/supply-chain-assessment'}
              >
                {t('contact.cta.freeButton')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;