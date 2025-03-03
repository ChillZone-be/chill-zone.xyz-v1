class Timeline {
    constructor() {
        this.timelineContainer = document.querySelector('.timeline-container');
        this.username = 'EinsPommes';
        this.categories = {
            project: { color: '#8A6FE6', icon: '🚀' },
            feature: { color: '#64FFDA', icon: '✨' },
            learning: { color: '#FF7EDB', icon: '📚' }
        };
    }

    async init() {
        try {
            const projects = await this.fetchGitHubProjects();
            this.render(projects);
            this.addScrollButtons();
        } catch (error) {
            console.error('Error loading GitHub projects:', error);
            this.timelineContainer.innerHTML = '<p class="error">Failed to load GitHub projects</p>';
        }
    }

    async fetchGitHubProjects() {
        const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=created&direction=desc`);
        if (!response.ok) throw new Error('Failed to fetch GitHub projects');
        
        const repos = await response.json();
        return repos.map(repo => ({
            date: repo.created_at,
            title: repo.name,
            description: repo.description || 'A GitHub project',
            category: 'project',
            icon: '🚀',
            links: [{
                url: repo.html_url,
                text: 'View on GitHub'
            }],
            stars: repo.stargazers_count,
            language: repo.language
        }));
    }

    render(projects) {
        if (!projects?.length) {
            this.timelineContainer.innerHTML = '<p class="error">No projects found</p>';
            return;
        }

        const timeline = document.createElement('div');
        timeline.className = 'timeline';

        projects.forEach((project, index) => {
            const item = this.createTimelineItem(project, index);
            timeline.appendChild(item);
        });

        this.timelineContainer.innerHTML = '';
        this.timelineContainer.appendChild(timeline);
    }

    createTimelineItem(project, index) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.setAttribute('data-aos', index % 2 === 0 ? 'fade-up' : 'fade-down');
        
        const category = this.categories[project.category] || { color: '#8A6FE6', icon: '🚀' };
        
        const extraInfo = `
            ${project.language ? `<span class="language"><i class="fas fa-code"></i> ${project.language}</span>` : ''}
            ${project.stars ? `<span class="stars"><i class="fas fa-star"></i> ${project.stars}</span>` : ''}
        `;
        
        item.innerHTML = `
            <div class="timeline-icon" style="background: ${category.color}">
                <span>${project.icon || category.icon}</span>
            </div>
            <div class="timeline-content">
                <div class="timeline-date">${this.formatDate(project.date)}</div>
                <h3 class="timeline-title">${project.title}</h3>
                <p class="timeline-description">${project.description}</p>
                <div class="project-info">${extraInfo}</div>
                ${this.renderLinks(project.links)}
            </div>
        `;

        return item;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long'
        });
    }

    renderLinks(links) {
        if (!links?.length) return '';
        
        return `
            <div class="timeline-links">
                ${links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                        ${link.text} <i class="fas fa-external-link-alt"></i>
                    </a>
                `).join('')}
            </div>
        `;
    }

    addScrollButtons() {
        const prevButton = document.createElement('button');
        prevButton.className = 'prev-button';
        prevButton.textContent = 'Previous';

        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.textContent = 'Next';

        this.timelineContainer.appendChild(prevButton);
        this.timelineContainer.appendChild(nextButton);

        let currentIndex = 0;
        const items = document.querySelectorAll('.timeline-item');

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                items[currentIndex].scrollIntoView({ behavior: 'smooth' });
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < items.length - 1) {
                currentIndex++;
                items[currentIndex].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timeline = new Timeline();
    timeline.init();
});
