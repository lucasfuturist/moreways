-- 1. Attribution Engine (High Volume)
CREATE DATABASE mw_pixel_db;

-- 2. Law Engine (Vector/Graph)
CREATE DATABASE mw_law_db;

-- 3. Web/Portal (Consumer Auth)
CREATE DATABASE mw_web_db;

-- 4. CRM (Clients, Matters, Staff)
CREATE DATABASE mw_crm_db;

-- 5. Form Engine (Schemas, Submissions)
CREATE DATABASE mw_forms_db;

-- Grant Access
GRANT ALL PRIVILEGES ON DATABASE mw_pixel_db TO admin;
GRANT ALL PRIVILEGES ON DATABASE mw_law_db TO admin;
GRANT ALL PRIVILEGES ON DATABASE mw_web_db TO admin;
GRANT ALL PRIVILEGES ON DATABASE mw_crm_db TO admin;
GRANT ALL PRIVILEGES ON DATABASE mw_forms_db TO admin;

-- Note: Extensions like 'vector' and 'ltree' must be enabled per DB later
