# EasyReading - How to get started with development

## Setup:
1. Download the Repo. Navigate a console to the location of the files and install the dependencies with ```npm install```. <br>
Create a mysql database called “easyreading” with user: root password: Root%$123. I suggest using the tool XAMPP, as it makes this very easy. You can find it here:  ```https://www.apachefriends.org/de/download.html```<br><br>
```npm start``` - If everything is working, there should be no errors and your console should end with the following message:<br>
``` Init server complete ```<br>

2. Get the Repo for the extension <br><br>
Chrome: 
``` https://github.com/IISJKU/easy-reading-chrome-extension ``` <br>
Firefox:
``` https://github.com/IISJKU/easy-reading-firefox-extension ``` <br>
By default, this extension uses the cloudendpoint easyreading-cloud.eu - we want to use loacalhost (aka the one that we just launched)<br>
To do this, you need to change the file (which you find in the extension folder) ```EasyReading/background/easy-reading.js``` <br>
```
getDefaultConfig: function () {
    return {
      cloudEndpointIndex: 2,
    };
  },
```
Normally this says ```cloudEndpointIndex: 0```, which points to the production-server easyreading-cloud.eu. Using ```cloudEndpointIndex: 2```, points us to localhost.<br>
Reimport the extension. <br>
If everything worked out, the paths should now look like: ```https://localhost:8080/client/setup```, which means it is using our local easyreading install. <br>
If the url still says “easyreading” then you have done something wrong. 

<br>

To make plugin development easier, i suggest going to ```components/plugins/test-plugin``` in this repo and change it to your liking. 
