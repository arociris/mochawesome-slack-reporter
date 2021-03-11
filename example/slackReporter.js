const reporter = require('mochawesome-slack-reporter');

const slackURL = ""; //Replace
const title = "Test report"; //replace
const info = "master_branch"; //replace
const pipeLineLink = "https://github.com/jain-neeeraj/mochawesome-slack-reporter"; //replace

(async () => {
    await reporter.pushToSlack({
        slackWebHookUrl: slackURL,
        pathToReport: 'mochawesome-report/mochawesome.json',
        publishPassed: true,
        title: title,
        info: info,
        link: pipeLineLink
    }).catch((err) => {
        console.log("error occurred")
    })
})()