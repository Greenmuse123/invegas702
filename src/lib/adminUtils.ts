import { SupabaseClient } from '@supabase/supabase-js';

export async function checkAdminStatus(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.log('No user ID provided for admin check');
      return false;
    }

    // Check admins table
    const { data: adminsData, error: adminsError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId);

    if (adminsError) {
      console.error('Admin check error (admins table):', adminsError);
    }

    // If found in admins table, return true
    if (Array.isArray(adminsData) && adminsData.length > 0) {
      console.log('Admin check result: Found in admins table', { userId });
      return true;
    }

    // Fallback: Check user_roles table for role = 'admin'
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (rolesError) {
      console.error('Admin check error (user_roles table):', rolesError);
    }

    const isAdmin = Array.isArray(rolesData) && rolesData.length > 0;
    console.log('Admin check result: Found in user_roles table', { isAdmin, userId });
    return isAdmin;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}