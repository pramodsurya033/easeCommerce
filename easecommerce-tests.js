import { Selector } from 'testcafe';

const loginPageURL = 'https://easecommerce.in/app/login';

fixture `EaseCommerce UI Automation`
    .page(loginPageURL); 

// Test data
const credentials = {
    username: 'demouser@easecommerce.in',
    password: 'cE7iQPP^'
};

// Selectors
const usernameInput = Selector('input[name="username"]');
const passwordInput = Selector('input[name="password"]');
const loginButton = Selector('button').withText('Login');
const tripleDotsButton = Selector('.triple-dots'); // Adjust selector for triple dots menu
const employeeViewOption = Selector('li').withText('Employee View'); // Adjust selector for menu option
const addTaskButton = Selector('button').withText('Add Task');
const taskNameInput = Selector('input[name="taskName"]'); // Adjust based on form input names
const taskDescriptionInput = Selector('textarea[name="taskDescription"]');
const submitTaskButton = Selector('button').withText('Submit');
const taskList = Selector('.task-list'); // Adjust based on the Task List DOM
const errorMessage = Selector('.error-message'); // Adjust based on form validation messages

test('Login Test', async t => {
    await t
        // Open login page and enter credentials
        .typeText(usernameInput, credentials.username)
        .typeText(passwordInput, credentials.password)
        .click(loginButton)
        // Verify redirection to dashboard/home
        .expect(Selector('.dashboard').exists).ok('Failed to navigate to the dashboard/home page');
});

test('Switch to Employee View', async t => {
    await t
        // Perform login
        .typeText(usernameInput, credentials.username)
        .typeText(passwordInput, credentials.password)
        .click(loginButton)
        // Switch to Employee View
        .click(tripleDotsButton)
        .click(employeeViewOption)
        // Verify redirection to employee section
        .expect(Selector('.employee-section').exists).ok('Failed to navigate to Employee View')
        // Verify Task Section opens by default
        .expect(Selector('.task-section').exists).ok('Task Section did not open by default');
});

test('Task Creation', async t => {
    await t
        // Perform login and switch to Employee View
        .typeText(usernameInput, credentials.username)
        .typeText(passwordInput, credentials.password)
        .click(loginButton)
        .click(tripleDotsButton)
        .click(employeeViewOption)
        // Open Add Task form
        .click(addTaskButton)
        // Fill task form and submit
        .typeText(taskNameInput, 'Sample Task Name')
        .typeText(taskDescriptionInput, 'Sample Task Description')
        .click(submitTaskButton)
        // Verify task appears in the Task List page
        .expect(taskList.withText('Sample Task Name').exists).ok('Task creation failed');
});

test('Form Validation and Negative Test Cases', async t => {
    await t
        // Perform login and switch to Employee View
        .typeText(usernameInput, credentials.username)
        .typeText(passwordInput, credentials.password)
        .click(loginButton)
        .click(tripleDotsButton)
        .click(employeeViewOption)
        // Open Add Task form
        .click(addTaskButton)
        // Leave form fields empty and try submitting
        .click(submitTaskButton)
        // Verify validation error
        .expect(errorMessage.withText('Task name is required').exists).ok('Validation for missing Task Name failed')
        .expect(errorMessage.withText('Task description is required').exists).ok('Validation for missing Task Description failed')
        // Ensure submit button remains disabled
        .expect(submitTaskButton.hasAttribute('disabled')).ok('Submit button should remain disabled until all fields are filled')
        // Correct missing fields and verify submission
        .typeText(taskNameInput, 'Valid Task Name')
        .click(submitTaskButton)
        .expect(errorMessage.withText('Task description is required').exists).ok('Validation for Task Description failed');
});