// Skills Controller
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .controller('SkillsController', SkillsController);

    SkillsController.$inject = ['$scope'];

    function SkillsController($scope) {
        // Initialize controller
        init();

        // Public methods
        $scope.addSkill = addSkill;
        $scope.removeSkill = removeSkill;
        $scope.addSkillOnEnter = addSkillOnEnter;
        $scope.addCommonSkill = addCommonSkill;

        // Initialize the controller
        function init() {
            $scope.newSkill = '';

            // Initialize skillCategories
            $scope.skillCategories = {
                technical: '',
                soft: '',
                languages: '',
                certifications: ''
            };

            // Common skills for quick add
            $scope.commonSkills = [
                'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue.js',
                'Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL', 'AWS',
                'Docker', 'Git', 'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby',
                'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
                'Project Management', 'Agile', 'Scrum'
            ];

            // Initialize skillCategories in resumeData if not exists
            if (!$scope.resumeData.skillCategories) {
                $scope.resumeData.skillCategories = {
                    technical: '',
                    soft: '',
                    languages: '',
                    certifications: ''
                };
            }

            // Load skill categories from resume data if they exist
            $scope.skillCategories = angular.copy($scope.resumeData.skillCategories);

            // Watch for changes in skill categories and save to resume data
            $scope.$watch('skillCategories', function(newVal, oldVal) {
                if (newVal !== oldVal && newVal) {
                    $scope.resumeData.skillCategories = angular.copy(newVal);
                }
            }, true);
        }

        // Add new skill
        function addSkill() {
            var skill = $scope.newSkill ? $scope.newSkill.trim() : '';
            
            if (skill && skill.length > 0) {
                // Check if skill already exists
                if ($scope.resumeData.skills.indexOf(skill) === -1) {
                    $scope.resumeData.skills.push(skill);
                    $scope.newSkill = '';
                } else {
                    alert('This skill is already added.');
                }
            }
        }

        // Remove skill
        function removeSkill(skill) {
            var index = $scope.resumeData.skills.indexOf(skill);
            if (index !== -1) {
                $scope.resumeData.skills.splice(index, 1);
            }
        }

        // Add skill when Enter key is pressed
        function addSkillOnEnter(event) {
            if (event.keyCode === 13) { // Enter key
                event.preventDefault();
                addSkill();
            }
        }

        // Add common skill
        function addCommonSkill(skill) {
            if ($scope.resumeData.skills.indexOf(skill) === -1) {
                $scope.resumeData.skills.push(skill);
            }
        }

        // Validate skill input
        $scope.validateSkillInput = function() {
            var skill = $scope.newSkill ? $scope.newSkill.trim() : '';
            
            if (skill.length > 50) {
                $scope.newSkill = skill.substring(0, 50);
            }
        };

        // Clear all skills
        $scope.clearAllSkills = function() {
            if (confirm('Are you sure you want to remove all skills?')) {
                $scope.resumeData.skills = [];
            }
        };

        // Sort skills alphabetically
        $scope.sortSkills = function() {
            if ($scope.resumeData.skills && $scope.resumeData.skills.length > 0) {
                $scope.resumeData.skills.sort(function(a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
            }
        };

        // Import skills from text (comma-separated)
        $scope.importSkills = function() {
            var skillsText = prompt('Enter skills separated by commas:');
            if (skillsText) {
                var skills = skillsText.split(',').map(function(skill) {
                    return skill.trim();
                }).filter(function(skill) {
                    return skill.length > 0 && $scope.resumeData.skills.indexOf(skill) === -1;
                });

                if (skills.length > 0) {
                    $scope.resumeData.skills = $scope.resumeData.skills.concat(skills);
                    $scope.$apply();
                }
            }
        };

        // Export skills as text
        $scope.exportSkills = function() {
            if ($scope.resumeData.skills && $scope.resumeData.skills.length > 0) {
                var skillsText = $scope.resumeData.skills.join(', ');
                
                // Create a temporary textarea to copy to clipboard
                var textarea = document.createElement('textarea');
                textarea.value = skillsText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                alert('Skills copied to clipboard!');
            } else {
                alert('No skills to export.');
            }
        };

        // Get skill count
        $scope.getSkillCount = function() {
            return $scope.resumeData.skills ? $scope.resumeData.skills.length : 0;
        };

        // Filter common skills to show only those not already added
        $scope.getAvailableCommonSkills = function() {
            return $scope.commonSkills.filter(function(skill) {
                return $scope.resumeData.skills.indexOf(skill) === -1;
            });
        };
    }

})();
