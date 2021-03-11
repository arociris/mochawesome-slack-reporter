const path = require('path');
let regexPattern = /@\w*/g

let testArray = [];

function getTestFromResults(res) {
    testArray.push(...res.tests);
    if (res.suites.length == 0)
        return;
    res.suites.forEach((suite) => getTestFromResults(suite));
}

function prepareTestResults(obj) {
    obj.forEach((res) => getTestFromResults(res))
}


function extract_failed_tests() {
    let results = []
    for (test of testArray) {
        if (test.fail) {
            let tags = test.fullTitle.match(regexPattern)
            if (!Array.isArray(tags)) {
                continue;
            }
            for (tag of tags) {
                if (!results[tag]) {
                    Object.assign(results, {[tag]: 1})
                    continue;
                }
                results[tag] = ++results[tag]
            }
        }
    }
    return results;
}

function extract_pass_tests() {
    let results = [];
    for (test of testArray) {
        if (test.pass) {
            let tags = test.fullTitle.match(regexPattern)
            if (!Array.isArray(tags)) {
                continue;
            }
            for (tag of tags) {
                if (!results[tag]) {
                    Object.assign(results, {[tag]: 1})
                    continue;
                }
                results[tag] = ++results[tag]
            }
        }
    }
    return results;
}

function results_to_markdown(res) { //Markdown table not yet supported by slack
    let markdown = "| feature |count  |\n|--|--|\n"
    for (tag in res) {
        let nextLine = `| ${tag} | ${res[tag]} |\n`
        markdown = markdown + nextLine
    }
    return markdown
}

function results_to_slack_fields_format(fileLocation, publishPassed, title, info, link) {
    let reportData = require(path.join(process.cwd(), fileLocation))
    let output = require('./tpl.json');
    prepareTestResults(reportData.results);
    let res_fails = extract_failed_tests();
    let res_pass = extract_pass_tests();
    output.attachments[0].fields[0].title = `Tests: ${reportData.stats.passes+reportData.stats.failures}`;
    output.attachments[0].fields[0].value = `Failures: ${reportData.stats.failures}`;
    if (title)
        output.attachments[0].title = title;
    if (info)
        output.attachments[0].footer = info;
    if (link)
        output.attachments[0].title_link = link;
    if (publishPassed) {
        for (tag in res_pass) { //Need to add sections as Slack does not support more than 10 fields in one section
            let data = {
                type: "section",
                fields: [{
                    "type": "plain_text",
                    "text": "",
                    "emoji": true
                }, {
                    "type": "mrkdwn",
                    "text": ""
                }]
            }
            data.fields[0].text = tag
            data.fields[1].text = res_pass[tag].toString()
            output.attachments[2].blocks.push(data)
        }
    } else
        delete output.attachments[2]
    if (reportData.stats.failures != 0) {
        output.attachments[0].color = '#b3001b'
        for (tag in res_fails) { //Need to add sections as Slack does not support more than 10 fields in one section
            let data = {
                type: "section",
                fields: [{
                    "type": "plain_text",
                    "text": "",
                    "emoji": true
                }, {
                    "type": "mrkdwn",
                    "text": ""
                }]
            }
            data.fields[0].text = tag
            data.fields[1].text = res_fails[tag].toString()
            output.attachments[1].blocks.push(data)
        }
    } else
        delete output.attachments[1]

    return output
}


module.exports = {
    results_to_slack_fields_format
}


