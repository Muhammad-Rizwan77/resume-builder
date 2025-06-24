// Projects Controller
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$scope', 'ValidationService'];

    function ProjectsController($scope, ValidationService) {
        // Initialize controller
        init();

        // Public methods
        $scope.addProject = addProject;
        $scope.removeProject = removeProject;
        $scope.validateProject = validateProject;
        $scope.formatDate = formatDate;

        // Initialize the controller
        function init() {
            $scope.projectErrors = {};
            
            // Watch for changes in projects array
            $scope.$watch('resumeData.projects', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    validateAllProjects();
                }
            }, true);
        }

        // Add new project entry
        function addProject() {
            if (!$scope.resumeData.projects) {
                $scope.resumeData.projects = [];
            }

            var newProject = {
                id: generateId(),
                title: '',
                description: '',
                technologies: '',
                url: '',
                repository: '',
                date: '',
                type: '',
                teamSize: 1,
                role: '',
                achievements: ''
            };

            $scope.resumeData.projects.push(newProject);
        }

        // Remove project entry
        function removeProject(id) {
            if (confirm('Are you sure you want to remove this project?')) {
                $scope.resumeData.projects = $scope.resumeData.projects.filter(function(project) {
                    return project.id !== id;
                });
                
                // Remove validation errors for this item
                if ($scope.projectErrors[id]) {
                    delete $scope.projectErrors[id];
                }
            }
        }

        // Validate single project entry
        function validateProject(project) {
            if (!project || !project.id) {
                return;
            }

            var validation = ValidationService.validateProject(project);
            
            if (validation.isValid) {
                delete $scope.projectErrors[project.id];
            } else {
                $scope.projectErrors[project.id] = validation.errors;
            }

            return validation.isValid;
        }

        // Validate all project entries
        function validateAllProjects() {
            if (!$scope.resumeData || !$scope.resumeData.projects) {
                return;
            }

            var allValid = true;
            
            $scope.resumeData.projects.forEach(function(project) {
                var isValid = validateProject(project);
                if (!isValid) {
                    allValid = false;
                }
            });

            // Emit validation status to parent scope
            $scope.$emit('projectsValidation', {
                isValid: allValid,
                errors: $scope.projectErrors
            });
        }

        // Format date for display
        function formatDate(dateString) {
            if (!dateString) return '';
            
            var date = new Date(dateString + '-01'); // Add day to make it a valid date
            var options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString('en-US', options);
        }

        // Validate URL fields
        $scope.validateUrl = function(project, field) {
            if (project[field]) {
                var urlValidation = ValidationService.validateUrl(project[field]);
                if (!urlValidation.isValid) {
                    if (!$scope.projectErrors[project.id]) {
                        $scope.projectErrors[project.id] = {};
                    }
                    $scope.projectErrors[project.id][field] = urlValidation.message;
                } else {
                    if ($scope.projectErrors[project.id] && $scope.projectErrors[project.id][field]) {
                        delete $scope.projectErrors[project.id][field];
                        
                        // Clean up empty error objects
                        if (Object.keys($scope.projectErrors[project.id]).length === 0) {
                            delete $scope.projectErrors[project.id];
                        }
                    }
                }
            }
        };

        // Clear validation error for a specific field
        $scope.clearProjectError = function(projectId, field) {
            if ($scope.projectErrors[projectId] && $scope.projectErrors[projectId][field]) {
                delete $scope.projectErrors[projectId][field];
                
                // Clean up empty error objects
                if (Object.keys($scope.projectErrors[projectId]).length === 0) {
                    delete $scope.projectErrors[projectId];
                }
            }
        };

        // Auto-format description with bullet points
        $scope.formatDescription = function(project) {
            if (project.description) {
                // Ensure each line starts with a bullet point if it doesn't already
                var lines = project.description.split('\n');
                var formattedLines = lines.map(function(line) {
                    line = line.trim();
                    if (line && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
                        return '• ' + line;
                    }
                    return line;
                });
                project.description = formattedLines.join('\n');
            }
        };

        // Auto-format achievements with bullet points
        $scope.formatAchievements = function(project) {
            if (project.achievements) {
                // Ensure each line starts with a bullet point if it doesn't already
                var lines = project.achievements.split('\n');
                var formattedLines = lines.map(function(line) {
                    line = line.trim();
                    if (line && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
                        return '• ' + line;
                    }
                    return line;
                });
                project.achievements = formattedLines.join('\n');
            }
        };

        // Validate team size
        $scope.validateTeamSize = function(project) {
            if (project.teamSize) {
                var teamSize = parseInt(project.teamSize, 10);
                if (isNaN(teamSize) || teamSize < 1) {
                    project.teamSize = 1;
                } else if (teamSize > 50) {
                    project.teamSize = 50;
                }
            }
        };

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Duplicate project
        $scope.duplicateProject = function(project) {
            var duplicatedProject = angular.copy(project);
            duplicatedProject.id = generateId();
            duplicatedProject.title = duplicatedProject.title + ' (Copy)';
            
            $scope.resumeData.projects.push(duplicatedProject);
        };

        // Move project up in the list
        $scope.moveProjectUp = function(index) {
            if (index > 0) {
                var temp = $scope.resumeData.projects[index];
                $scope.resumeData.projects[index] = $scope.resumeData.projects[index - 1];
                $scope.resumeData.projects[index - 1] = temp;
            }
        };

        // Move project down in the list
        $scope.moveProjectDown = function(index) {
            if (index < $scope.resumeData.projects.length - 1) {
                var temp = $scope.resumeData.projects[index];
                $scope.resumeData.projects[index] = $scope.resumeData.projects[index + 1];
                $scope.resumeData.projects[index + 1] = temp;
            }
        };
    }

})();
