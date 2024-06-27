#!  /usr/bin/env node


import inquirer from "inquirer";
import chalk from "chalk";



// Student class definition
class Student {
    private static idCounter = 10000;
    id: string;
    name: string;
    age: number;
    coursesEnroll: string[];
    feesAmount: number;
    balance: number;

    constructor(name: string, age: number, coursesEnroll: string[], feesAmount: number) {
        this.id = Student.generateId();
        this.name = name;
        this.age = age;
        this.coursesEnroll = coursesEnroll;
        this.feesAmount = feesAmount;
        this.balance = feesAmount;
    }

    private static generateId(): string {
        return (Student.idCounter++).toString();
    }

    enroll(course: string) {
        this.coursesEnroll.push(course);
    }

    viewBalance(): number {
        return this.balance;
    }

    payTuition(amount: number) {
        this.balance -= amount;
    }

    showStatus() {
        console.log(chalk.blue(`Name: ${this.name}`));
        console.log(chalk.blue(`ID: ${this.id}`));
        console.log(chalk.blue(`Age: ${this.age}`));
        console.log(chalk.blue(`Courses Enrolled: ${this.coursesEnroll.join(', ')}`));
        console.log(chalk.blue(`Balance: $${this.balance}`));
    }
}

// Main logic to manage students
let studentList: Student[] = [];

async function addStudent() {
    const answers = await inquirer.prompt([
        { name: 'name', type: 'input', message: 'Enter student name:' },
        { name: 'age', type: 'input', message: 'Enter student age:', validate: (input) => !isNaN(input) },
        { name: 'coursesEnroll', type: 'input', message: 'Enter courses (comma separated):' },
        { name: 'feesAmount', type: 'input', message: 'Enter fees amount:', validate: (input) => !isNaN(input) },
    ]);

    const courses = answers.coursesEnroll.split(',').map((course: string) => course.trim());
    const student = new Student(answers.name, parseInt(answers.age), courses, parseFloat(answers.feesAmount));
    
    studentList.push(student);
    console.log(chalk.green('Student added successfully!'));
}

async function mainMenu() {
    let continueEnrollment = true;

    while (continueEnrollment) {
        const action = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Choose an action:',
            choices: ['Add Student', 'Enroll in Course', 'View Balance', 'Pay Tuition', 'Show Status', 'Exit']
        });

        switch (action.action) {
            case 'Add Student':
                await addStudent();
                break;
            case 'Enroll in Course':
                await enrollInCourse();
                break;
            case 'View Balance':
                await viewBalance();
                break;
            case 'Pay Tuition':
                await payTuition();
                break;
            case 'Show Status':
                await showStatus();
                break;
            case 'Exit':
                continueEnrollment = false;
                break;
        }
    }
}

async function enrollInCourse() {
    const { id, course } = await inquirer.prompt([
        { name: 'id', type: 'input', message: 'Enter student ID:' },
        { name: 'course', type: 'input', message: 'Enter course to enroll:' }
    ]);

    const student = studentList.find(s => s.id === id);
    if (student) {
        student.enroll(course);
        console.log(chalk.green(`Enrolled in course ${course}`));
    } else {
        console.log(chalk.red('Student not found'));
    }
}

async function viewBalance() {
    const { id } = await inquirer.prompt([
        { name: 'id', type: 'input', message: 'Enter student ID:' }
    ]);

    const student = studentList.find(s => s.id === id);
    if (student) {
        console.log(chalk.green(`Current balance: $${student.viewBalance()}`));
    } else {
        console.log(chalk.red('Student not found'));
    }
}

async function payTuition() {
    const { id, amount } = await inquirer.prompt([
        { name: 'id', type: 'input', message: 'Enter student ID:' },
        { name: 'amount', type: 'input', message: 'Enter amount to pay:', validate: (input) => !isNaN(input) }
    ]);

    const student = studentList.find(s => s.id === id);
    if (student) {
        student.payTuition(parseFloat(amount));
        console.log(chalk.green(`Paid $${amount}. New balance: $${student.viewBalance()}`));
    } else {
        console.log(chalk.red('Student not found'));
    }
}

async function showStatus() {
    const { id } = await inquirer.prompt([
        { name: 'id', type: 'input', message: 'Enter student ID:' }
    ]);

    const student = studentList.find(s => s.id === id);
    if (student) {
        student.showStatus();
    } else {
        console.log(chalk.red('Student not found'));
    }
}

// Start the main menu
mainMenu();





