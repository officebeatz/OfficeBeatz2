<p align="center"> 
  <img src="https://github.com/CodyMichaelSimmons/OfficeBeatZ/blob/master/public/images/officebeatz-banner.png" width="600">
</p>

Welcome to OfficeBeatZ (formerly known as the EmployeeWellnessProject), a simple web application designed to get you out of your seat and on your feet. Prolonged sitting even for as little as one hour, damages the health of our vessels, and over time increases our risk of cardiovascular disease. Standing, stretching, or taking a short walk every 30-60 minutes can help to lessen the damaging effects of sitting.


OfficeBeatZ will help improve your health by reminding you to get up and move through the power of your favorite songs. Unlike boring or annoying alarm reminders, OfficeBeatz, we hope, will facilitate a fun, energizing environment in your workplace, all while improving your health!

### Wiki & General Use

For general information regarding this project, please consult the [Wiki](https://github.com/CodyMichaelSimmons/EmployeeWellnessProject/wiki). The wiki contains much of the information regarding general use of the app and basic instructions.

### Basic Setup

To get your local files setup to make your own changes:

1. Change to an empty directory and run `git clone https://github.com/officebeatz/OfficeBeatZ.git`
1. After the files are cloned, run `npm install` in the new directory to download dependencies.
1. To run the app locally, you will need to have the Dropbox token set as a local variable on your computer.
1. Once your token has been setup, using the command `npm start` will start the process on port 3752. You can access the app at http://localhost:3752/

### Running Tests

To run tests, run the command `npm test` in your terminal while in the app directory.

### Deploying

To deploy a branch after changes have been made, go to the app on Heroku and click the `Deploy` option. It will ask which branch you want to deploy. Select the most recently edited branch. If any errors occur, Heroku will abort the process and give you an error message.

Production can be found [here](http://officebeatz.net/). And beta / staging can be found [here](http://beta.officebeatz.net/).
