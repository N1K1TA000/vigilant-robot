"use strict";

// ==========================================
// Модуль 1: Функції, замикання та каррінг
// ==========================================

/**
 * Функція вищого порядку (каррінг) для створення валідаторів.
 * Повертає функцію, яка перевіряє значення за регулярним виразом.
 */
const createValidator = (regex, errorMessage) => (value) => {
    if (!regex.test(value)) {
        throw new Error(errorMessage);
    }
    return value;
};

// Створення конкретних валідаторів
const validateName = createValidator(/^[a-zA-Zа-яА-ЯіІїЇєЄ\s]{2,50}$/, "Ім'я повинно містити лише літери (від 2 до 50 символів).");
const validateAge = createValidator(/^\d{2,3}$/, "Вік повинен бути числом.");

// ==========================================
// Модуль 2: Об'єктно-орієнтоване програмування
// ==========================================

// Базовий клас
class ResumeBlock {
    constructor(title) {
        this._title = title; // Інкапсуляція
    }

    // Геттер
    get title() {
        return this._title;
    }

    render() {
        return `<h3>${this.title}</h3>`;
    }
}

// Наслідування
class PersonalInfo extends ResumeBlock {
    constructor(name, age, location) {
        super("Особисті дані");
        this.name = name; // Виклик сеттера для валідації
        this.age = age;   // Виклик сеттера для валідації
        this.location = location;
    }

    set name(value) {
        this._name = validateName(value);
    }
    get name() { return this._name; }

    set age(value) {
        const numAge = Number(validateAge(value)); // Переведення в число
        if (numAge < 16 || numAge > 100) throw new Error("Вік має бути від 16 до 100 років.");
        this._age = numAge;
    }
    get age() { return this._age; }

    render() {
        return `
            ${super.render()}
            <p><strong>Ім'я:</strong> ${this.name}</p>
            <p><strong>Вік:</strong> ${this.age} років</p>
            <p><strong>Місто:</strong> ${this.location}</p>
        `;
    }
}

class Education extends ResumeBlock {
    constructor(institution, specialty) {
        super("Освіта");
        this.institution = institution;
        this.specialty = specialty;
    }

    render() {
        return `
            ${super.render()}
            <p><strong>Заклад:</strong> ${this.institution}</p>
            <p><strong>Спеціальність:</strong> ${this.specialty}</p>
        `;
    }
}

class Experience extends ResumeBlock {
    constructor(description) {
        super("Досвід та проекти");
        this.description = description;
    }

    render() {
        return `
            ${super.render()}
            <p>${this.description}</p>
        `;
    }
}

class Skills extends ResumeBlock {
    constructor(skillsString) {
        super("Ключові навички");
        // Перетворення рядка в масив
        this.skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
    }

    render() {
        const skillsList = this.skillsArray.map(skill => `<li>${skill}</li>`).join('');
        return `
            ${super.render()}
            <ul>${skillsList}</ul>
        `;
    }
}

// Головний клас для збірки резюме
class Resume {
    constructor(personalInfo, education, experience, skills) {
        this.personalInfo = personalInfo;
        this.education = education;
        this.experience = experience;
        this.skills = skills;
    }

    renderToDOM(elementId) {
        const container = document.getElementById(elementId);
        container.innerHTML = `
            ${this.personalInfo.render()}
            ${this.education.render()}
            ${this.experience.render()}
            ${this.skills.render()}
        `;
    }
}

// ==========================================
// Модуль 3: Робота з DOM, подіями та localStorage
// ==========================================

const form = document.getElementById('resume-form');
const loadBtn = document.getElementById('load-btn');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки

    try {
        // Збір даних з полів
        const nameData = document.getElementById('name').value;
        const ageData = document.getElementById('age').value;
        const locData = document.getElementById('location').value;
        const uniData = document.getElementById('uni').value;
        const specData = document.getElementById('spec').value;
        const expData = document.getElementById('exp').value;
        const skillsData = document.getElementById('skills').value;

        // Ініціалізація об'єктів з валідацією
        const personalInfo = new PersonalInfo(nameData, ageData, locData);
        const education = new Education(uniData, specData);
        const experience = new Experience(expData);
        const skills = new Skills(skillsData);

        const resume = new Resume(personalInfo, education, experience, skills);

        // Відображення на сторінці
        resume.renderToDOM('resume-output');

        // Збереження у localStorage
        const resumeData = { nameData, ageData, locData, uniData, specData, expData, skillsData };
        localStorage.setItem('savedResume', JSON.stringify(resumeData));
        
        console.log("Резюме успішно згенеровано та збережено!");

    } catch (error) {
        // Обробка помилок валідації через alert та консоль
        alert(`Помилка створення резюме: ${error.message}`);
        console.error(error);
    }
});

// Додатково: Завантаження даних з localStorage
loadBtn.addEventListener('click', () => {
    const savedData = localStorage.getItem('savedResume');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('name').value = data.nameData;
        document.getElementById('age').value = data.ageData;
        document.getElementById('location').value = data.locData;
        document.getElementById('uni').value = data.uniData;
        document.getElementById('spec').value = data.specData;
        document.getElementById('exp').value = data.expData;
        document.getElementById('skills').value = data.skillsData;
        alert("Дані успішно завантажено з localStorage!");
    } else {
        alert("Збережених даних не знайдено.");
    }
});