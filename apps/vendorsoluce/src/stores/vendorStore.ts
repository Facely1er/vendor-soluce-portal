import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Vendor = Database['public']['Tables']['vs_vendors']['Row'];
type VendorInsert = Database['public']['Tables']['vs_vendors']['Insert'];
type VendorUpdate = Database['public']['Tables']['vs_vendors']['Update'];

interface VendorState {
  // Data
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Filters & Search
  searchTerm: string;
  riskLevelFilter: string;
  complianceFilter: string;
  sortBy: 'name' | 'risk_score' | 'last_assessment_date';
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchVendors: (userId: string) => Promise<void>;
  createVendor: (vendor: Omit<VendorInsert, 'user_id'>, userId: string) => Promise<Vendor>;
  updateVendor: (id: string, updates: VendorUpdate, userId: string) => Promise<void>;
  deleteVendor: (id: string, userId: string) => Promise<void>;
  selectVendor: (vendor: Vendor | null) => void;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setRiskLevelFilter: (level: string) => void;
  setComplianceFilter: (status: string) => void;
  setSorting: (sortBy: VendorState['sortBy'], sortOrder: VendorState['sortOrder']) => void;
  clearFilters: () => void;
  
  // Computed selectors
  getFilteredVendors: () => Vendor[];
  getVendorById: (id: string) => Vendor | undefined;
  getRiskDistribution: () => { critical: number; high: number; medium: number; low: number };
  getComplianceStats: () => { compliant: number; partial: number; nonCompliant: number };
}

export const useVendorStore = create<VendorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        vendors: [],
        selectedVendor: null,
        loading: false,
        error: null,
        lastFetched: null,
        searchTerm: '',
        riskLevelFilter: 'all',
        complianceFilter: 'all',
        sortBy: 'name',
        sortOrder: 'asc',
        
        // Data actions
        fetchVendors: async (userId: string) => {
          set({ loading: true, error: null }, false, 'fetchVendors/start');
          
          try {
            const { data, error } = await supabase
              .from('vs_vendors')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false });

            if (error) throw error;

            set(
              {
                vendors: data || [],
                loading: false,
                lastFetched: Date.now()
              },
              false,
              'fetchVendors/success'
            );
          } catch (error) {
            set(
              {
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch vendors'
              },
              false,
              'fetchVendors/error'
            );
            throw error;
          }
        },
        
        createVendor: async (vendorData: Omit<VendorInsert, 'user_id'>, userId: string) => {
          set({ loading: true, error: null }, false, 'createVendor/start');
          
          try {
            const newVendorData: VendorInsert = {
              ...vendorData,
              user_id: userId,
            };
            
            const { data, error } = await supabase
              .from('vs_vendors')
              .insert(newVendorData)
              .select()
              .single();

            if (error) throw error;

            set(
              (state) => ({
                vendors: [data, ...state.vendors],
                loading: false
              }),
              false,
              'createVendor/success'
            );
            
            return data;
          } catch (error) {
            set(
              {
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to create vendor'
              },
              false,
              'createVendor/error'
            );
            throw error;
          }
        },
        
        updateVendor: async (id: string, vendorData: VendorUpdate, userId: string) => {
          set({ loading: true, error: null }, false, 'updateVendor/start');
          
          try {
            const { data, error } = await supabase
              .from('vs_vendors')
              .update(vendorData)
              .eq('id', id)
              .eq('user_id', userId)
              .select()
              .single();

            if (error) throw error;
            
            set(
              (state) => ({
                vendors: state.vendors.map(vendor => 
                  vendor.id === id ? data : vendor
                ),
                selectedVendor: state.selectedVendor?.id === id ? data : state.selectedVendor,
                loading: false
              }),
              false,
              'updateVendor/success'
            );
          } catch (error) {
            set(
              {
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to update vendor'
              },
              false,
              'updateVendor/error'
            );
            throw error;
          }
        },
        
        deleteVendor: async (id: string, userId: string) => {
          set({ loading: true, error: null }, false, 'deleteVendor/start');
          
          try {
            const { error } = await supabase
              .from('vs_vendors')
              .delete()
              .eq('id', id)
              .eq('user_id', userId);

            if (error) throw error;

            set(
              (state) => ({
                vendors: state.vendors.filter(vendor => vendor.id !== id),
                selectedVendor: state.selectedVendor?.id === id ? null : state.selectedVendor,
                loading: false
              }),
              false,
              'deleteVendor/success'
            );
          } catch (error) {
            set(
              {
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to delete vendor'
              },
              false,
              'deleteVendor/error'
            );
            throw error;
          }
        },
        
        selectVendor: (vendor) => set({ selectedVendor: vendor }, false, 'selectVendor'),
        
        // Filter actions
        setSearchTerm: (term) => set({ searchTerm: term }, false, 'setSearchTerm'),
        setRiskLevelFilter: (level) => set({ riskLevelFilter: level }, false, 'setRiskLevelFilter'),
        setComplianceFilter: (status) => set({ complianceFilter: status }, false, 'setComplianceFilter'),
        setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }, false, 'setSorting'),
        clearFilters: () => set({
          searchTerm: '',
          riskLevelFilter: 'all',
          complianceFilter: 'all',
          sortBy: 'name',
          sortOrder: 'asc'
        }, false, 'clearFilters'),
        
        // Computed selectors
        getFilteredVendors: () => {
          const state = get();
          let filtered = [...state.vendors];
          
          // Apply search filter
          if (state.searchTerm) {
            const searchLower = state.searchTerm.toLowerCase();
            filtered = filtered.filter(vendor => 
              vendor.name.toLowerCase().includes(searchLower) ||
              (vendor.industry && vendor.industry.toLowerCase().includes(searchLower))
            );
          }
          
          // Apply risk level filter
          if (state.riskLevelFilter !== 'all') {
            filtered = filtered.filter(vendor => vendor.risk_level === state.riskLevelFilter);
          }
          
          // Apply compliance filter
          if (state.complianceFilter !== 'all') {
            filtered = filtered.filter(vendor => vendor.compliance_status === state.complianceFilter);
          }
          
          // Apply sorting
          filtered.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (state.sortBy) {
              case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
              case 'risk_score':
                aValue = a.risk_score || 0;
                bValue = b.risk_score || 0;
                break;
              case 'last_assessment_date':
                aValue = new Date(a.last_assessment_date || 0);
                bValue = new Date(b.last_assessment_date || 0);
                break;
              default:
                return 0;
            }
            
            if (aValue < bValue) return state.sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return state.sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
          
          return filtered;
        },
        
        getVendorById: (id: string) => {
          return get().vendors.find(vendor => vendor.id === id);
        },
        
        getRiskDistribution: () => {
          const vendors = get().vendors;
          return {
            critical: vendors.filter(v => v.risk_level === 'Critical').length,
            high: vendors.filter(v => v.risk_level === 'High').length,
            medium: vendors.filter(v => v.risk_level === 'Medium').length,
            low: vendors.filter(v => v.risk_level === 'Low').length,
          };
        },
        
        getComplianceStats: () => {
          const vendors = get().vendors;
          return {
            compliant: vendors.filter(v => v.compliance_status === 'Compliant').length,
            partial: vendors.filter(v => v.compliance_status === 'Partial').length,
            nonCompliant: vendors.filter(v => v.compliance_status === 'Non-Compliant').length,
          };
        },
      }),
      {
        name: 'vendorsoluce-vendor-store',
        // Only persist non-sensitive data
        partialize: (state) => ({
          searchTerm: state.searchTerm,
          riskLevelFilter: state.riskLevelFilter,
          complianceFilter: state.complianceFilter,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    {
      name: 'vendorsoluce-vendor-store',
    }
  )
);