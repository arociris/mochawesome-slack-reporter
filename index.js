const superagent = require('superagent');
const dataPreparer = require('./prepare_feature_numbers');

const pushToSlack = async ({slackWebHookUrl, pathToReport, publishPassed, title, info, link}) => {
    const url = slackWebHookUrl || process.env.slacKWebHookUrl
    if (!url) {
        console.error("No web hook URL provided for slack posting. Exiting...");
        return
    }
    const path = pathToReport||'./mochawesome-report/mochawesome.json';
    const formatted_data = dataPreparer.results_to_slack_fields_format(path, publishPassed,title,info,link);
    try {
        const res = await superagent.post(slackWebHookUrl).send(formatted_data)
        console.log("Slack message response code : "+ res.statusCode);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    pushToSlack
}
