// Resume Data Service
(function() {
    'use strict';

    angular.module('resumeBuilderApp')
        .factory('ResumeService', ResumeService);

    ResumeService.$inject = ['$window'];

    function ResumeService($window) {
        var STORAGE_KEY = 'resumeBuilderData';
        
        // Default resume data structure
        var defaultResumeData = {
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

        var service = {
            getResumeData: getResumeData,
            saveResumeData: saveResumeData,
            updatePersonalInfo: updatePersonalInfo,
            addEducation: addEducation,
            updateEducation: updateEducation,
            removeEducation: removeEducation,
            addExperience: addExperience,
            updateExperience: updateExperience,
            removeExperience: removeExperience,
            addSkill: addSkill,
            removeSkill: removeSkill,
            addProject: addProject,
            updateProject: updateProject,
            removeProject: removeProject,
            clearAllData: clearAllData,
            exportData: exportData,
            importData: importData
        };

        return service;

        // Get resume data from localStorage or return default
        function getResumeData() {
            try {
                var storedData = $window.localStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    var parsedData = JSON.parse(storedData);
                    // Merge with default structure to ensure all properties exist
                    return angular.merge({}, defaultResumeData, parsedData);
                }
            } catch (error) {
                console.error('Error loading resume data:', error);
            }
            return angular.copy(defaultResumeData);
        }

        // Save resume data to localStorage
        function saveResumeData(data) {
            try {
                $window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error saving resume data:', error);
                return false;
            }
        }

        // Update personal information
        function updatePersonalInfo(personalInfo) {
            var data = getResumeData();
            data.personalInfo = angular.merge(data.personalInfo, personalInfo);
            return saveResumeData(data);
        }

        // Education methods
        function addEducation(education) {
            var data = getResumeData();
            education.id = generateId();
            data.education.push(education);
            return saveResumeData(data);
        }

        function updateEducation(id, education) {
            var data = getResumeData();
            var index = data.education.findIndex(function(item) { return item.id === id; });
            if (index !== -1) {
                data.education[index] = angular.merge(data.education[index], education);
                return saveResumeData(data);
            }
            return false;
        }

        function removeEducation(id) {
            var data = getResumeData();
            data.education = data.education.filter(function(item) { return item.id !== id; });
            return saveResumeData(data);
        }

        // Experience methods
        function addExperience(experience) {
            var data = getResumeData();
            experience.id = generateId();
            data.experience.push(experience);
            return saveResumeData(data);
        }

        function updateExperience(id, experience) {
            var data = getResumeData();
            var index = data.experience.findIndex(function(item) { return item.id === id; });
            if (index !== -1) {
                data.experience[index] = angular.merge(data.experience[index], experience);
                return saveResumeData(data);
            }
            return false;
        }

        function removeExperience(id) {
            var data = getResumeData();
            data.experience = data.experience.filter(function(item) { return item.id !== id; });
            return saveResumeData(data);
        }

        // Skills methods
        function addSkill(skill) {
            var data = getResumeData();
            if (skill && skill.trim() && data.skills.indexOf(skill.trim()) === -1) {
                data.skills.push(skill.trim());
                return saveResumeData(data);
            }
            return false;
        }

        function removeSkill(skill) {
            var data = getResumeData();
            data.skills = data.skills.filter(function(item) { return item !== skill; });
            return saveResumeData(data);
        }

        // Projects methods
        function addProject(project) {
            var data = getResumeData();
            project.id = generateId();
            data.projects.push(project);
            return saveResumeData(data);
        }

        function updateProject(id, project) {
            var data = getResumeData();
            var index = data.projects.findIndex(function(item) { return item.id === id; });
            if (index !== -1) {
                data.projects[index] = angular.merge(data.projects[index], project);
                return saveResumeData(data);
            }
            return false;
        }

        function removeProject(id) {
            var data = getResumeData();
            data.projects = data.projects.filter(function(item) { return item.id !== id; });
            return saveResumeData(data);
        }

        // Utility methods
        function clearAllData() {
            try {
                $window.localStorage.removeItem(STORAGE_KEY);
                return true;
            } catch (error) {
                console.error('Error clearing data:', error);
                return false;
            }
        }

        function exportData() {
            return getResumeData();
        }

        function importData(data) {
            try {
                var mergedData = angular.merge({}, defaultResumeData, data);
                return saveResumeData(mergedData);
            } catch (error) {
                console.error('Error importing data:', error);
                return false;
            }
        }

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
    }

})();
