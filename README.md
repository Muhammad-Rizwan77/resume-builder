# Professional Resume Builder

A modern, responsive web application built with AngularJS 1.7 for creating professional resumes with real-time preview and PDF export functionality.

## Features

### 📝 Comprehensive Resume Sections
- **Personal Information**: Name, email, phone, address, LinkedIn, website
- **Education**: Degree, institution, graduation year, GPA, coursework, honors
- **Work Experience**: Job title, company, duration, description, technologies
- **Skills**: Dynamic skill management with categorization
- **Projects**: Project details with links, technologies, and achievements

### 🎨 Professional Design
- Clean, modern interface with gradient styling
- Responsive design for mobile, tablet, and desktop
- Real-time preview with professional resume layout
- Print-optimized styling for PDF generation

### ⚡ Advanced Functionality
- **Real-time Validation**: Email format, phone number, required fields
- **Auto-save**: Data automatically saved to localStorage
- **PDF Export**: Download resume as PDF using html2pdf.js
- **Sample Data**: Load sample data for quick testing
- **Progress Tracking**: Visual completion percentage indicator
- **Skill Management**: Quick-add common skills, import/export functionality

### 📱 Mobile-Friendly
- Responsive design works on all screen sizes
- Touch-friendly interface for mobile devices
- Optimized layouts for different viewports

## Technology Stack

- **Frontend**: AngularJS 1.7.9
- **Styling**: Bootstrap 5.3.0, Custom CSS with gradients
- **Icons**: Font Awesome 6.4.0
- **PDF Generation**: html2pdf.js 0.10.1
- **Storage**: localStorage for data persistence

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start building your resume!

### Alternative Setup (with local server)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### Quick Start
1. **Load Sample Data**: Click "Load Sample" to see the app in action
2. **Fill Your Information**: Replace sample data with your details
3. **Preview**: Switch between form and preview views
4. **Download**: Click "Download PDF" to export your resume

### Detailed Instructions

#### Personal Information
- Fill in your basic contact details
- All fields except LinkedIn and website are required
- Email and phone number validation included

#### Education
- Add multiple education entries
- Include degree, institution, graduation year
- Optional: GPA, location, coursework, honors

#### Work Experience
- Add multiple work experiences
- Use bullet points for descriptions
- Mark current positions with checkbox
- Include technologies used

#### Skills
- Add skills individually or use quick-add buttons
- Organize skills by categories (technical, soft skills, etc.)
- Import/export skills as comma-separated text
- Sort skills alphabetically

#### Projects
- Showcase your projects with descriptions
- Include project URLs and repository links
- Specify technologies used and your role
- Add achievements and metrics

### Tips for Best Results
- Use bullet points (•) for descriptions and achievements
- Keep descriptions concise but informative
- Include quantifiable achievements when possible
- Regularly save your work (auto-save is enabled)
- Preview your resume before downloading

## File Structure

```
Resume Builder Angular JS/
├── index.html                          # Main HTML file
├── css/
│   └── styles.css                      # Custom styles
├── js/
│   ├── app.js                          # Main AngularJS app
│   ├── controllers/
│   │   ├── main-controller.js          # Main app controller
│   │   ├── personal-info-controller.js # Personal info management
│   │   ├── education-controller.js     # Education management
│   │   ├── experience-controller.js    # Experience management
│   │   ├── skills-controller.js        # Skills management
│   │   └── projects-controller.js      # Projects management
│   └── services/
│       ├── resume-service.js           # Data management service
│       └── validation-service.js       # Form validation service
├── templates/
│   ├── personal-info.html              # Personal info form
│   ├── education.html                  # Education form
│   ├── experience.html                 # Experience form
│   ├── skills.html                     # Skills form
│   ├── projects.html                   # Projects form
│   └── resume-preview.html             # Resume preview template
└── README.md                           # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features in Detail

### Data Persistence
- All data is automatically saved to browser's localStorage
- Data persists between browser sessions
- Clear all data option available

### Validation
- Real-time form validation
- Email format validation
- Phone number formatting and validation
- Required field indicators
- URL validation for links

### PDF Export
- High-quality PDF generation
- Optimized for printing
- Maintains professional formatting
- Automatic filename based on your name

### Responsive Design
- Mobile-first approach
- Breakpoints for different screen sizes
- Touch-friendly interface
- Optimized layouts for all devices

## Customization

### Adding New Skills Categories
Edit `js/controllers/skills-controller.js` to add new skill categories or modify the common skills list.

### Styling Modifications
Modify `css/styles.css` to change colors, fonts, or layout. The app uses CSS custom properties for easy theming.

### Adding New Sections
1. Create a new template in `templates/`
2. Add a new controller in `js/controllers/`
3. Include the template in `index.html`
4. Update the resume preview template

## Troubleshooting

### PDF Download Issues
- Ensure you're using a modern browser
- Check that JavaScript is enabled
- Try refreshing the page if download fails

### Data Not Saving
- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Ensure you're not in private/incognito mode

### Styling Issues
- Clear browser cache
- Ensure all CSS files are loading properly
- Check browser console for errors

## Contributing

This is a standalone project, but suggestions for improvements are welcome:
- Better mobile responsiveness
- Additional resume templates
- More export formats
- Enhanced validation

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Ensure you're using a supported browser
3. Try loading sample data to test functionality

---

**Built with ❤️ using AngularJS 1.7**
