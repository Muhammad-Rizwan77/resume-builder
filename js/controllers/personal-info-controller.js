// Personal Information Controller
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .controller('PersonalInfoController', PersonalInfoController);

    PersonalInfoController.$inject = ['$scope', 'ValidationService'];

    function PersonalInfoController($scope, ValidationService) {
        // Initialize controller
        init();

        // Initialize the controller
        function init() {
            $scope.errors = {};
            
            // Watch for changes in personal info and validate
            $scope.$watch('resumeData.personalInfo', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    validatePersonalInfo();
                }
            }, true);
        }

        // Validate personal information
        function validatePersonalInfo() {
            if (!$scope.resumeData || !$scope.resumeData.personalInfo) {
                return;
            }

            var validation = ValidationService.validatePersonalInfo($scope.resumeData.personalInfo);
            $scope.errors = validation.errors;
            
            // Emit validation status to parent scope
            $scope.$emit('personalInfoValidation', {
                isValid: validation.isValid,
                errors: validation.errors
            });
        }

        // Format phone number as user types
        $scope.$watch('resumeData.personalInfo.phone', function(newVal) {
            if (newVal && typeof newVal === 'string') {
                // Remove all non-digit characters
                var cleaned = newVal.replace(/\D/g, '');
                
                // Format as (XXX) XXX-XXXX
                if (cleaned.length >= 10) {
                    var formatted = '(' + cleaned.substr(0, 3) + ') ' + 
                                   cleaned.substr(3, 3) + '-' + 
                                   cleaned.substr(6, 4);
                    
                    if (formatted !== newVal) {
                        $scope.resumeData.personalInfo.phone = formatted;
                    }
                }
            }
        });

        // Validate email format on blur
        $scope.validateEmail = function() {
            if ($scope.resumeData && $scope.resumeData.personalInfo && $scope.resumeData.personalInfo.email) {
                var emailValidation = ValidationService.validateEmail($scope.resumeData.personalInfo.email);
                if (!emailValidation.isValid) {
                    $scope.errors.email = emailValidation.message;
                } else {
                    delete $scope.errors.email;
                }
            }
        };

        // Validate phone number on blur
        $scope.validatePhone = function() {
            if ($scope.resumeData && $scope.resumeData.personalInfo && $scope.resumeData.personalInfo.phone) {
                var phoneValidation = ValidationService.validatePhone($scope.resumeData.personalInfo.phone);
                if (!phoneValidation.isValid) {
                    $scope.errors.phone = phoneValidation.message;
                } else {
                    delete $scope.errors.phone;
                }
            }
        };

        // Validate URL fields
        $scope.validateUrl = function(field) {
            if ($scope.resumeData && $scope.resumeData.personalInfo && $scope.resumeData.personalInfo[field]) {
                var urlValidation = ValidationService.validateUrl($scope.resumeData.personalInfo[field]);
                if (!urlValidation.isValid) {
                    $scope.errors[field] = urlValidation.message;
                } else {
                    delete $scope.errors[field];
                }
            }
        };

        // Clear validation error for a field
        $scope.clearError = function(field) {
            if ($scope.errors[field]) {
                delete $scope.errors[field];
            }
        };
    }

})();
