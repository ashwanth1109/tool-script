# Tool Script

This is a web app that comprises of a set of tools that help automate some of the work associated with writing unit tests in Angular JS.

It currently generates boilerplate snippets for source files that are factories, services, controllers and directives with their stub dependencies.

## How to run the project?

1. Clone the repo
2. `npm install` to install all the dependencies
3. `npm start` to run the project locally
4. `npm run build` if you are looking to build the project for production
5. `npm run rebuild` if you are looking to rebuild for deployment. Prefer this command to `npm run build`.
6. Any changes made to master and rebuilt is automatically configured to be deployed to the site.

## How to use the tool?

Snippet Generation:

- Copy the AngularJS source file and paste it into the textarea on the left half of the screen.
- Click on 'Factory', 'Service', 'Directive' or 'Controller' based on what kind of source file you are generating the initialization test for.
- The boilerplate code is generated and is automatically copied to your clipboard for you to paste into your IDE and run. (There might be a few errors for some source files. Please report any issues with a link to the source file to debug the issue)
