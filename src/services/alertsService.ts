import { supabase } from '@/integrations/supabase/client';

export interface Alert {
  id: string;
  from_currency: string;
  to_currency: string;
  target_rate: number;
  condition: 'above' | 'below';
  email: string;
  is_active: boolean;
  last_triggered_at?: string;
  last_triggered_rate?: number;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertRequest {
  from_currency: string;
  to_currency: string;
  target_rate: number;
  condition: 'above' | 'below';
  email: string;
}

export interface UpdateAlertRequest {
  target_rate?: number;
  condition?: 'above' | 'below';
  is_active?: boolean;
}

class AlertsService {
  async getAlerts(): Promise<Alert[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('rate_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        throw new Error('Failed to fetch alerts');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAlerts:', error);
      throw error;
    }
  }

  async createAlert(alertData: CreateAlertRequest): Promise<Alert> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('rate_alerts')
        .insert([{
          ...alertData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating alert:', error);
        throw new Error('Failed to create alert');
      }

      return data;
    } catch (error) {
      console.error('Error in createAlert:', error);
      throw error;
    }
  }

  async updateAlert(alertId: string, updates: UpdateAlertRequest): Promise<Alert> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('rate_alerts')
        .update(updates)
        .eq('id', alertId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating alert:', error);
        throw new Error('Failed to update alert');
      }

      return data;
    } catch (error) {
      console.error('Error in updateAlert:', error);
      throw error;
    }
  }

  async deleteAlert(alertId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('rate_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting alert:', error);
        throw new Error('Failed to delete alert');
      }
    } catch (error) {
      console.error('Error in deleteAlert:', error);
      throw error;
    }
  }

  async toggleAlert(alertId: string, isActive: boolean): Promise<Alert> {
    return this.updateAlert(alertId, { is_active: isActive });
  }
}

export const alertsService = new AlertsService();
