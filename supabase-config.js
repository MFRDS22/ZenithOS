// CONFIGURAZIONE CENTRALE SUPABASE
const SUPABASE_URL = "https://dutgtlznepbsmkuncgug.supabase.co/rest/v1";
const SUPABASE_KEY = sb_publishable_nvT77M2hMddasqrL1plQKw_r_G6n5VR;

// Inizializzazione del client Supabase globale
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
