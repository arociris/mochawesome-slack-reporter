const reporter = require('mochawesome-slack-reporter');

const slackURL = ""; //Replace
const title = "Test report"; //replace
const info = "master_branch"; //replace
const pipeLineLink = "https://github.com/jain-neeeraj/mochawesome-slack-reporter"; //replace
const additionalLink = "https://github.com/jain-neeeraj/mochawesome-slack-reporter"; //replace, may be a link to automation dashboard

(async () => {
    await reporter.pushToSlack({
        slackWebHookUrl: slackURL,
        pathToReport: 'mochawesome-report/mochawesome.json',
        publishPassed: true,
        title: title,
        info: info,
        link: pipeLineLink,
        extraLink:{link:additionalLink,text:"Link to auto dashboard"}
    }).catch((err) => {
        console.log("error occurred")
    })
})()