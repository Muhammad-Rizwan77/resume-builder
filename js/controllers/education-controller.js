// Education Controller
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .controller('EducationController', EducationController);

    EducationController.$inject = ['$scope', 'ValidationService'];

    function EducationController($scope, ValidationService) {
        // Initialize controller
        init();

        // Public methods
        $scope.addEducation = addEducation;
        $scope.removeEducation = removeEducation;
        $scope.validateEducation = validateEducation;

        // Initialize the controller
        function init() {
            $scope.educationErrors = {};
            
            // Watch for changes in education array
            $scope.$watch('resumeData.education', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    validateAllEducation();
                }
            }, true);
        }

        // Add new education entry
        function addEducation() {
            if (!$scope.resumeData.education) {
                $scope.resumeData.education = [];
            }

            var newEducation = {
                id: generateId(),
                degree: '',
                institution: '',
                graduationYear: '',
                gpa: '',
                location: '',
                coursework: '',
                honors: ''
            };

            $scope.resumeData.education.push(newEducation);
        }

        // Remove education entry
        function removeEducation(id) {
            if (confirm('Are you sure you want to remove this education entry?')) {
                $scope.resumeData.education = $scope.resumeData.education.filter(function(education) {
                    return education.id !== id;
                });
                
                // Remove validation errors for this item
                if ($scope.educationErrors[id]) {
                    delete $scope.educationErrors[id];
                }
            }
        }

        // Validate single education entry
        function validateEducation(education) {
            if (!education || !education.id) {
                return;
            }

            var validation = ValidationService.validateEducation(education);
            
            if (validation.isValid) {
                delete $scope.educationErrors[education.id];
            } else {
                $scope.educationErrors[education.id] = validation.errors;
            }

            return validation.isValid;
        }

        // Validate all education entries
        function validateAllEducation() {
            if (!$scope.resumeData || !$scope.resumeData.education) {
                return;
            }

            var allValid = true;
            
            $scope.resumeData.education.forEach(function(education) {
                var isValid = validateEducation(education);
                if (!isValid) {
                    allValid = false;
                }
            });

            // Emit validation status to parent scope
            $scope.$emit('educationValidation', {
                isValid: allValid,
                errors: $scope.educationErrors
            });
        }

        // Validate graduation year
        $scope.validateGraduationYear = function(education) {
            if (education.graduationYear) {
                var yearValidation = ValidationService.validateYear(education.graduationYear);
                if (!yearValidation.isValid) {
                    if (!$scope.educationErrors[education.id]) {
                        $scope.educationErrors[education.id] = {};
                    }
                    $scope.educationErrors[education.id].graduationYear = yearValidation.message;
                } else {
                    if ($scope.educationErrors[education.id] && $scope.educationErrors[education.id].graduationYear) {
                        delete $scope.educationErrors[education.id].graduationYear;
                        
                        // Clean up empty error objects
                        if (Object.keys($scope.educationErrors[education.id]).length === 0) {
                            delete $scope.educationErrors[education.id];
                        }
                    }
                }
            }
        };

        // Clear validation error for a specific field
        $scope.clearEducationError = function(educationId, field) {
            if ($scope.educationErrors[educationId] && $scope.educationErrors[educationId][field]) {
                delete $scope.educationErrors[educationId][field];
                
                // Clean up empty error objects
                if (Object.keys($scope.educationErrors[educationId]).length === 0) {
                    delete $scope.educationErrors[educationId];
                }
            }
        };

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Auto-format GPA
        $scope.formatGPA = function(education) {
            if (education.gpa) {
                var gpa = parseFloat(education.gpa);
                if (!isNaN(gpa)) {
                    if (gpa > 4.0) {
                        education.gpa = '4.0';
                    } else if (gpa < 0) {
                        education.gpa = '0.0';
                    } else {
                        education.gpa = gpa.toFixed(1);
                    }
                }
            }
        };
    }

})();
