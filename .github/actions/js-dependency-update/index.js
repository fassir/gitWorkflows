const core = require('@actions/core');
const exec = require('@actions/exec');

const validateBranchName = ({ branchName }) =>
  /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({ dirName }) =>
  /^[a-zA-Z0-9_\-\/]+$/.test(dirName);

async function run(){
    const baseBranch = core.getInput('base-branch', { required: true });
    const headBranch = core.getInput('head-branch', { required: true });
    const ghToken = core.getInput('gh-token', { required: true });
    const workingDir = core.getInput('working-directory', { required: true });
    const debug = core.getBooleanInput('debug');
    const logger = setupLogger({ debug, prefix: '[js-dependency-update]' });

    core.setSecret(ghToken);
    
    if (!validateBranchName({ branchName: baseBranch })) {
        core.setFailed(
            'Invalid base-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots, and forward slashes.'
        );
        return;
    }

    if (!validateBranchName({ branchName: headBranch })) {
        core.setFailed(
            'Invalid head-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots, and forward slashes.'
        );
        return;
     }

    if (!validateDirectoryName({ dirName: workingDir })) {
        core.setFailed(
            'Invalid working directory name. Directory names should include only characters, numbers, hyphens, underscores, and forward slashes.'
        );
        return;
    }

    core.info(`[js-dependency-update] : base branch is ${baseBranch}`);
    core.info(`[js-dependency-update] : target branch is ${targetBranch}`);
    core.info(`[js-dependency-update] : working directory is ${baseBranch}`);

    await exec.exec('npm update', [],{
        cwd: workingDir

    });

    const gitStatus = await exec.getExecOutput('git status -s package*.json',[],{
        cwd:workingDir

    });
    if(gitStatus.stdout.length > 0){
        core.info('[js-dependency-update],There are updates avaliable')
    } else{
        core.info('[js-dependency-update],No updates at this point in time')
    }

    core.info('I am a custom JS action');
}

run()