import { DataSource } from 'typeorm';
import { Skill } from '../entities/skill.entity';

const skills = [
  // Languages
  { name: 'JavaScript', category: 'language' },
  { name: 'TypeScript', category: 'language' },
  { name: 'Python', category: 'language' },
  { name: 'Java', category: 'language' },
  { name: 'C#', category: 'language' },
  { name: 'Go', category: 'language' },
  { name: 'PHP', category: 'language' },
  { name: 'Ruby', category: 'language' },
  { name: 'Kotlin', category: 'language' },
  { name: 'Swift', category: 'language' },
  { name: 'Rust', category: 'language' },
  { name: 'C++', category: 'language' },
  { name: 'SQL', category: 'language' },

  // Frontend
  { name: 'React', category: 'framework' },
  { name: 'Vue.js', category: 'framework' },
  { name: 'Angular', category: 'framework' },
  { name: 'Next.js', category: 'framework' },
  { name: 'Nuxt.js', category: 'framework' },
  { name: 'Svelte', category: 'framework' },
  { name: 'HTML', category: 'framework' },
  { name: 'CSS', category: 'framework' },
  { name: 'TailwindCSS', category: 'framework' },
  { name: 'Bootstrap', category: 'framework' },

  // Backend
  { name: 'Node.js', category: 'framework' },
  { name: 'Express.js', category: 'framework' },
  { name: 'NestJS', category: 'framework' },
  { name: 'Spring Boot', category: 'framework' },
  { name: 'Django', category: 'framework' },
  { name: 'FastAPI', category: 'framework' },
  { name: 'Flask', category: 'framework' },
  { name: 'Laravel', category: 'framework' },
  { name: '.NET Core', category: 'framework' },
  { name: 'Ruby on Rails', category: 'framework' },

  // Mobile
  { name: 'React Native', category: 'framework' },
  { name: 'Flutter', category: 'framework' },
  { name: 'iOS', category: 'framework' },
  { name: 'Android', category: 'framework' },

  // Database
  { name: 'PostgreSQL', category: 'database' },
  { name: 'MySQL', category: 'database' },
  { name: 'MongoDB', category: 'database' },
  { name: 'Redis', category: 'database' },
  { name: 'Elasticsearch', category: 'database' },
  { name: 'SQL Server', category: 'database' },
  { name: 'Oracle', category: 'database' },
  { name: 'SQLite', category: 'database' },

  // DevOps & Cloud
  { name: 'Docker', category: 'devops' },
  { name: 'Kubernetes', category: 'devops' },
  { name: 'AWS', category: 'devops' },
  { name: 'Azure', category: 'devops' },
  { name: 'GCP', category: 'devops' },
  { name: 'CI/CD', category: 'devops' },
  { name: 'Jenkins', category: 'devops' },
  { name: 'GitLab CI', category: 'devops' },
  { name: 'GitHub Actions', category: 'devops' },
  { name: 'Terraform', category: 'devops' },
  { name: 'Ansible', category: 'devops' },
  { name: 'Linux', category: 'devops' },
  { name: 'Nginx', category: 'devops' },

  // Data & AI
  { name: 'Machine Learning', category: 'data' },
  { name: 'Deep Learning', category: 'data' },
  { name: 'TensorFlow', category: 'data' },
  { name: 'PyTorch', category: 'data' },
  { name: 'Pandas', category: 'data' },
  { name: 'NumPy', category: 'data' },
  { name: 'Spark', category: 'data' },
  { name: 'Hadoop', category: 'data' },
  { name: 'NLP', category: 'data' },
  { name: 'Computer Vision', category: 'data' },

  // Tools
  { name: 'Git', category: 'tool' },
  { name: 'Jira', category: 'tool' },
  { name: 'Confluence', category: 'tool' },
  { name: 'Figma', category: 'tool' },
  { name: 'Postman', category: 'tool' },
  { name: 'Swagger', category: 'tool' },
  { name: 'GraphQL', category: 'tool' },
  { name: 'REST API', category: 'tool' },
  { name: 'Agile', category: 'tool' },
  { name: 'Scrum', category: 'tool' },
];

export async function seedSkills(dataSource: DataSource) {
  const skillRepository = dataSource.getRepository(Skill);

  for (const skill of skills) {
    const existing = await skillRepository.findOne({ where: { name: skill.name } });
    if (!existing) {
      await skillRepository.save(skillRepository.create(skill));
    }
  }

  console.log('Skills seeded successfully!');
}
