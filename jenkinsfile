pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/ismailju/student-management-api.git'
            }
        }

        stage('Build') {
            steps {
                bat 'mvn clean package'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t student-api:latest .'
            }
        }

        stage('Run Docker Container') {
            steps {
                // Stop existing container (optional)
                bat 'docker rm -f student-api-container || echo "No container to remove"'
                // Run container mapping ports (adjust ports if needed)
                bat 'docker run -d -p 9092:9092 --name student-api-container student-api:latest'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Build, Docker image, and deployment succeeded!'
        }
        failure {
            echo 'Something went wrong in the pipeline.'
        }
    }
}
