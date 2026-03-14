import { supabase } from '../config/supabase.js';

export const setupAdminUser = async () => {
  const adminEmail = 'crochetwebsite19@gmail.com';

  try {
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
       console.error("Error fetching users for admin setup:", usersError);
       return;
    }

    const existingAdmin = usersData.users.find(u => u.email === adminEmail);

    if (!existingAdmin) {
       console.log(`Admin user ${adminEmail} not found. Skipping setup.`);
       return;
    }

    // Ensure the user has the is_admin flag in app_metadata
    if (!existingAdmin.app_metadata?.is_admin || !existingAdmin.user_metadata?.is_admin) {
        console.log(`Updating existing user ${adminEmail} to admin.`);
        const { error } = await supabase.auth.admin.updateUserById(
          existingAdmin.id,
          { 
            app_metadata: { ...existingAdmin.app_metadata, is_admin: true },
            user_metadata: { ...existingAdmin.user_metadata, is_admin: true }
          }
        );
        if (error) {
            console.error("Error updating admin user metadata:", error);
        } else {
            console.log("Admin user metadata successfully updated!");
        }
    }
  } catch (err) {
    console.error("Failed to setup admin user:", err);
  }
};
