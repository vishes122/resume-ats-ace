import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the worker source for PDF.js
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const toPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(
      imgData,
      'JPEG',
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    link?: string;
    technologies: string[]; // Changed from optional to required
  }>;
  certifications?: string[];
  hobbies?: string[];
  extraCurricular?: string[];
  softSkills?: string[];
  font?: string;
  template?: string;
}

// Browser-compatible way to export Word document by creating a simple HTML file
export const toWord = async (data: ResumeData, fileName: string) => {
  try {
    // Create HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.personalInfo.fullName}'s Resume</title>
        <style>
          body { font-family: ${data.font || 'Arial'}, sans-serif; line-height: 1.6; margin: 1in; }
          h1 { margin: 0; font-size: 24pt; }
          h2 { margin-top: 20px; border-bottom: 1px solid #ccc; font-size: 14pt; }
          .contact-info { margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .item { margin-bottom: 10px; }
          .item-header { display: flex; justify-content: space-between; font-weight: bold; }
          .date { color: #666; }
          ul { margin-top: 5px; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
          .skills-list div { background: #f0f0f0; padding: 3px 8px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <header>
          <h1>${data.personalInfo.fullName}</h1>
          <div class="contact-info">
            ${data.personalInfo.email ? `Email: ${data.personalInfo.email}<br>` : ''}
            ${data.personalInfo.phone ? `Phone: ${data.personalInfo.phone}<br>` : ''}
            ${data.personalInfo.location ? `Location: ${data.personalInfo.location}` : ''}
          </div>
        </header>
    `;

    // Add Experience section
    if (data.experiences && data.experiences.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Experience</h2>
      `;

      data.experiences.forEach(exp => {
        htmlContent += `
          <div class="item">
            <div class="item-header">
              <span>${exp.position} at ${exp.company}</span>
              <span class="date">${exp.startDate} - ${exp.endDate}</span>
            </div>
            <p>${exp.description}</p>
          </div>
        `;
      });

      htmlContent += `</section>`;
    }

    // Add Education section
    if (data.education && data.education.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Education</h2>
      `;

      data.education.forEach(edu => {
        htmlContent += `
          <div class="item">
            <div class="item-header">
              <span>${edu.degree} - ${edu.school}</span>
              <span class="date">${edu.graduationDate}</span>
            </div>
            ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
          </div>
        `;
      });

      htmlContent += `</section>`;
    }

    // Add Projects section
    if (data.projects && data.projects.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Projects</h2>
      `;

      data.projects.forEach(project => {
        htmlContent += `
          <div class="item">
            <div class="item-header">
              <span>${project.title}</span>
              ${project.startDate ? `<span class="date">${project.startDate} - ${project.endDate || 'Present'}</span>` : ''}
            </div>
            <p>${project.description}</p>
            ${project.link ? `<p>Link: <a href="${project.link}">${project.link}</a></p>` : ''}
            ${project.technologies && project.technologies.length > 0 ? 
              `<div class="skills-list">
                ${project.technologies.map(tech => `<div>${tech}</div>`).join('')}
              </div>` : ''}
          </div>
        `;
      });

      htmlContent += `</section>`;
    }

    // Add Skills section
    if (data.skills && data.skills.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Skills</h2>
          <div class="skills-list">
            ${data.skills.map(skill => `<div>${skill}</div>`).join('')}
          </div>
        </section>
      `;
    }

    // Add Soft Skills section
    if (data.softSkills && data.softSkills.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Soft Skills</h2>
          <div class="skills-list">
            ${data.softSkills.map(skill => `<div>${skill}</div>`).join('')}
          </div>
        </section>
      `;
    }

    // Add Certifications section
    if (data.certifications && data.certifications.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Certifications</h2>
          <ul>
            ${data.certifications.map(cert => `<li>${cert}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    // Add Hobbies section
    if (data.hobbies && data.hobbies.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Hobbies</h2>
          <ul>
            ${data.hobbies.map(hobby => `<li>${hobby}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    // Add Extra Curricular section
    if (data.extraCurricular && data.extraCurricular.length > 0) {
      htmlContent += `
        <section class="section">
          <h2>Extra Curricular Activities</h2>
          <ul>
            ${data.extraCurricular.map(activity => `<li>${activity}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    // Close the HTML
    htmlContent += `
      </body>
      </html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    
    // Use saveAs to download the file
    saveAs(blob, fileName);
    
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};

// Parse resume PDF and extract content
export const parseResumePDF = async (file: File): Promise<Partial<ResumeData>> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    
    // Load the PDF
    const loadingTask = pdfjs.getDocument(typedArray);
    const pdf = await loadingTask.promise;
    
    let extractedText = '';
    
    // Loop through each page and extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      extractedText += pageText + ' ';
    }
    
    console.log("Extracted text from PDF:", extractedText);
    
    // Enhanced parsing logic - improved from the original implementation
    const parsedData: Partial<ResumeData> = {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
      },
      experiences: [],
      education: [],
      skills: [],
      projects: []
    };
    
    // Extract name - look for name at beginning of document or after common headers
    const nameRegex = /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)|(?:Name:|NAME:)\s*([A-Z][a-z]+(?: [A-Z][a-z]+)+)/i;
    const nameMatch = extractedText.match(nameRegex);
    if (nameMatch) {
      parsedData.personalInfo.fullName = nameMatch[1] || nameMatch[2];
    }
    
    // Extract email with regex (more robust pattern)
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emailMatch = extractedText.match(emailRegex);
    if (emailMatch && emailMatch.length > 0) {
      parsedData.personalInfo.email = emailMatch[0];
    }
    
    // Extract phone number with improved regex
    const phoneRegex = /(\+?[\d]{1,3}[-\.\s]?)?(\(?\d{3}\)?[-\.\s]?\d{3}[-\.\s]?\d{4}|\d{10})/g;
    const phoneMatch = extractedText.match(phoneRegex);
    if (phoneMatch && phoneMatch.length > 0) {
      parsedData.personalInfo.phone = phoneMatch[0];
    }
    
    // Extract location - look for common patterns
    const locationRegex = /(?:Address:|Location:|City:|LOCATION:)\s*([\w\s,.]+)(?=\n|,|\s{2}|$)/i;
    const locationMatch = extractedText.match(locationRegex);
    if (locationMatch && locationMatch[1]) {
      parsedData.personalInfo.location = locationMatch[1].trim();
    }
    
    // Extract skills - improved to catch more technologies
    const skillSectionRegex = /(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES|TOOLS|LANGUAGES)[\s\S]*?(EXPERIENCE|EDUCATION|PROJECTS|WORK|EMPLOYMENT|CERTIFICATIONS|ACHIEVEMENTS)/i;
    const skillSectionMatch = extractedText.match(skillSectionRegex);
    
    if (skillSectionMatch && skillSectionMatch[0]) {
      let skillText = skillSectionMatch[0];
      
      // Common programming languages and technologies - expanded list
      const technologies = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C\\+\\+', 'Ruby', 'PHP', 'Swift', 'Kotlin',
        'HTML', 'CSS', 'SASS', 'LESS', 'React', 'Angular', 'Vue', 'Svelte', 'Node.js', 'Express', 'Django',
        'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Rails', 'Next.js', 'Nuxt', 'Gatsby',
        'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Firebase', 'Supabase',
        'AWS', 'Azure', 'GCP', 'Heroku', 'Vercel', 'Netlify', 'Docker', 'Kubernetes',
        'REST', 'GraphQL', 'gRPC', 'API', 'JSON', 'XML', 'WebSockets',
        'Git', 'GitHub', 'GitLab', 'Bitbucket', 'CI/CD', 'Jenkins', 'GitHub Actions',
        'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Trello',
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Science',
        'UI/UX', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator'
      ];
      
      // First try to extract skills that are separated by commas or bullets
      const commaSkillsRegex = /([A-Za-z0-9#\+\-\.]+(?:\s[A-Za-z0-9#\+\-\.]+)*(?:,\s*|\s*\•\s*|\s*\-\s*|\s*\n\s*))/g;
      const commaSkillMatches = skillText.match(commaSkillsRegex);
      
      let extractedSkills = new Set<string>();
      
      if (commaSkillMatches) {
        commaSkillMatches.forEach(skill => {
          const cleanedSkill = skill.replace(/[,\•\-\n\r]/g, '').trim();
          if (cleanedSkill && cleanedSkill.length > 1) {
            extractedSkills.add(cleanedSkill);
          }
        });
      }
      
      // Also look for known technology terms
      const techRegex = new RegExp(`\\b(${technologies.join('|')})\\b`, 'gi');
      const techMatches = extractedText.match(techRegex);
      
      if (techMatches) {
        techMatches.forEach(tech => {
          extractedSkills.add(tech.trim());
        });
      }
      
      parsedData.skills = Array.from(extractedSkills);
    }
    
    // Try to extract experience information
    const experienceSectionRegex = /(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)[\s\S]*?(EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|$)/i;
    const experienceSectionMatch = extractedText.match(experienceSectionRegex);
    
    if (experienceSectionMatch && experienceSectionMatch[1]) {
      const experienceSection = experienceSectionMatch[0];
      // Look for company names, positions and dates
      const expEntryRegex = /([A-Z][A-Za-z0-9\s&.,]+)[\s\|•]*([A-Za-z0-9\s.,]+)[\s\|•]*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s\-\–—]2\d{3}\s*(?:[-\–—]\s*(?:Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s\-\–—]2\d{3})?)?)/gi;
      
      const expMatches = [...experienceSection.matchAll(expEntryRegex)];
      
      if (expMatches.length > 0) {
        parsedData.experiences = expMatches.map(match => ({
          company: match[1]?.trim() || 'Unknown Company',
          position: match[2]?.trim() || 'Position',
          startDate: match[3]?.split(/[-\–—]/)[0]?.trim() || 'Unknown Start Date',
          endDate: (match[3]?.includes('Present') || match[3]?.includes('Current')) ? 
                  'Present' : 
                  match[3]?.split(/[-\–—]/)[1]?.trim() || 'Current',
          description: 'Experience extracted from resume',
        }));
      }
    }
    
    // Try to extract education information
    const educationSectionRegex = /(EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)[\s\S]*?(EXPERIENCE|WORK|PROFESSIONAL EXPERIENCE|PROJECTS|SKILLS|$)/i;
    const educationSectionMatch = extractedText.match(educationSectionRegex);
    
    if (educationSectionMatch && educationSectionMatch[1]) {
      const educationSection = educationSectionMatch[0];
      
      // Look for school names, degrees and graduation dates
      const eduEntryRegex = /(University|College|Institute|School) of ([A-Za-z\s&.,]+)[\s\|•]*([A-Za-z0-9\s.,]+)[\s\|•]*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s\-\–—]2\d{3})/gi;
      
      const eduMatches = [...educationSection.matchAll(eduEntryRegex)];
      
      if (eduMatches.length > 0) {
        parsedData.education = eduMatches.map(match => ({
          school: `${match[1]} of ${match[2]?.trim()}` || 'Unknown Institution',
          degree: match[3]?.trim() || 'Degree',
          graduationDate: match[4]?.trim() || 'Unknown Graduation Date',
          gpa: '',
        }));
      } else {
        // Try another pattern if the first one doesn't match
        const altEduRegex = /([A-Z][A-Za-z\s&.,]+(?:University|College|Institute|School))[\s\|•]*([A-Za-z0-9\s.,]+)[\s\|•]*(2\d{3}(?:\s*[-\–—]\s*2\d{3})?)/gi;
        
        const altEduMatches = [...educationSection.matchAll(altEduRegex)];
        
        if (altEduMatches.length > 0) {
          parsedData.education = altEduMatches.map(match => ({
            school: match[1]?.trim() || 'Unknown Institution',
            degree: match[2]?.trim() || 'Degree',
            graduationDate: match[3]?.trim() || 'Unknown Graduation Date',
            gpa: '',
          }));
        }
      }
    }
    
    // Try to extract projects
    const projectsSectionRegex = /(PROJECTS|PERSONAL PROJECTS|PROFESSIONAL PROJECTS)[\s\S]*?(EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|$)/i;
    const projectsSectionMatch = extractedText.match(projectsSectionRegex);
    
    if (projectsSectionMatch && projectsSectionMatch[1]) {
      const projectsSection = projectsSectionMatch[0];
      
      // Look for project titles and descriptions
      const projEntryRegex = /([A-Z][A-Za-z0-9\s&.,]+)[\s\|•]*([A-Za-z0-9\s.,]+)[\s\|•]*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s\-\–—]2\d{3}(?:\s*[-\–—]\s*(?:Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s\-\–—]2\d{3}))?)?/gi;
      
      const projMatches = [...projectsSection.matchAll(projEntryRegex)];
      
      if (projMatches.length > 0) {
        parsedData.projects = projMatches.map(match => ({
          title: match[1]?.trim() || 'Project Title',
          description: match[2]?.trim() || 'Project Description',
          startDate: match[3]?.split(/[-\–—]/)[0]?.trim() || undefined,
          endDate: (match[3]?.includes('Present') || match[3]?.includes('Current')) ? 
                  'Present' : 
                  match[3]?.split(/[-\–—]/)[1]?.trim() || undefined,
          technologies: [], // Empty array but required
        }));
      }
    }
    
    console.log("Parsed resume data:", parsedData);
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing resume PDF:', error);
    throw error;
  }
};

export const generateAiSuggestions = async (data: ResumeData, section: string): Promise<string> => {
  // This is a placeholder function
  // In a real implementation, this would call an AI service API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (section === 'experience') {
        resolve("Consider quantifying your achievements with metrics. For example, 'Increased sales by 20%' instead of 'Increased sales'.");
      } else if (section === 'skills') {
        resolve("Add some trending skills in your industry like AI/ML, cloud services, or data visualization tools.");
      } else if (section === 'summary') {
        resolve("A concise professional summary highlighting your unique value proposition would make your resume stand out.");
      } else {
        resolve("Make sure your resume is tailored to the specific job you're applying for.");
      }
    }, 1000);
  });
};
