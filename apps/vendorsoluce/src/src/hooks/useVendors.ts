import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Vendor = Database['public']['Tables']['vs_vendors']['Row'];
type VendorInsert = Database['public']['Tables']['vs_vendors']['Insert'];
type VendorUpdate = Database['public']['Tables']['vs_vendors']['Update'];

export const useVendors = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    if (!user) {
      setVendors([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('vs_vendors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVendors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createVendor = async (vendorData: Omit<VendorInsert, 'user_id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const newVendorData: VendorInsert = {
        ...vendorData,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('vs_vendors')
        .insert(newVendorData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update state
      setVendors(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
      throw err;
    }
  };

  const updateVendor = async (id: string, vendorData: VendorUpdate) => {
    try {
      const { data, error } = await supabase
        .from('vs_vendors')
        .update(vendorData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      // Update state
      setVendors(prev => prev.map(vendor => 
        vendor.id === id ? data : vendor
      ));
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor');
      throw err;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vs_vendors')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Update state
      setVendors(prev => prev.filter(vendor => vendor.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vendor');
      throw err;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchVendorsSafely = async () => {
      if (!isMounted) return;
      await fetchVendors();
    };

    fetchVendorsSafely();

    return () => {
      isMounted = false;
    };
  }, [user, fetchVendors]);

  return {
    vendors,
    loading,
    error,
    createVendor,
    updateVendor,
    deleteVendor,
    refetch: fetchVendors,
  };
};