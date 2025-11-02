-- =====================================================
-- Initialize eLearning Course Management Database
-- =====================================================

-- Create database if it doesn't exist
-- Note: This needs to be run as a superuser
SELECT 'CREATE DATABASE elearning_courses'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'elearning_courses')\gexec

-- Connect to the database
\c elearning_courses

-- =====================================================
-- Create Categories Table
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on isActive for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_isActive ON categories("isActive");

-- Add comment
COMMENT ON TABLE categories IS 'Course categories';

-- =====================================================
-- Create Courses Table
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0,
    "totalRatings" INTEGER DEFAULT 0,
    "studentsEnrolled" INTEGER DEFAULT 0,
    "totalLessons" INTEGER DEFAULT 0,
    "totalDuration" INTEGER DEFAULT 0,
    "instructorId" VARCHAR(255),
    "instructorName" VARCHAR(255),
    "thumbnailUrl" VARCHAR(500),
    "previewVideoUrl" VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft',
    "isPublished" BOOLEAN DEFAULT false,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_category 
        FOREIGN KEY ("categoryId") 
        REFERENCES categories(id) 
        ON DELETE RESTRICT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_categoryId ON courses("categoryId");
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_instructorId ON courses("instructorId");
CREATE INDEX IF NOT EXISTS idx_courses_isPublished ON courses("isPublished");
CREATE INDEX IF NOT EXISTS idx_courses_createdAt ON courses("createdAt");

-- Add comments
COMMENT ON TABLE courses IS 'Course catalog';
COMMENT ON COLUMN courses.price IS 'Course price in USD';
COMMENT ON COLUMN courses.rating IS 'Average rating (0-5)';
COMMENT ON COLUMN courses."totalDuration" IS 'Total duration in minutes';
COMMENT ON COLUMN courses.status IS 'Course status: draft, published, or archived';

-- =====================================================
-- Create Function to Update UpdatedAt Timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updatedAt
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Insert Sample Data (Optional)
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, description, icon, "isActive") VALUES
    ('Web Development', 'Learn modern web development technologies', 'web-icon', true),
    ('Mobile Development', 'iOS and Android app development', 'mobile-icon', true),
    ('Data Science', 'Machine learning, AI, and data analysis', 'data-icon', true),
    ('DevOps', 'CI/CD, Docker, Kubernetes, and cloud technologies', 'devops-icon', true),
    ('Design', 'UI/UX design and graphic design', 'design-icon', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample courses (requires categories to exist)
INSERT INTO courses (title, description, price, "instructorId", "instructorName", "categoryId", status, "isPublished", tags, "totalLessons", "totalDuration") VALUES
    (
        'Complete Web Development Bootcamp',
        'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB',
        99.99,
        'inst-001',
        'John Doe',
        (SELECT id FROM categories WHERE name = 'Web Development' LIMIT 1),
        'published',
        true,
        ARRAY['javascript', 'react', 'nodejs', 'mongodb'],
        50,
        1200
    ),
    (
        'React Native: From Zero to Hero',
        'Build cross-platform mobile apps with React Native',
        79.99,
        'inst-002',
        'Jane Smith',
        (SELECT id FROM categories WHERE name = 'Mobile Development' LIMIT 1),
        'published',
        true,
        ARRAY['react-native', 'mobile', 'javascript'],
        40,
        900
    ),
    (
        'Python for Data Science',
        'Learn pandas, NumPy, Matplotlib, and Scikit-learn',
        89.99,
        'inst-003',
        'Mike Johnson',
        (SELECT id FROM categories WHERE name = 'Data Science' LIMIT 1),
        'published',
        true,
        ARRAY['python', 'data-science', 'machine-learning'],
        45,
        1100
    )
ON CONFLICT DO NOTHING;

-- =====================================================
-- Display Tables and Sample Data
-- =====================================================

-- Show all tables
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show sample data
SELECT 'Categories:' as info;
SELECT id, name, "isActive" FROM categories LIMIT 5;

SELECT 'Courses:' as info;
SELECT id, title, price, status, "categoryId" FROM courses LIMIT 5;

-- =====================================================
-- Grant Permissions (Optional)
-- =====================================================

-- Uncomment to grant permissions to a specific user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO elearning_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO elearning_user;

SELECT 'Database initialized successfully!' as status;

