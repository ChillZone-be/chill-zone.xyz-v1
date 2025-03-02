// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navigation background change on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    } else {
        nav.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
    }
});

// GitHub Projects
async function fetchGitHubProjects() {
    const username = 'einspommes'; // Replace with your GitHub username
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await response.json();
        
        // Filter for non-fork repositories and sort by stars
        const topRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 3);
            
        const projectsContainer = document.getElementById('github-projects');
        projectsContainer.innerHTML = ''; // Clear loading skeletons
        
        topRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Get programming language color
            const languageColors = {
                'Python': '#3572A5',
                'JavaScript': '#f1e05a',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'PHP': '#4F5D95',
                'C++': '#f34b7d',
                'Lua': '#000080'
            };
            
            const languageColor = languageColors[repo.language] || '#8B5CF6';
            
            card.innerHTML = `
                <div>
                    <h3>${repo.name}</h3>
                    <div class="project-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        ${repo.language ? `
                            <span>
                                <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${languageColor}; margin-right: 5px;"></span>
                                ${repo.language}
                            </span>
                        ` : ''}
                    </div>
                    <p>${repo.description || 'No description available'}</p>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            `;
            
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        document.getElementById('github-projects').innerHTML = `
            <div class="error-message">
                <p>Failed to load GitHub projects. Please try again later.</p>
            </div>
        `;
    }
}

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        try {
            const response = await fetch('send-mail.php', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            alert('Failed to send message. Please try again later.');
            console.error('Error:', error);
        }
    });
}

// Load GitHub projects when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);
