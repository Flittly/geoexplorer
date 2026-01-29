from supabase import create_client, Client
from config import settings

def get_supabase_client() -> Client:
    """Create and return a Supabase client instance."""
    if not settings.supabase_url or not settings.supabase_key:
        raise ValueError(
            "Supabase credentials not configured. "
            "Please set SUPABASE_URL and SUPABASE_KEY environment variables."
        )
    
    return create_client(settings.supabase_url, settings.supabase_key)

# Global client instance
supabase: Client = None

def init_supabase():
    """Initialize the global Supabase client."""
    global supabase
    try:
        supabase = get_supabase_client()
        print("✅ Supabase client initialized successfully")
    except ValueError as e:
        print(f"⚠️ Warning: {e}")
        supabase = None

def get_db() -> Client:
    """Get the Supabase client for dependency injection."""
    if supabase is None:
        raise RuntimeError("Supabase client not initialized")
    return supabase
