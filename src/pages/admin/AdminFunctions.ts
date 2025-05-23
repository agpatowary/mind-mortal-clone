
import { supabase } from '@/integrations/supabase/client';

export const makeUserAdmin = async (userId: string) => {
  try {
    // First check if user already has admin role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If user doesn't have admin role yet, add it
    if (!existingRole) {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });
        
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error making user admin:', error);
    return { success: false, error };
  }
};

export const makeSpecificUserAdmin = async () => {
  const EMAIL_TO_MAKE_ADMIN = 'agpatowary@gmail.com';
  
  try {
    // Find user by email using auth API
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) throw userError;
    
    const targetUser = users.users.find(user => user.email === EMAIL_TO_MAKE_ADMIN);
    
    if (!targetUser) {
      return { success: false, message: `User with email ${EMAIL_TO_MAKE_ADMIN} not found` };
    }
    
    // Make the user admin
    return await makeUserAdmin(targetUser.id);
  } catch (error) {
    console.error('Error making specific user admin:', error);
    return { success: false, error };
  }
};
