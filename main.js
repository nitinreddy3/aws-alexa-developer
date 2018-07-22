var AWS = require("aws-sdk");
var fs = require("fs");
const uuidv1 = require("uuid/v1");

AWS.config.update({
  region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing questions into DynamoDB. Please wait.");

var questions = JSON.parse(fs.readFileSync("questions.json", "utf8"));
questions.forEach(function(question) {
  var params = {
    TableName: "Questions",
    Item: {
      ID: uuidv1(),
      Category: question.category,
      Question: question.question,
      Answers: question.answers,
      Correct: question.correct
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error(
        "Unable to add question",
        question.question,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", question.question);
    }
  });
});
