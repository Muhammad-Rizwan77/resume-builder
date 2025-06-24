// Experience Controller
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .controller('ExperienceController', ExperienceController);

    ExperienceController.$inject = ['$scope', 'ValidationService'];

    function ExperienceController($scope, ValidationService) {
        // Initialize controller
        init();

        // Public methods
        $scope.addExperience = addExperience;
        $scope.removeExperience = removeExperience;
        $scope.validateExperience = validateExperience;
        $scope.formatDate = formatDate;

        // Initialize the controller
        function init() {
            $scope.experienceErrors = {};
            
            // Watch for changes in experience array
            $scope.$watch('resumeData.experience', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    validateAllExperience();
                }
            }, true);
        }

        // Add new experience entry
        function addExperience() {
            if (!$scope.resumeData.experience) {
                $scope.resumeData.experience = [];
            }

            var newExperience = {
                id: generateId(),
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: '',
                technologies: ''
            };

            $scope.resumeData.experience.push(newExperience);
        }

        // Remove experience entry
        function removeExperience(id) {
            if (confirm('Are you sure you want to remove this work experience entry?')) {
                $scope.resumeData.experience = $scope.resumeData.experience.filter(function(experience) {
                    return experience.id !== id;
                });
                
                // Remove validation errors for this item
                if ($scope.experienceErrors[id]) {
                    delete $scope.experienceErrors[id];
                }
            }
        }

        // Validate single experience entry
        function validateExperience(experience) {
            if (!experience || !experience.id) {
                return;
            }

            var validation = ValidationService.validateExperience(experience);
            
            if (validation.isValid) {
                delete $scope.experienceErrors[experience.id];
            } else {
                $scope.experienceErrors[experience.id] = validation.errors;
            }

            return validation.isValid;
        }

        // Validate all experience entries
        function validateAllExperience() {
            if (!$scope.resumeData || !$scope.resumeData.experience) {
                return;
            }

            var allValid = true;
            
            $scope.resumeData.experience.forEach(function(experience) {
                var isValid = validateExperience(experience);
                if (!isValid) {
                    allValid = false;
                }
            });

            // Emit validation status to parent scope
            $scope.$emit('experienceValidation', {
                isValid: allValid,
                errors: $scope.experienceErrors
            });
        }

        // Format date for display
        function formatDate(dateString) {
            if (!dateString) return '';
            
            var date = new Date(dateString + '-01'); // Add day to make it a valid date
            var options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString('en-US', options);
        }

        // Handle current position checkbox
        $scope.toggleCurrentPosition = function(experience) {
            if (experience.isCurrent) {
                experience.endDate = '';
                // Clear end date validation error
                if ($scope.experienceErrors[experience.id] && $scope.experienceErrors[experience.id].endDate) {
                    delete $scope.experienceErrors[experience.id].endDate;
                }
            }
        };

        // Validate date range
        $scope.validateDateRange = function(experience) {
            if (experience.startDate && experience.endDate && !experience.isCurrent) {
                var startDate = new Date(experience.startDate);
                var endDate = new Date(experience.endDate);
                
                if (endDate <= startDate) {
                    if (!$scope.experienceErrors[experience.id]) {
                        $scope.experienceErrors[experience.id] = {};
                    }
                    $scope.experienceErrors[experience.id].endDate = 'End date must be after start date';
                } else {
                    if ($scope.experienceErrors[experience.id] && $scope.experienceErrors[experience.id].endDate === 'End date must be after start date') {
                        delete $scope.experienceErrors[experience.id].endDate;
                        
                        // Clean up empty error objects
                        if (Object.keys($scope.experienceErrors[experience.id]).length === 0) {
                            delete $scope.experienceErrors[experience.id];
                        }
                    }
                }
            }
        };

        // Clear validation error for a specific field
        $scope.clearExperienceError = function(experienceId, field) {
            if ($scope.experienceErrors[experienceId] && $scope.experienceErrors[experienceId][field]) {
                delete $scope.experienceErrors[experienceId][field];
                
                // Clean up empty error objects
                if (Object.keys($scope.experienceErrors[experienceId]).length === 0) {
                    delete $scope.experienceErrors[experienceId];
                }
            }
        };

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Auto-format description with bullet points
        $scope.formatDescription = function(experience) {
            if (experience.description) {
                // Ensure each line starts with a bullet point if it doesn't already
                var lines = experience.description.split('\n');
                var formattedLines = lines.map(function(line) {
                    line = line.trim();
                    if (line && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
                        return '• ' + line;
                    }
                    return line;
                });
                experience.description = formattedLines.join('\n');
            }
        };
    }

})();
