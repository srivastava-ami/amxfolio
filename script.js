document.addEventListener('DOMContentLoaded', () => {
    fetch('portfolio.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderPortfolio(data);
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error);
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #e2e8f0;">
                    <h1>Error Loading Portfolio</h1>
                    <p>Could not load <strong>portfolio.json</strong>. Please ensure the file exists and is a valid JSON.</p>
                    <p style="color: #f87171;">${error.message}</p>
                </div>
            `;
        });
});

function renderPortfolio(data) {
    // Function to safely get element and set content/hide if no content
    const setContentOrHide = (id, content, element = 'div') => {
        const el = document.getElementById(id);
        const parentSection = el.closest('section') || el.closest('header');
        if (content && content.length > 0) {
            el.textContent = content;
            if (parentSection) {
                parentSection.classList.remove('hidden');
            }
        } else {
            if (parentSection) {
                parentSection.classList.add('hidden');
            }
        }
    };

    // Personal Info
    if (data.personal) {
        setContentOrHide('name', data.personal.name);
        setContentOrHide('title', data.personal.title);
        setContentOrHide('tagline', data.personal.tagline);
        setContentOrHide('location', data.personal.location ? `📍 ${data.personal.location}` : '');
        setContentOrHide('summary', data.personal.summary);
        const profilePictureContainer = document.getElementById('profile-picture-container');
        if (data.personal.profilePicture) {
            const img = document.createElement('img');
            img.src = data.personal.profilePicture;
            img.alt = `${data.personal.name || 'Profile'} picture`;
            profilePictureContainer.innerHTML = ''; // Clear any existing content
            profilePictureContainer.appendChild(img);
        } else {
            profilePictureContainer.classList.add('hidden'); // Hide the container if no picture is available
        }

        // Contact
        const contactDiv = document.getElementById('contact');
        if (data.personal.email || data.personal.linkedin || data.personal.github) {
            contactDiv.innerHTML = '';
            const contactFields = ['email', 'linkedin', 'github'];
            contactFields.forEach(field => {
                if (data.personal[field]) {
                    const link = document.createElement('a');
                    link.className = 'contact-item';
                    link.textContent = field === 'email' ? data.personal[field] : field.charAt(0).toUpperCase() + field.slice(1);
                    link.href = field === 'email' ? `mailto:${data.personal[field]}` : data.personal[field];
                    if (field !== 'email') {
                        link.target = '_blank';
                    }
                    contactDiv.appendChild(link);
                }
            });
        } else {
            contactDiv.style.display = 'none';
        }
    } else {
        document.getElementById('headerSection').classList.add('hidden');
    }

    // Highlights
    const highlightsDiv = document.getElementById('highlights');
    const highlightsSection = document.getElementById('highlightsSection');
    if (data.highlights && data.highlights.length > 0) {
        highlightsDiv.innerHTML = '';
        data.highlights.forEach(highlight => {
            const highlightDiv = document.createElement('div');
            highlightDiv.className = 'highlight-card';
            highlightDiv.innerHTML = `
                <span class="highlight-icon">${highlight.icon || ''}</span>
                <div class="highlight-metric">${highlight.metric || ''}</div>
                <div class="highlight-description">${highlight.description || ''}</div>
            `;
            highlightsDiv.appendChild(highlightDiv);
        });
        highlightsSection.classList.remove('hidden');
    } else {
        highlightsSection.classList.add('hidden');
    }

    // Experience
    const experienceDiv = document.getElementById('experience');
    const experienceSection = document.getElementById('experienceSection');
    if (data.experience && data.experience.length > 0) {
        experienceDiv.innerHTML = '';
        data.experience.forEach(exp => {
            const expDiv = document.createElement('div');
            expDiv.className = `experience-item ${exp.type === 'current' ? 'current' : ''}`;
            expDiv.innerHTML = `
                <div class="experience-header">
                    <div>
                        <div class="experience-title">${exp.position || ''}</div>
                        <div class="experience-company">${exp.company || ''}</div>
                    </div>
                    <div class="experience-meta">
                        <div class="experience-duration">${exp.duration || ''}</div>
                        <div>${exp.location || ''}</div>
                    </div>
                </div>
                <div class="achievements">
                    ${exp.achievements && exp.achievements.length > 0 ? exp.achievements.map(achievement => 
                        `<div class="achievement">${achievement}</div>`
                    ).join('') : ''}
                </div>
                ${exp.technologies && exp.technologies.length > 0 ? `
                    <div class="technologies">
                        ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                ` : ''}
            `;
            experienceDiv.appendChild(expDiv);
        });
        experienceSection.classList.remove('hidden');
    } else {
        experienceSection.classList.add('hidden');
    }

    // Skills
    const skillsDiv = document.getElementById('skills');
    const skillsSection = document.getElementById('skillsSection');
    if (data.skills && Object.keys(data.skills).length > 0) {
        skillsDiv.innerHTML = '';
        Object.entries(data.skills).forEach(([category, skills]) => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-category';
            skillDiv.innerHTML = `
                <h3>${category.replace('_', ' ')}</h3>
                <div class="skill-tags">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            `;
            skillsDiv.appendChild(skillDiv);
        });
        skillsSection.classList.remove('hidden');
    } else {
        skillsSection.classList.add('hidden');
    }

    // Certifications
    const certificationsDiv = document.getElementById('certifications');
    const certificationsSection = document.getElementById('certificationsSection');
    if (data.certifications && data.certifications.length > 0) {
        certificationsDiv.innerHTML = '';
        data.certifications.forEach(cert => {
            const certDiv = document.createElement('div');
            certDiv.className = 'certification-card';
            certDiv.innerHTML = `
                <div class="certification-name">${cert.name || ''}</div>
                <div class="certification-issuer">${cert.issuer || ''}</div>
            `;
            certificationsDiv.appendChild(certDiv);
        });
        certificationsSection.classList.remove('hidden');
    } else {
        certificationsSection.classList.add('hidden');
    }

    // Education
    const educationDiv = document.getElementById('education');
    const educationSection = document.getElementById('educationSection');
    if (data.education && data.education.length > 0) {
        educationDiv.innerHTML = '';
        data.education.forEach(edu => {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'education-item';
            eduDiv.innerHTML = `
                <div class="education-degree">${edu.degree || ''}</div>
                <div class="education-institution">${edu.institution || ''}</div>
                <div class="education-duration">${edu.duration || ''}</div>
            `;
            educationDiv.appendChild(eduDiv);
        });
        educationSection.classList.remove('hidden');
    } else {
        educationSection.classList.add('hidden');
    }

    // Languages
    const languagesDiv = document.getElementById('languages');
    const languagesSection = document.getElementById('languagesSection');
    if (data.languages && data.languages.length > 0) {
        languagesDiv.innerHTML = '';
        data.languages.forEach(lang => {
            const langSpan = document.createElement('span');
            langSpan.className = 'language-tag';
            langSpan.textContent = lang;
            languagesDiv.appendChild(langSpan);
        });
        languagesSection.classList.remove('hidden');
    } else {
        languagesSection.classList.add('hidden');
    }
}