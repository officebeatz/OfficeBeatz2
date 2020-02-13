<p align="center">
  <img src="https://github.com/CodyMichaelSimmons/OfficeBeatZ/blob/master/public/images/officebeatz-banner.png" width="600">
</p>

Welcome to OfficeBeatZ (formerly known as the EmployeeWellnessProject), a simple web application designed to get you out of your seat and on your feet. Prolonged sitting even for as little as one hour, damages the health of our vessels, and over time increases our risk of cardiovascular disease. Standing, stretching, or taking a short walk every 30-60 minutes can help to lessen the damaging effects of sitting.

OfficeBeatZ will help improve your health by reminding you to get up and move through the power of your favorite songs. Unlike boring or annoying alarm reminders, OfficeBeatz, we hope, will facilitate a fun, energizing environment in your workplace, all while improving your health!

### Wiki & General Use (under construction)

~~For general information regarding this project, please consult the [Wiki](https://github.com/CodyMichaelSimmons/EmployeeWellnessProject/wiki). The wiki contains much of the information regarding general use of the app and basic instructions.~~

### Basic Setup

To get your local files setup to make your own changes:

1. Change to an empty directory and run `git clone https://github.com/officebeatz/OfficeBeatz2.git`
1. After the files are cloned, run `npm install` in the new directory to download dependencies.
1. To run the app locally, you will need to have the Dropbox token set as a local variable on your computer.
1. Once your token has been setup, using the command `npm start` will start the process on port 3752. You can access the app at http://localhost:3752/

### Running Tests

To run tests, run the command `npm test` in your terminal while in the app directory.

### Contributing

#### Creating a new branch
We want the `master` branch to always be deployable, so when we want to add features, make improvements, or fix bugs, we should create a new branch. Then, when our work is done, we can merge our changes into `master`.

1. `git pull master` -- Make sure you've pulled the latest version of `master` before you start working; otherwise, your new branch will be missing changes (and will take more work to be merged).
1. `git checkout master` -- Also make sure you're checked out on master, which will be used as a base to create the new branch.
1. `git checkout -b <readable-name-of-feature-or-bug-fix>` -- Create the new branch you'll be working on. Name the branch something that would make sense to someone else!
1. `git push` -- Finally, send your new branch to the repo (to make sure nobody else takes the name!). Now, you're ready to start working on your new branch.

#### Working with commits
When you make changes, you need to go through a couple steps to "commit" them to the branch. Otherwise, your changes won't be mergeable!

1. `git status` -- View what files you've changed (as well as double-check which branch you're on!). Make sure you're on the right branch (the branch you made, not `master`).
> ![git-status](https://user-images.githubusercontent.com/45740348/73891523-6bb09f00-4842-11ea-80d6-c9e9d458861d.png)

1. `git diff` -- Double check what's changed by viewing the "diff" which highlights the differences between the last commit, and your unstaged changes. Note that once you add a change ("staged the change"), it won't appear in the diff.
1. `git add <name-of-changed-file>` -- Select the changes you want to commit by "adding" the file that contains the change. You can add multiple files in succession, or add all your changes at once using `git add -A`. You can use `git status` again to see what files you've added (ie "staged for commit"). Note that if you modify the file again after staging it, you'll have to re-stage the file.
1. `git commit -m "<description of your commit>"` -- Once you're ready to commit, write a brief but descriptive sentence that explains the changes you've made. If you want to add changes to your previous commit (rather than creating a new commit), use `git commit --amend --no-edit`. Note that the `--no-edit` flag allows you to bypass retyping your commit message. You can also use a different flag to update your commit message with `git commit --amend -m "<description of your commit>"`.
1. `git push --set-upstream origin <your-branch-name>` -- Finally, push your commits from your local repository to the remote repository (so that other people can see your changes). If it's the first time you're pushing from this branch, you'll need to set the destination of the push to "origin" which is the remote repository hosted on Github. After you push from this branch once, you can just use `git push`.

Try not to push commits unless you're completely sure they're done. If you'd like to change commits after you pushed or merge multiple commits into one, it's possible but a little tricky, so talk to Jason (the tech lead) for help!

####  Merging the branch into master
However, your changes are still only in your branch that you made; if you want your changes to be deployed, you'll need to submit a merge request. A merge request is basically a formal review process for your code, and at the end of it, your branch (along with the changes you made) will be "merged" into `master`. Then, anybody that pulls from master will also pull all of the changes you made!

1. `git status` / `git log` / `git push` -- Confirm that your changes have been committed, double-check your past commits, and push your commits to the remote repository (if you haven't already).
1. Go to the [github repo](https://github.com/officebeatz/OfficeBeatz2) and click **Compare & pull request**.
![github-pull-request](https://user-images.githubusercontent.com/18102685/73891974-92bba080-4843-11ea-8f9e-86bf88873f33.png)
1. Add any context/description/notes about your changes, and then you're good to go! Generally, try to list the changes you made, and add any comments you think might help others review your code.
1. **Ask someone to review your code.** -- Changing master (including pull requests) is a protected branch, so it requires at least one reviewer to *approve* your pull request.
1. Click **Merge**! -- Once your code has been reviewed (and nothing breaks when you run it on your local), then click merge! If there are merge conflicts, then feel free to ask Jason (the tech lead) to merge it for you.

### Deploying

To deploy `master` after changes have been made, go to the app on Heroku and click the `Deploy` option. It will ask which branch you want to deploy: select `master`. If any errors occur, Heroku will abort the process and give you an error message.

~~Production can be found [here](http://officebeatz.net/). And beta / staging can be found [here](http://beta.officebeatz.net/).~~


Howdy =) -Garrett