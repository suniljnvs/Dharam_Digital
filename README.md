# Dharam_Digital

Please find detailed description of the task below.

 

1. Create expressjs app listening on port 5002.

2. Create connection with mongodb server with mongoose.

3. Create users collection in mongodb which should be used for storing user credentials in structure of your choice.

4. Create login endpoint at /api/login which should accept username and password and make user login through session. You may use in memory storage for sessions or may also use redis for storing sessions.

5. Add middleware in expressjs app that protected paths starting with /api/admin. Paths starting with /api/admin should be accessible only to logged in users.

6. Create campaigns collection to store following information about each campaign : id, short_token, name, offers (array), enabled (boolean). Each object in offers array should contain following information : offer_url, ratio_percentage. Note that, short_token field should have unique index defined.

7. Create new endpoint /api/redirect which should accept short_token in query parameter, use it to find campaign. If campaign is not found or not enabled, serve error accordingly. If campaign is matched and enabled, redirect user to appropriate offer_url found from offers array. Please note that incoming valid requests should be distributed in manner that ratio_percentage mentioned in offer object is maintained. Before redirection, replace macro {click_id} if present in offer_url with value received in click_id query parameter.

8. Create api endpoint at /api/admin/campaigns/:id/toggle which should enable or disable campaign with its _id.

9. When process exists gracefully or due to any error, make sure to close mongodb client connection and close express http server.

 

Example

Suppose there is campaign with short_token = 12345 and campaign is enabled. The campaign contains array of 2 offers, each offer with following details : 

1. offer_url = http://google.com/?click={click_id} , ratio_percentage = 30

2. offer_url = http://microsoft.com/?msclickid={click_id} , ratio_percentage = 70

The GET request on /api/redirect?short_token=12345&click_id=egwkeuyeurcdkvdi3 should redirect user to offer_url from above array in a manner that their distribution percentages are maintained. Suppose user makes 100 requests to this endpoint, roughly 30 should go to http://google.com/?click=egwkeuyeurcdkvdi3 and 70 should go to http://microsoft.com/?msclickid=egwkeuyeurcdkvdi3

 

In case of any doubts, please mail your query at sachin@dharam.net while keeping hr@dharam.net in CC. Deadline for this task is 24 hours upon receipt of the task.