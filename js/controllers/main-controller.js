// Main Controller
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$window', '$sce', 'ResumeService'];

    function MainController($scope, $window, $sce, ResumeService) {
        // Initialize scope variables
        $scope.activeView = 'form';
        $scope.resumeData = {};
        $scope.skillCategories = {};
        $scope.isLoading = false;

        // Initialize controller
        init();

        // Public methods
        $scope.setActiveView = setActiveView;
        $scope.downloadPDF = downloadPDF;
        $scope.clearAllData = clearAllData;
        $scope.saveData = saveData;
        $scope.formatDate = formatDate;
        $scope.formatDescription = formatDescription;
        $scope.loadSampleData = loadSampleData;
        $scope.getCompletionPercentage = getCompletionPercentage;

        // Initialize the controller
        function init() {
            loadResumeData();

            // Watch for changes in resume data and auto-save
            $scope.$watch('resumeData', function(newVal, oldVal) {
                if (newVal !== oldVal && !$scope.isLoading && newVal) {
                    saveData();
                }
            }, true);

            // Set initial view based on screen size
            if ($window.innerWidth < 992) {
                $scope.activeView = 'form';
            }

            // Debug logging
            console.log('Resume Builder initialized', $scope.resumeData);
        }

        // Load resume data from service
        function loadResumeData() {
            $scope.isLoading = true;
            try {
                $scope.resumeData = ResumeService.getResumeData();
                console.log('Resume data loaded:', $scope.resumeData);
            } catch (error) {
                console.error('Error loading resume data:', error);
                // Initialize with empty data if loading fails
                $scope.resumeData = {
                    personalInfo: {
                        fullName: '',
                        email: '',
                        phone: '',
                        address: '',
                        linkedin: '',
                        website: ''
                    },
                    education: [],
                    experience: [],
                    skills: [],
                    projects: [],
                    skillCategories: {
                        technical: '',
                        soft: '',
                        languages: '',
                        certifications: ''
                    }
                };
            } finally {
                $scope.isLoading = false;
            }
        }

        // Set active view
        function setActiveView(view) {
            $scope.activeView = view;
        }

        // Save data to localStorage
        function saveData() {
            if (!$scope.isLoading) {
                ResumeService.saveResumeData($scope.resumeData);
            }
        }

        // Download resume as PDF
        function downloadPDF() {
            // Find the resume preview element
            var element = document.querySelector('.resume-preview');
            if (!element) {
                alert('Resume preview not found. Please make sure the preview is loaded.');
                return;
            }

            var opt = {
                margin: 0.5,
                filename: ($scope.resumeData.personalInfo.fullName || 'Resume') + '.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait' 
                }
            };

            // Show loading state
            $scope.isLoading = true;

            // Generate PDF
            html2pdf().set(opt).from(element).save().then(function() {
                $scope.isLoading = false;
                $scope.$apply();
            }).catch(function(error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
                $scope.isLoading = false;
                $scope.$apply();
            });
        }

        // Clear all data
        function clearAllData() {
            if (confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
                ResumeService.clearAllData();
                loadResumeData();
                alert('All data has been cleared.');
            }
        }

        // Handle window resize
        angular.element($window).on('resize', function() {
            $scope.$apply(function() {
                if ($window.innerWidth >= 992 && $scope.activeView === 'preview') {
                    // On larger screens, show form view to enable split view
                    $scope.activeView = 'form';
                }
            });
        });

        // Format date for display in resume preview
        function formatDate(dateString) {
            if (!dateString) return '';

            var date = new Date(dateString + '-01'); // Add day to make it a valid date
            var options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString('en-US', options);
        }

        // Format description with HTML line breaks
        function formatDescription(description) {
            if (!description) return '';

            var formatted = description.replace(/\n/g, '<br>');
            return $sce.trustAsHtml(formatted);
        }

        // Load sample data for demonstration
        function loadSampleData() {
            if (confirm('This will replace all current data with sample data. Continue?')) {
                $scope.isLoading = true;

                var sampleData = {
                    personalInfo: {
                        fullName: 'John Smith',
                        email: 'john.smith@email.com',
                        phone: '(555) 123-4567',
                        address: 'San Francisco, CA',
                        linkedin: 'https://linkedin.com/in/johnsmith',
                        website: 'https://johnsmith.dev'
                    },
                    education: [{
                        id: 'edu1',
                        degree: 'Bachelor of Science in Computer Science',
                        institution: 'University of California, Berkeley',
                        graduationYear: '2020',
                        gpa: '3.8',
                        location: 'Berkeley, CA',
                        coursework: 'Data Structures, Algorithms, Software Engineering, Database Systems',
                        honors: 'Dean\'s List, Magna Cum Laude'
                    }],
                    experience: [{
                        id: 'exp1',
                        jobTitle: 'Senior Software Developer',
                        company: 'Tech Solutions Inc.',
                        location: 'San Francisco, CA',
                        startDate: '2021-06',
                        endDate: '',
                        isCurrent: true,
                        description: '• Developed and maintained web applications using React and Node.js\n• Led a team of 4 developers in implementing new features\n• Improved application performance by 40% through code optimization\n• Collaborated with product managers to define technical requirements',
                        technologies: 'React, Node.js, MongoDB, AWS, Docker, Git'
                    }, {
                        id: 'exp2',
                        jobTitle: 'Software Developer',
                        company: 'StartupXYZ',
                        location: 'Palo Alto, CA',
                        startDate: '2020-08',
                        endDate: '2021-05',
                        isCurrent: false,
                        description: '• Built responsive web applications using modern JavaScript frameworks\n• Implemented RESTful APIs and database integrations\n• Participated in agile development processes and code reviews',
                        technologies: 'JavaScript, Vue.js, Python, PostgreSQL'
                    }],
                    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile', 'Leadership'],
                    projects: [{
                        id: 'proj1',
                        title: 'E-commerce Platform',
                        description: '• Built a full-stack e-commerce application with user authentication\n• Implemented shopping cart functionality and payment processing\n• Deployed on AWS with CI/CD pipeline using GitHub Actions',
                        technologies: 'React, Node.js, MongoDB, Stripe API, AWS',
                        url: 'https://github.com/johnsmith/ecommerce-app',
                        repository: 'https://github.com/johnsmith/ecommerce-app',
                        date: '2023-03',
                        type: 'Personal',
                        teamSize: 1,
                        role: 'Full-stack Developer',
                        achievements: '• Gained 500+ active users within first month\n• Processed $10,000+ in transactions'
                    }],
                    skillCategories: {
                        technical: 'JavaScript, React, Node.js, Python, MongoDB, PostgreSQL, AWS, Docker, Git',
                        soft: 'Leadership, Communication, Problem Solving, Team Collaboration, Project Management',
                        languages: 'English (Native), Spanish (Conversational)',
                        certifications: 'AWS Certified Developer Associate, Scrum Master Certified'
                    }
                };

                $scope.resumeData = sampleData;
                ResumeService.saveResumeData(sampleData);

                setTimeout(function() {
                    $scope.isLoading = false;
                    $scope.$apply();
                    alert('Sample data loaded successfully!');
                }, 1000);
            }
        }

        // Calculate completion percentage
        function getCompletionPercentage() {
            if (!$scope.resumeData) return 0;

            var totalFields = 0;
            var completedFields = 0;

            // Personal Info (6 fields, 4 required)
            totalFields += 6;
            if ($scope.resumeData.personalInfo) {
                if ($scope.resumeData.personalInfo.fullName) completedFields++;
                if ($scope.resumeData.personalInfo.email) completedFields++;
                if ($scope.resumeData.personalInfo.phone) completedFields++;
                if ($scope.resumeData.personalInfo.address) completedFields++;
                if ($scope.resumeData.personalInfo.linkedin) completedFields++;
                if ($scope.resumeData.personalInfo.website) completedFields++;
            }

            // Education (weight: 2 points)
            totalFields += 2;
            if ($scope.resumeData.education && $scope.resumeData.education.length > 0) {
                completedFields += 2;
            }

            // Experience (weight: 3 points)
            totalFields += 3;
            if ($scope.resumeData.experience && $scope.resumeData.experience.length > 0) {
                completedFields += 3;
            }

            // Skills (weight: 2 points)
            totalFields += 2;
            if ($scope.resumeData.skills && $scope.resumeData.skills.length > 0) {
                completedFields += 2;
            }

            // Projects (weight: 1 point)
            totalFields += 1;
            if ($scope.resumeData.projects && $scope.resumeData.projects.length > 0) {
                completedFields += 1;
            }

            return Math.round((completedFields / totalFields) * 100);
        }

        // Cleanup on destroy
        $scope.$on('$destroy', function() {
            angular.element($window).off('resize');
        });
    }

})();
