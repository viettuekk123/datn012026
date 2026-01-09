-- =============================================
-- IT JOB PLATFORM DATABASE
-- PostgreSQL Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS & AUTH
-- =============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employer', 'candidate')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- 2. COMPANIES (Employer Profile)
-- =============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
    location VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_companies_user ON companies(user_id);

-- =============================================
-- 3. CANDIDATE PROFILES
-- =============================================

CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    title VARCHAR(255), -- "Backend Developer", "Fullstack Engineer"
    experience_years INT DEFAULT 0,
    expected_salary INT, -- VND
    work_type VARCHAR(50), -- 'onsite', 'remote', 'hybrid'
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_candidate_user ON candidate_profiles(user_id);

-- =============================================
-- 4. SKILLS (Master Data)
-- =============================================

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- 'language', 'framework', 'database', 'devops', 'tool'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);

-- Insert common IT skills
INSERT INTO skills (name, category) VALUES
-- Languages
('JavaScript', 'language'),
('TypeScript', 'language'),
('Python', 'language'),
('Java', 'language'),
('C#', 'language'),
('Go', 'language'),
('PHP', 'language'),
('Ruby', 'language'),
('Kotlin', 'language'),
('Swift', 'language'),
('Rust', 'language'),
('C++', 'language'),
('SQL', 'language'),

-- Frontend
('React', 'framework'),
('Vue.js', 'framework'),
('Angular', 'framework'),
('Next.js', 'framework'),
('Nuxt.js', 'framework'),
('Svelte', 'framework'),
('HTML', 'framework'),
('CSS', 'framework'),
('TailwindCSS', 'framework'),
('Bootstrap', 'framework'),

-- Backend
('Node.js', 'framework'),
('Express.js', 'framework'),
('NestJS', 'framework'),
('Spring Boot', 'framework'),
('Django', 'framework'),
('FastAPI', 'framework'),
('Flask', 'framework'),
('Laravel', 'framework'),
('.NET Core', 'framework'),
('Ruby on Rails', 'framework'),

-- Mobile
('React Native', 'framework'),
('Flutter', 'framework'),
('iOS', 'framework'),
('Android', 'framework'),

-- Database
('PostgreSQL', 'database'),
('MySQL', 'database'),
('MongoDB', 'database'),
('Redis', 'database'),
('Elasticsearch', 'database'),
('SQL Server', 'database'),
('Oracle', 'database'),
('SQLite', 'database'),

-- DevOps & Cloud
('Docker', 'devops'),
('Kubernetes', 'devops'),
('AWS', 'devops'),
('Azure', 'devops'),
('GCP', 'devops'),
('CI/CD', 'devops'),
('Jenkins', 'devops'),
('GitLab CI', 'devops'),
('GitHub Actions', 'devops'),
('Terraform', 'devops'),
('Ansible', 'devops'),
('Linux', 'devops'),
('Nginx', 'devops'),

-- Data & AI
('Machine Learning', 'data'),
('Deep Learning', 'data'),
('TensorFlow', 'data'),
('PyTorch', 'data'),
('Pandas', 'data'),
('NumPy', 'data'),
('Spark', 'data'),
('Hadoop', 'data'),
('NLP', 'data'),
('Computer Vision', 'data'),

-- Tools
('Git', 'tool'),
('Jira', 'tool'),
('Confluence', 'tool'),
('Figma', 'tool'),
('Postman', 'tool'),
('Swagger', 'tool'),
('GraphQL', 'tool'),
('REST API', 'tool'),
('Agile', 'tool'),
('Scrum', 'tool');

-- =============================================
-- 5. JOBS
-- =============================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(50), -- 'intern', 'fresher', 'junior', 'middle', 'senior', 'lead', 'manager'
    experience_min INT DEFAULT 0,
    experience_max INT,
    salary_min INT,
    salary_max INT,
    salary_visible BOOLEAN DEFAULT true,
    location VARCHAR(255),
    work_type VARCHAR(50) DEFAULT 'onsite', -- 'onsite', 'remote', 'hybrid'
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    is_active BOOLEAN DEFAULT true,
    deadline DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_level ON jobs(level);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);

-- =============================================
-- 6. JOB SKILLS (Many-to-Many)
-- =============================================

CREATE TABLE job_skills (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true, -- required vs nice-to-have
    PRIMARY KEY (job_id, skill_id)
);

CREATE INDEX idx_job_skills_job ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill ON job_skills(skill_id);

-- =============================================
-- 7. CVs (Original Files)
-- =============================================

CREATE TABLE cvs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    file_type VARCHAR(20), -- 'pdf', 'docx', 'image'
    raw_text TEXT, -- extracted text
    is_default BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cvs_user ON cvs(user_id);

-- =============================================
-- 8. CV PARSED (NER Output)
-- =============================================

CREATE TABLE cv_parsed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cv_id UUID UNIQUE NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
    
    -- Parsed fields from NER
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    
    -- Arrays stored as JSON for flexibility
    positions JSONB DEFAULT '[]', -- ["Backend Developer", "Software Engineer"]
    organizations JSONB DEFAULT '[]', -- ["FPT Software", "Shopee"]
    years JSONB DEFAULT '[]', -- ["2020-2024", "2018-2020"]
    degrees JSONB DEFAULT '[]', -- ["Kỹ sư CNTT", "Thạc sĩ"]
    schools JSONB DEFAULT '[]', -- ["Đại học Bách Khoa", "FPT University"]
    
    parsed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cv_parsed_cv ON cv_parsed(cv_id);

-- =============================================
-- 9. CV SKILLS (Many-to-Many)
-- =============================================

CREATE TABLE cv_skills (
    cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    confidence DECIMAL(3,2) DEFAULT 1.0, -- NER confidence score
    PRIMARY KEY (cv_id, skill_id)
);

CREATE INDEX idx_cv_skills_cv ON cv_skills(cv_id);
CREATE INDEX idx_cv_skills_skill ON cv_skills(skill_id);

-- =============================================
-- 10. APPLICATIONS
-- =============================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cv_id UUID NOT NULL REFERENCES cvs(id),
    
    match_score DECIMAL(5,2), -- 0-100
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    employer_note TEXT,
    
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(job_id, candidate_id) -- 1 candidate chỉ apply 1 lần/job
);

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_match ON applications(match_score DESC);
CREATE INDEX idx_applications_applied ON applications(applied_at DESC);

-- =============================================
-- 11. VIEWS (Tiện query)
-- =============================================

-- View: Job với skills
CREATE VIEW v_jobs_with_skills AS
SELECT 
    j.*,
    c.name as company_name,
    c.logo_url as company_logo,
    ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
FROM jobs j
JOIN companies c ON j.company_id = c.id
LEFT JOIN job_skills js ON j.id = js.job_id
LEFT JOIN skills s ON js.skill_id = s.id
GROUP BY j.id, c.name, c.logo_url;

-- View: CV với skills
CREATE VIEW v_cvs_with_skills AS
SELECT 
    cv.*,
    cp.name as parsed_name,
    cp.email as parsed_email,
    cp.phone as parsed_phone,
    cp.positions,
    cp.organizations,
    ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
FROM cvs cv
LEFT JOIN cv_parsed cp ON cv.id = cp.cv_id
LEFT JOIN cv_skills cs ON cv.id = cs.cv_id
LEFT JOIN skills s ON cs.skill_id = s.id
GROUP BY cv.id, cp.id;

-- View: Applications với thông tin đầy đủ
CREATE VIEW v_applications_full AS
SELECT 
    a.*,
    j.title as job_title,
    c.name as company_name,
    cp.name as candidate_name,
    cp.email as candidate_email,
    cp.phone as candidate_phone
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN companies c ON j.company_id = c.id
LEFT JOIN cv_parsed cp ON a.cv_id = cp.cv_id;

-- =============================================
-- 12. FUNCTIONS
-- =============================================

-- Function: Tính match score
CREATE OR REPLACE FUNCTION calculate_match_score(p_cv_id UUID, p_job_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    v_job_skills INT[];
    v_cv_skills INT[];
    v_matched INT;
    v_total INT;
BEGIN
    -- Get job skills
    SELECT ARRAY_AGG(skill_id) INTO v_job_skills
    FROM job_skills WHERE job_id = p_job_id;
    
    -- Get CV skills
    SELECT ARRAY_AGG(skill_id) INTO v_cv_skills
    FROM cv_skills WHERE cv_id = p_cv_id;
    
    -- Handle null cases
    IF v_job_skills IS NULL OR v_cv_skills IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Count matched skills
    SELECT COUNT(*) INTO v_matched
    FROM unnest(v_job_skills) js
    WHERE js = ANY(v_cv_skills);
    
    v_total := array_length(v_job_skills, 1);
    
    IF v_total = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((v_matched::DECIMAL / v_total) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER tr_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_companies_updated BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_candidate_profiles_updated BEFORE UPDATE ON candidate_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_jobs_updated BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_applications_updated BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 13. SAMPLE DATA (Optional - for testing)
-- =============================================

-- Admin user (password: admin123)
-- INSERT INTO users (email, password_hash, role) VALUES
-- ('admin@jobplatform.com', '$2b$10$...', 'admin');
