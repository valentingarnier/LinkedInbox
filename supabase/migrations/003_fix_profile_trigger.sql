-- Migration: Fix profile trigger to NOT auto-fill first_name and last_name
-- The user must manually enter their LinkedIn name

-- Update the handle_new_user function to only set avatar_url
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
    VALUES (
        NEW.id,
        NULL,  -- Don't auto-fill from Google
        NULL,  -- Don't auto-fill from Google
        NEW.raw_user_meta_data->>'avatar_url'  -- Only take avatar
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also clear existing profiles that were auto-filled (optional - run if you want to reset)
-- Uncomment the line below if you want to reset existing profiles:
-- UPDATE profiles SET first_name = NULL, last_name = NULL WHERE first_name IS NOT NULL;
