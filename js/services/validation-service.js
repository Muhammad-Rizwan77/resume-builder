// Validation Service
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .factory('ValidationService', ValidationService);

    function ValidationService() {
        var service = {
            validateEmail: validateEmail,
            validatePhone: validatePhone,
            validateRequired: validateRequired,
            validateUrl: validateUrl,
            validateYear: validateYear,
            validatePersonalInfo: validatePersonalInfo,
            validateEducation: validateEducation,
            validateExperience: validateExperience,
            validateProject: validateProject
        };

        return service;

        // Email validation
        function validateEmail(email) {
            if (!email) return { isValid: false, message: 'Email is required' };
            
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { isValid: false, message: 'Please enter a valid email address' };
            }
            
            return { isValid: true, message: '' };
        }

        // Phone validation
        function validatePhone(phone) {
            if (!phone) return { isValid: false, message: 'Phone number is required' };
            
            // Remove all non-digit characters for validation
            var cleanPhone = phone.replace(/\D/g, '');
            
            if (cleanPhone.length < 10) {
                return { isValid: false, message: 'Phone number must be at least 10 digits' };
            }
            
            if (cleanPhone.length > 15) {
                return { isValid: false, message: 'Phone number is too long' };
            }
            
            return { isValid: true, message: '' };
        }

        // Required field validation
        function validateRequired(value, fieldName) {
            if (!value || value.trim() === '') {
                return { isValid: false, message: fieldName + ' is required' };
            }
            return { isValid: true, message: '' };
        }

        // URL validation
        function validateUrl(url) {
            if (!url) return { isValid: true, message: '' }; // URL is optional
            
            try {
                new URL(url);
                return { isValid: true, message: '' };
            } catch (e) {
                return { isValid: false, message: 'Please enter a valid URL' };
            }
        }

        // Year validation
        function validateYear(year) {
            if (!year) return { isValid: false, message: 'Year is required' };
            
            var currentYear = new Date().getFullYear();
            var yearNum = parseInt(year, 10);
            
            if (isNaN(yearNum)) {
                return { isValid: false, message: 'Please enter a valid year' };
            }
            
            if (yearNum < 1950 || yearNum > currentYear + 10) {
                return { isValid: false, message: 'Year must be between 1950 and ' + (currentYear + 10) };
            }
            
            return { isValid: true, message: '' };
        }

        // Personal info validation
        function validatePersonalInfo(personalInfo) {
            var errors = {};
            var isValid = true;

            // Validate full name
            var nameValidation = validateRequired(personalInfo.fullName, 'Full name');
            if (!nameValidation.isValid) {
                errors.fullName = nameValidation.message;
                isValid = false;
            }

            // Validate email
            var emailValidation = validateEmail(personalInfo.email);
            if (!emailValidation.isValid) {
                errors.email = emailValidation.message;
                isValid = false;
            }

            // Validate phone
            var phoneValidation = validatePhone(personalInfo.phone);
            if (!phoneValidation.isValid) {
                errors.phone = phoneValidation.message;
                isValid = false;
            }

            // Validate address
            var addressValidation = validateRequired(personalInfo.address, 'Address');
            if (!addressValidation.isValid) {
                errors.address = addressValidation.message;
                isValid = false;
            }

            // Validate LinkedIn (optional)
            if (personalInfo.linkedin) {
                var linkedinValidation = validateUrl(personalInfo.linkedin);
                if (!linkedinValidation.isValid) {
                    errors.linkedin = linkedinValidation.message;
                    isValid = false;
                }
            }

            // Validate website (optional)
            if (personalInfo.website) {
                var websiteValidation = validateUrl(personalInfo.website);
                if (!websiteValidation.isValid) {
                    errors.website = websiteValidation.message;
                    isValid = false;
                }
            }

            return { isValid: isValid, errors: errors };
        }

        // Education validation
        function validateEducation(education) {
            var errors = {};
            var isValid = true;

            // Validate degree
            var degreeValidation = validateRequired(education.degree, 'Degree');
            if (!degreeValidation.isValid) {
                errors.degree = degreeValidation.message;
                isValid = false;
            }

            // Validate institution
            var institutionValidation = validateRequired(education.institution, 'Institution');
            if (!institutionValidation.isValid) {
                errors.institution = institutionValidation.message;
                isValid = false;
            }

            // Validate graduation year
            var yearValidation = validateYear(education.graduationYear);
            if (!yearValidation.isValid) {
                errors.graduationYear = yearValidation.message;
                isValid = false;
            }

            return { isValid: isValid, errors: errors };
        }

        // Experience validation
        function validateExperience(experience) {
            var errors = {};
            var isValid = true;

            // Validate job title
            var titleValidation = validateRequired(experience.jobTitle, 'Job title');
            if (!titleValidation.isValid) {
                errors.jobTitle = titleValidation.message;
                isValid = false;
            }

            // Validate company
            var companyValidation = validateRequired(experience.company, 'Company');
            if (!companyValidation.isValid) {
                errors.company = companyValidation.message;
                isValid = false;
            }

            // Validate start date
            var startDateValidation = validateRequired(experience.startDate, 'Start date');
            if (!startDateValidation.isValid) {
                errors.startDate = startDateValidation.message;
                isValid = false;
            }

            // Validate end date (if not current job)
            if (!experience.isCurrent) {
                var endDateValidation = validateRequired(experience.endDate, 'End date');
                if (!endDateValidation.isValid) {
                    errors.endDate = endDateValidation.message;
                    isValid = false;
                }
            }

            return { isValid: isValid, errors: errors };
        }

        // Project validation
        function validateProject(project) {
            var errors = {};
            var isValid = true;

            // Validate project title
            var titleValidation = validateRequired(project.title, 'Project title');
            if (!titleValidation.isValid) {
                errors.title = titleValidation.message;
                isValid = false;
            }

            // Validate description
            var descriptionValidation = validateRequired(project.description, 'Description');
            if (!descriptionValidation.isValid) {
                errors.description = descriptionValidation.message;
                isValid = false;
            }

            // Validate project URL (optional)
            if (project.url) {
                var urlValidation = validateUrl(project.url);
                if (!urlValidation.isValid) {
                    errors.url = urlValidation.message;
                    isValid = false;
                }
            }

            return { isValid: isValid, errors: errors };
        }
    }

})();
