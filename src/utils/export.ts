
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import * as pdfjs from 'pdfjs-dist';

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
    
    // Basic parsing logic - this could be improved with more sophisticated NLP approaches
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
    
    // Extract email with regex
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emailMatch = extractedText.match(emailRegex);
    if (emailMatch && emailMatch.length > 0) {
      parsedData.personalInfo.email = emailMatch[0];
    }
    
    // Extract phone number with regex
    const phoneRegex = /(\+?[0-9][0-9\s-]{7,})/g;
    const phoneMatch = extractedText.match(phoneRegex);
    if (phoneMatch && phoneMatch.length > 0) {
      parsedData.personalInfo.phone = phoneMatch[0];
    }
    
    // Try to extract skills by looking for common skill section headers
    const skillSectionRegex = /(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[\s\S]*?(EXPERIENCE|EDUCATION|PROJECTS|WORK|EMPLOYMENT)/i;
    const skillSectionMatch = extractedText.match(skillSectionRegex);
    
    if (skillSectionMatch && skillSectionMatch[0]) {
      const skillText = skillSectionMatch[0];
      // Common programming languages and technologies
      const technologies = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C\\+\\+', 'Ruby', 'PHP',
        'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django',
        'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes'
      ];
      
      const skillRegex = new RegExp(`(${technologies.join('|')})`, 'gi');
      const skillMatches = skillText.match(skillRegex);
      
      if (skillMatches) {
        parsedData.skills = Array.from(new Set(skillMatches));
      }
    }
    
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
