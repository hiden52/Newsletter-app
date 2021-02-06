const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailChimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config(); // env 환경설정 파일을 로드하기 위한 모듈

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/html/signup.html");
});

app.post("/", (req, res) => {
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;
	//console.log(firstName, lastName, email);

	// const data = {
	// 	members: [
	// 		{
	// 			email_address: email,
	// 			status: "subscribed",
	// 			merge_fields: {
	// 				FNAME: firstName,
	// 				LNAME: lastName,
	// 			},
	// 		},
	// 	],
	// };

	//const jsonData = JSON.stringify(data);

	//const url = "https://us7.api.mailchimp.com/3.0/lists/" + listId;

	// const options = {
	// 	method: "POST",
	// 	auth: "saigony:" + mailChimpApiKey,
	// };

	// --without mailchimp client library--
	// const request = https.request(url, options, (response) => {
	// 	response.on("data", (data) => {
	// 		console.log(JSON.parse(data));
	// 	});
	// });
	// request.write(jsonData);
	// request.end();

	const subscribeingUser = {
		firstName: firstName,
		lastName: lastName,
		email: email,
	};
	// Setting api key and server

	const listId = process.env.LIST_ID; // in .env

	const run = async () => {
		try {
			const response = await mailChimp.lists.addListMember(listId, {
				email_address: subscribeingUser.email,
				status: "subscribed",
				merge_fields: {
					FNAME: subscribeingUser.firstName,
					LNAME: subscribeingUser.lastName,
				},
			});
			console.log(response);
			res.sendFile(__dirname + "/html/success.html");
		} catch (error) {
			console.log(error);
			console.log("Error");
			res.sendFile(__dirname + "/html/failure.html");
		}
	};

	run();
}); 

// Click button -> redirect to main page
app.post("/failure", (req, res) => {
	res.redirect("/");
});

const mailChimpApiKey = process.env.API_KEY; //	in .env
mailChimp.setConfig({
	apiKey: mailChimpApiKey,
	server: "us7",
});

app.listen(port, () => {
	console.log("Server is running on port" + port);
});
